const { Position, Department, Worker } = require('../models');
const BaseController = require('./baseController');
const { Op } = require('sequelize');

class PositionController extends BaseController {
  static async getAll(req, res) {
    await this.handleRequest(req, res, async () => {
      const { department, search } = req.query;

      const where = {};
      if (department) where.departmentId = department;
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const positions = await Position.findAll({
        where,
        include: [
          { model: Department, as: 'department' },
          { model: Worker, as: 'workers' }
        ],
        order: [['name', 'ASC']]
      });

      return positions;
    });
  }

  static async getById(req, res) {
    await this.handleRequest(req, res, async () => {
      const position = await Position.findByPk(req.params.id, {
        include: [
          { model: Department, as: 'department' },
          {
            model: Worker,
            as: 'workers',
            include: [{ model: Department, as: 'department' }]
          }
        ]
      });

      if (!position) {
        throw this.handleNotFoundError('Position not found');
      }

      return position;
    });
  }

  static async create(req, res) {
    await this.handleRequest(req, res, async () => {
      const { name, description, departmentId } = req.body;

      // Check if department exists
      const department = await Department.findByPk(departmentId);
      if (!department) {
        throw this.handleValidationError({
          errors: [{
            path: 'departmentId',
            message: 'Department not found'
          }]
        });
      }

      // Check if position with same name exists in the department
      const existingPosition = await Position.findOne({
        where: {
          name,
          departmentId
        }
      });

      if (existingPosition) {
        throw this.handleValidationError({
          errors: [{
            path: 'name',
            message: 'Position with this name already exists in the department'
          }]
        });
      }

      const position = await Position.create({
        name,
        description,
        departmentId
      });

      return await this.getById({ params: { id: position.id } }, res);
    });
  }

  static async update(req, res) {
    await this.handleRequest(req, res, async () => {
      const position = await Position.findByPk(req.params.id);
      if (!position) {
        throw this.handleNotFoundError('Position not found');
      }

      const { name, description, departmentId } = req.body;

      // Check if department exists
      if (departmentId && departmentId !== position.departmentId) {
        const department = await Department.findByPk(departmentId);
        if (!department) {
          throw this.handleValidationError({
            errors: [{
              path: 'departmentId',
              message: 'Department not found'
            }]
          });
        }

        // Check if position with same name exists in the new department
        const existingPosition = await Position.findOne({
          where: {
            name,
            departmentId,
            id: { [Op.ne]: position.id }
          }
        });

        if (existingPosition) {
          throw this.handleValidationError({
            errors: [{
              path: 'name',
              message: 'Position with this name already exists in the department'
            }]
          });
        }
      }

      await position.update({
        name,
        description,
        departmentId
      });

      return await this.getById({ params: { id: position.id } }, res);
    });
  }

  static async delete(req, res) {
    await this.handleRequest(req, res, async () => {
      const position = await Position.findByPk(req.params.id);
      if (!position) {
        throw this.handleNotFoundError('Position not found');
      }

      // Check if position has workers
      const hasWorkers = await Worker.findOne({
        where: { positionId: position.id }
      });

      if (hasWorkers) {
        throw this.handleValidationError({
          errors: [{
            path: 'id',
            message: 'Cannot delete position with associated workers'
          }]
        });
      }

      await position.destroy();
      return { message: 'Position deleted successfully' };
    });
  }
}

module.exports = PositionController; 