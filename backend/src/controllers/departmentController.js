const { Department, Position, Worker } = require('../models');
const BaseController = require('./baseController');
const { Op } = require('sequelize');

class DepartmentController extends BaseController {
  static async getAll(req, res) {
    await this.handleRequest(req, res, async () => {
      const { search } = req.query;

      const where = {};
      if (search) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      const departments = await Department.findAll({
        where,
        include: [
          {
            model: Position,
            as: 'positions',
            include: [{ model: Worker, as: 'workers' }]
          }
        ],
        order: [['name', 'ASC']]
      });

      return departments;
    });
  }

  static async getById(req, res) {
    await this.handleRequest(req, res, async () => {
      const department = await Department.findByPk(req.params.id, {
        include: [
          {
            model: Position,
            as: 'positions',
            include: [{ model: Worker, as: 'workers' }]
          },
          {
            model: Worker,
            as: 'workers',
            include: [{ model: Position, as: 'position' }]
          }
        ]
      });

      if (!department) {
        throw this.handleNotFoundError('Department not found');
      }

      return department;
    });
  }

  static async create(req, res) {
    await this.handleRequest(req, res, async () => {
      const { name, description } = req.body;

      // Check if department with same name exists
      const existingDepartment = await Department.findOne({
        where: { name }
      });

      if (existingDepartment) {
        throw this.handleValidationError({
          errors: [{
            path: 'name',
            message: 'Department with this name already exists'
          }]
        });
      }

      const department = await Department.create({
        name,
        description
      });

      return await this.getById({ params: { id: department.id } }, res);
    });
  }

  static async update(req, res) {
    await this.handleRequest(req, res, async () => {
      const department = await Department.findByPk(req.params.id);
      if (!department) {
        throw this.handleNotFoundError('Department not found');
      }

      const { name, description } = req.body;

      // Check if new name conflicts with existing department
      if (name && name !== department.name) {
        const existingDepartment = await Department.findOne({
          where: { name }
        });

        if (existingDepartment) {
          throw this.handleValidationError({
            errors: [{
              path: 'name',
              message: 'Department with this name already exists'
            }]
          });
        }
      }

      await department.update({
        name,
        description
      });

      return await this.getById({ params: { id: department.id } }, res);
    });
  }

  static async delete(req, res) {
    await this.handleRequest(req, res, async () => {
      const department = await Department.findByPk(req.params.id);
      if (!department) {
        throw this.handleNotFoundError('Department not found');
      }

      // Check if department has workers or positions
      const hasWorkers = await Worker.findOne({
        where: { departmentId: department.id }
      });

      const hasPositions = await Position.findOne({
        where: { departmentId: department.id }
      });

      if (hasWorkers || hasPositions) {
        throw this.handleValidationError({
          errors: [{
            path: 'id',
            message: 'Cannot delete department with associated workers or positions'
          }]
        });
      }

      await department.destroy();
      return { message: 'Department deleted successfully' };
    });
  }
}

module.exports = DepartmentController; 