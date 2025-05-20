const { Worker, Department, Position, UserProfile } = require('../models');
const BaseController = require('./baseController');
const { Op } = require('sequelize');

class WorkerController extends BaseController {
  static async getAll(req, res) {
    await this.handleRequest(req, res, async () => {
      const {
        department,
        position,
        search,
        page = 1,
        limit = 10,
        sortBy = 'lastName',
        sortOrder = 'ASC'
      } = req.query;

      const where = {};
      if (department) where.departmentId = department;
      if (position) where.positionId = position;
      if (search) {
        where[Op.or] = [
          { firstName: { [Op.iLike]: `%${search}%` } },
          { lastName: { [Op.iLike]: `%${search}%` } },
          { secondName: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;
      const { count, rows: workers } = await Worker.findAndCountAll({
        where,
        include: [
          { model: Department, as: 'department' },
          { model: Position, as: 'position' },
          {
            model: UserProfile,
            as: 'userProfile',
            attributes: ['id', 'username', 'email', 'fullName']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        workers,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      };
    });
  }

  static async getById(req, res) {
    await this.handleRequest(req, res, async () => {
      const worker = await Worker.findByPk(req.params.id, {
        include: [
          { model: Department, as: 'department' },
          { model: Position, as: 'position' },
          {
            model: UserProfile,
            as: 'userProfile',
            attributes: ['id', 'username', 'email', 'fullName']
          },
          {
            model: Task,
            as: 'assignedTasks',
            include: [
              { model: TaskStatus, as: 'status' },
              { model: TaskPriority, as: 'priority' }
            ]
          },
          {
            model: Task,
            as: 'responsibleTasks',
            include: [
              { model: TaskStatus, as: 'status' },
              { model: TaskPriority, as: 'priority' }
            ]
          }
        ]
      });

      if (!worker) {
        throw this.handleNotFoundError('Worker not found');
      }

      return worker;
    });
  }

  static async create(req, res) {
    await this.handleRequest(req, res, async () => {
      const {
        firstName,
        lastName,
        secondName,
        departmentId,
        positionId,
        userProfileId
      } = req.body;

      // Check if user profile exists and is not already associated with a worker
      if (userProfileId) {
        const existingWorker = await Worker.findOne({
          where: { userProfileId }
        });
        if (existingWorker) {
          throw this.handleValidationError({
            errors: [{
              path: 'userProfileId',
              message: 'User profile is already associated with a worker'
            }]
          });
        }
      }

      const worker = await Worker.create({
        firstName,
        lastName,
        secondName,
        departmentId,
        positionId,
        userProfileId
      });

      return await this.getById({ params: { id: worker.id } }, res);
    });
  }

  static async update(req, res) {
    await this.handleRequest(req, res, async () => {
      const worker = await Worker.findByPk(req.params.id);
      if (!worker) {
        throw this.handleNotFoundError('Worker not found');
      }

      const {
        firstName,
        lastName,
        secondName,
        departmentId,
        positionId,
        userProfileId
      } = req.body;

      // Check if new user profile is not already associated with another worker
      if (userProfileId && userProfileId !== worker.userProfileId) {
        const existingWorker = await Worker.findOne({
          where: { userProfileId }
        });
        if (existingWorker) {
          throw this.handleValidationError({
            errors: [{
              path: 'userProfileId',
              message: 'User profile is already associated with a worker'
            }]
          });
        }
      }

      await worker.update({
        firstName,
        lastName,
        secondName,
        departmentId,
        positionId,
        userProfileId
      });

      return await this.getById({ params: { id: worker.id } }, res);
    });
  }

  static async delete(req, res) {
    await this.handleRequest(req, res, async () => {
      const worker = await Worker.findByPk(req.params.id);
      if (!worker) {
        throw this.handleNotFoundError('Worker not found');
      }

      // Check if worker has associated tasks
      const hasTasks = await Task.findOne({
        where: {
          [Op.or]: [
            { assignedToId: worker.id },
            { responsibleId: worker.id }
          ]
        }
      });

      if (hasTasks) {
        throw this.handleValidationError({
          errors: [{
            path: 'id',
            message: 'Cannot delete worker with associated tasks'
          }]
        });
      }

      await worker.destroy();
      return { message: 'Worker deleted successfully' };
    });
  }
}

module.exports = WorkerController; 