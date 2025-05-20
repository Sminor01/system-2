const { Task, TaskStatus, TaskPriority, TaskComplexity, Worker, UserProfile } = require('../models');
const BaseController = require('./baseController');
const { Op } = require('sequelize');

class TaskController extends BaseController {
  static async getAll(req, res) {
    await this.handleRequest(req, res, async () => {
      const {
        status,
        priority,
        complexity,
        assignedTo,
        responsible,
        search,
        page = 1,
        limit = 10,
        sortBy = 'createdAt',
        sortOrder = 'DESC'
      } = req.query;

      const where = {};
      if (status) where.statusId = status;
      if (priority) where.priorityId = priority;
      if (complexity) where.complexityId = complexity;
      if (assignedTo) where.assignedToId = assignedTo;
      if (responsible) where.responsibleId = responsible;
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const offset = (page - 1) * limit;
      const { count, rows: tasks } = await Task.findAndCountAll({
        where,
        include: [
          { model: TaskStatus, as: 'status' },
          { model: TaskPriority, as: 'priority' },
          { model: TaskComplexity, as: 'complexity' },
          { model: Worker, as: 'assignedTo', include: ['department', 'position'] },
          { model: Worker, as: 'responsible', include: ['department', 'position'] },
          { model: UserProfile, as: 'creator', attributes: ['id', 'username', 'fullName'] }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        tasks,
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
      const task = await Task.findByPk(req.params.id, {
        include: [
          { model: TaskStatus, as: 'status' },
          { model: TaskPriority, as: 'priority' },
          { model: TaskComplexity, as: 'complexity' },
          { model: Worker, as: 'assignedTo', include: ['department', 'position'] },
          { model: Worker, as: 'responsible', include: ['department', 'position'] },
          { model: UserProfile, as: 'creator', attributes: ['id', 'username', 'fullName'] },
          {
            model: TimeEntry,
            as: 'timeEntries',
            include: [{ model: UserProfile, as: 'user', attributes: ['id', 'username', 'fullName'] }]
          }
        ]
      });

      if (!task) {
        throw this.handleNotFoundError('Task not found');
      }

      return task;
    });
  }

  static async create(req, res) {
    await this.handleRequest(req, res, async () => {
      const {
        name,
        description,
        complexityId,
        priorityId,
        statusId,
        startDate,
        deadline,
        assignedToId,
        responsibleId
      } = req.body;

      const task = await Task.create({
        name,
        description,
        complexityId,
        priorityId,
        statusId,
        startDate,
        deadline,
        assignedToId,
        responsibleId,
        createdById: req.user.id
      });

      return await this.getById({ params: { id: task.id } }, res);
    });
  }

  static async update(req, res) {
    await this.handleRequest(req, res, async () => {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        throw this.handleNotFoundError('Task not found');
      }

      const {
        name,
        description,
        complexityId,
        priorityId,
        statusId,
        startDate,
        deadline,
        assignedToId,
        responsibleId
      } = req.body;

      await task.update({
        name,
        description,
        complexityId,
        priorityId,
        statusId,
        startDate,
        deadline,
        assignedToId,
        responsibleId
      });

      return await this.getById({ params: { id: task.id } }, res);
    });
  }

  static async delete(req, res) {
    await this.handleRequest(req, res, async () => {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        throw this.handleNotFoundError('Task not found');
      }

      await task.destroy();
      return { message: 'Task deleted successfully' };
    });
  }

  static async updateStatus(req, res) {
    await this.handleRequest(req, res, async () => {
      const { statusId } = req.body;
      const task = await Task.findByPk(req.params.id);
      
      if (!task) {
        throw this.handleNotFoundError('Task not found');
      }

      await task.update({ statusId });
      return await this.getById({ params: { id: task.id } }, res);
    });
  }

  static async getMetadata(req, res) {
    await this.handleRequest(req, res, async () => {
      const [statuses, priorities, complexities] = await Promise.all([
        TaskStatus.findAll({ order: [['orderIndex', 'ASC']] }),
        TaskPriority.findAll({ order: [['orderIndex', 'ASC']] }),
        TaskComplexity.findAll({ order: [['orderIndex', 'ASC']] })
      ]);

      return { statuses, priorities, complexities };
    });
  }
}

module.exports = TaskController; 