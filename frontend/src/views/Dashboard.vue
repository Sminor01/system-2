<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">Dashboard</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Statistics Cards -->
      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Total Employees</div>
            <div class="text-h4">{{ workers.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Departments</div>
            <div class="text-h4">{{ departments.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Active Tasks</div>
            <div class="text-h4">
              {{ tasks.filter(t => t.status === 'in_progress').length }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-card>
          <v-card-text>
            <div class="text-h6">Total Time Entries</div>
            <div class="text-h4">{{ timeEntries.length }}</div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Recent Tasks -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Recent Tasks
            <v-spacer />
            <v-btn
              text
              color="primary"
              :to="{ name: 'tasks' }"
            >
              View All
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="task in recentTasks"
                :key="task.id"
                :to="{ name: 'tasks', query: { id: task.id } }"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ task.title }}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ task.description }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="d-flex align-center">
                    <v-chip
                      small
                      :color="getStatusColor(task.status)"
                      class="mr-2"
                    >
                      {{ task.status }}
                    </v-chip>
                    <v-chip
                      small
                      :color="getPriorityColor(task.priority)"
                      class="mr-2"
                    >
                      {{ task.priority }}
                    </v-chip>
                    <span class="text-caption">
                      Assigned to: {{ getWorkerName(task.assignedTo) }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Recent Time Entries -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            Recent Time Entries
            <v-spacer />
            <v-btn
              text
              color="primary"
              :to="{ name: 'time-entries' }"
            >
              View All
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="entry in recentTimeEntries"
                :key="entry.id"
              >
                <v-list-item-content>
                  <v-list-item-title>
                    {{ getTaskTitle(entry.taskId) }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ formatDuration(entry.duration) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle class="d-flex align-center">
                    <span class="text-caption">
                      By: {{ getWorkerName(entry.userId) }}
                    </span>
                    <v-spacer />
                    <span class="text-caption">
                      {{ formatDate(entry.startTime) }}
                    </span>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-4">
      <!-- Department Overview -->
      <v-col cols="12">
        <v-card>
          <v-card-title>
            Department Overview
            <v-spacer />
            <v-btn
              text
              color="primary"
              :to="{ name: 'departments' }"
            >
              View All
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="departmentHeaders"
              :items="departmentStats"
              :items-per-page="5"
              class="elevation-1"
            >
              <template v-slot:item.workerCount="{ item }">
                {{ item.workerCount }} employees
              </template>
              <template v-slot:item.taskCount="{ item }">
                {{ item.taskCount }} tasks
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from 'moment';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Dashboard',

  data: () => ({
    departmentHeaders: [
      { text: 'Department', value: 'name' },
      { text: 'Employees', value: 'workerCount' },
      { text: 'Active Tasks', value: 'taskCount' }
    ]
  }),

  computed: {
    ...mapState([
      'workers',
      'departments',
      'positions',
      'tasks',
      'timeEntries'
    ]),

    recentTasks() {
      return [...this.tasks]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    },

    recentTimeEntries() {
      return [...this.timeEntries]
        .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
        .slice(0, 5);
    },

    departmentStats() {
      return this.departments.map(department => {
        const departmentWorkers = this.workers.filter(
          w => w.departmentId === department.id
        );
        const departmentTasks = this.tasks.filter(
          t => departmentWorkers.some(w => w.id === t.assignedTo)
        );

        return {
          id: department.id,
          name: department.name,
          workerCount: departmentWorkers.length,
          taskCount: departmentTasks.filter(t => t.status === 'in_progress').length
        };
      });
    }
  },

  methods: {
    ...mapActions([
      'fetchWorkers',
      'fetchDepartments',
      'fetchPositions',
      'fetchTasks',
      'fetchTimeEntries'
    ]),

    getWorkerName(workerId) {
      const worker = this.workers.find(w => w.id === workerId);
      return worker ? `${worker.firstName} ${worker.lastName}` : 'Unknown';
    },

    getTaskTitle(taskId) {
      const task = this.tasks.find(t => t.id === taskId);
      return task ? task.title : 'Unknown Task';
    },

    getStatusColor(status) {
      const colors = {
        new: 'grey',
        in_progress: 'blue',
        completed: 'green',
        cancelled: 'red'
      };
      return colors[status] || 'grey';
    },

    getPriorityColor(priority) {
      const colors = {
        low: 'green',
        medium: 'orange',
        high: 'red'
      };
      return colors[priority] || 'grey';
    },

    formatDuration(duration) {
      if (!duration) return 'N/A';
      const hours = Math.floor(duration / 3600);
      const minutes = Math.floor((duration % 3600) / 60);
      return `${hours}h ${minutes}m`;
    },

    formatDate(date) {
      return moment(date).format('MMM D, YYYY HH:mm');
    }
  },

  async created() {
    try {
      await Promise.all([
        this.fetchWorkers(),
        this.fetchDepartments(),
        this.fetchPositions(),
        this.fetchTasks(),
        this.fetchTimeEntries()
      ]);
    } catch (error) {
      // Error is handled by the store
    }
  }
};
</script> 