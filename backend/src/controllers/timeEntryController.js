const { TimeEntry, Task, UserProfile } = require('../models');
const BaseController = require('./baseController');
const { Op } = require('sequelize');

class TimeEntryController extends BaseController {
  static async getAll(req, res) {
    await this.handleRequest(req, res, async () => {
      const {
        task,
        user,
        startDate,
        endDate,
        page = 1,
        limit = 10,
        sortBy = 'startTime',
        sortOrder = 'DESC'
      } = req.query;

      const where = {};
      if (task) where.taskId = task;
      if (user) where.userProfileId = user;
      if (startDate && endDate) {
        where.startTime = {
          [Op.between]: [new Date(startDate), new Date(endDate)]
        };
      }

      const offset = (page - 1) * limit;
      const { count, rows: timeEntries } = await TimeEntry.findAndCountAll({
        where,
        include: [
          {
            model: Task,
            as: 'task',
            include: [
              { model: TaskStatus, as: 'status' },
              { model: TaskPriority, as: 'priority' }
            ]
          },
          {
            model: UserProfile,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        timeEntries,
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
      const timeEntry = await TimeEntry.findByPk(req.params.id, {
        include: [
          {
            model: Task,
            as: 'task',
            include: [
              { model: TaskStatus, as: 'status' },
              { model: TaskPriority, as: 'priority' }
            ]
          },
          {
            model: UserProfile,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }
        ]
      });

      if (!timeEntry) {
        throw this.handleNotFoundError('Time entry not found');
      }

      return timeEntry;
    });
  }

  static async create(req, res) {
    await this.handleRequest(req, res, async () => {
      const { taskId, startTime, description } = req.body;

      // Check if task exists
      const task = await Task.findByPk(taskId);
      if (!task) {
        throw this.handleValidationError({
          errors: [{
            path: 'taskId',
            message: 'Task not found'
          }]
        });
      }

      // Check if user has an active time entry
      const activeEntry = await TimeEntry.findOne({
        where: {
          userProfileId: req.user.id,
          endTime: null
        }
      });

      if (activeEntry) {
        throw this.handleValidationError({
          errors: [{
            path: 'startTime',
            message: 'You already have an active time entry'
          }]
        });
      }

      const timeEntry = await TimeEntry.create({
        taskId,
        userProfileId: req.user.id,
        startTime: startTime || new Date(),
        description
      });

      return await this.getById({ params: { id: timeEntry.id } }, res);
    });
  }

  static async update(req, res) {
    await this.handleRequest(req, res, async () => {
      const timeEntry = await TimeEntry.findByPk(req.params.id);
      if (!timeEntry) {
        throw this.handleNotFoundError('Time entry not found');
      }

      // Only allow updating own time entries
      if (timeEntry.userProfileId !== req.user.id) {
        throw this.handleForbiddenError('Cannot update another user\'s time entry');
      }

      const { startTime, endTime, description } = req.body;

      // Calculate duration if both start and end times are provided
      let duration = null;
      if (startTime && endTime) {
        duration = Math.round((new Date(endTime) - new Date(startTime)) / (1000 * 60)); // duration in minutes
      }

      await timeEntry.update({
        startTime,
        endTime,
        duration,
        description
      });

      // Update task's total time spent
      if (endTime) {
        const task = await Task.findByPk(timeEntry.taskId);
        const totalDuration = await TimeEntry.sum('duration', {
          where: { taskId: timeEntry.taskId }
        });
        await task.update({ timeSpent: totalDuration / 60 }); // Convert minutes to hours
      }

      return await this.getById({ params: { id: timeEntry.id } }, res);
    });
  }

  static async delete(req, res) {
    await this.handleRequest(req, res, async () => {
      const timeEntry = await TimeEntry.findByPk(req.params.id);
      if (!timeEntry) {
        throw this.handleNotFoundError('Time entry not found');
      }

      // Only allow deleting own time entries
      if (timeEntry.userProfileId !== req.user.id) {
        throw this.handleForbiddenError('Cannot delete another user\'s time entry');
      }

      await timeEntry.destroy();

      // Update task's total time spent
      const task = await Task.findByPk(timeEntry.taskId);
      const totalDuration = await TimeEntry.sum('duration', {
        where: { taskId: timeEntry.taskId }
      });
      await task.update({ timeSpent: (totalDuration || 0) / 60 }); // Convert minutes to hours

      return { message: 'Time entry deleted successfully' };
    });
  }

  static async stopTimer(req, res) {
    await this.handleRequest(req, res, async () => {
      const timeEntry = await TimeEntry.findByPk(req.params.id);
      if (!timeEntry) {
        throw this.handleNotFoundError('Time entry not found');
      }

      // Only allow stopping own time entries
      if (timeEntry.userProfileId !== req.user.id) {
        throw this.handleForbiddenError('Cannot stop another user\'s time entry');
      }

      if (timeEntry.endTime) {
        throw this.handleValidationError({
          errors: [{
            path: 'endTime',
            message: 'Time entry is already stopped'
          }]
        });
      }

      const endTime = new Date();
      const duration = Math.round((endTime - timeEntry.startTime) / (1000 * 60)); // duration in minutes

      await timeEntry.update({
        endTime,
        duration
      });

      // Update task's total time spent
      const task = await Task.findByPk(timeEntry.taskId);
      const totalDuration = await TimeEntry.sum('duration', {
        where: { taskId: timeEntry.taskId }
      });
      await task.update({ timeSpent: totalDuration / 60 }); // Convert minutes to hours

      return await this.getById({ params: { id: timeEntry.id } }, res);
    });
  }
}

module.exports = TimeEntryController; 