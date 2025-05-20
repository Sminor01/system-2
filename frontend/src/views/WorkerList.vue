<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Сотрудники
            <v-spacer></v-spacer>
            <v-select
              v-model="selectedDepartment"
              :items="departments"
              item-text="name"
              item-value="id"
              label="Отдел"
              clearable
              class="mr-4"
              style="max-width: 200px"
            ></v-select>
            <v-select
              v-model="selectedPosition"
              :items="filteredPositions"
              item-text="name"
              item-value="id"
              label="Должность"
              clearable
              class="mr-4"
              style="max-width: 200px"
            ></v-select>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Поиск"
              single-line
              hide-details
              class="mr-4"
              style="max-width: 300px"
            ></v-text-field>
            <v-btn color="primary" @click="openDialog()">
              <v-icon left>mdi-plus</v-icon>
              Добавить сотрудника
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredWorkers"
              :search="search"
              :loading="loading"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.fullName="{ item }">
                {{ getFullName(item) }}
              </template>
              <template v-slot:item.department="{ item }">
                {{ getDepartmentName(item.departmentId) }}
              </template>
              <template v-slot:item.position="{ item }">
                {{ getPositionName(item.positionId) }}
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="openDialog(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="confirmDelete(item)">
                  mdi-delete
                </v-icon>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Worker Dialog -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.firstName"
                  label="Имя"
                  :error-messages="errors.firstName"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.lastName"
                  label="Фамилия"
                  :error-messages="errors.lastName"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  v-model="editedItem.secondName"
                  label="Отчество"
                  :error-messages="errors.secondName"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.departmentId"
                  :items="departments"
                  item-text="name"
                  item-value="id"
                  label="Отдел"
                  :error-messages="errors.departmentId"
                  required
                  @change="handleDepartmentChange"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="editedItem.positionId"
                  :items="filteredPositions"
                  item-text="name"
                  item-value="id"
                  label="Должность"
                  :error-messages="errors.positionId"
                  required
                  :disabled="!editedItem.departmentId"
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.userProfileId"
                  :items="availableUsers"
                  item-text="username"
                  item-value="id"
                  label="Пользователь"
                  :error-messages="errors.userProfileId"
                  clearable
                >
                  <template v-slot:selection="{ item }">
                    {{ item.username }} ({{ item.fullName }})
                  </template>
                  <template v-slot:item="{ item }">
                    {{ item.username }} ({{ item.fullName }})
                  </template>
                </v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="closeDialog">Отмена</v-btn>
          <v-btn color="primary" text @click="save" :loading="saving">
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">Подтверждение удаления</v-card-title>
        <v-card-text>
          Вы уверены, что хотите удалить сотрудника "{{ getFullName(deleteItem) }}"?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" text @click="deleteDialog = false">
            Отмена
          </v-btn>
          <v-btn color="primary" text @click="deleteItemConfirm" :loading="deleting">
            Удалить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'WorkerList',

  data: () => ({
    search: '',
    selectedDepartment: null,
    selectedPosition: null,
    dialog: false,
    deleteDialog: false,
    saving: false,
    deleting: false,
    headers: [
      { text: 'ФИО', value: 'fullName' },
      { text: 'Отдел', value: 'department' },
      { text: 'Должность', value: 'position' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      firstName: '',
      lastName: '',
      secondName: '',
      departmentId: null,
      positionId: null,
      userProfileId: null
    },
    defaultItem: {
      firstName: '',
      lastName: '',
      secondName: '',
      departmentId: null,
      positionId: null,
      userProfileId: null
    },
    deleteItem: null,
    errors: {}
  }),

  computed: {
    ...mapState({
      workers: state => state.workers,
      departments: state => state.departments,
      positions: state => state.positions,
      users: state => state.users,
      loading: state => state.loading
    }),

    filteredPositions() {
      if (!this.editedItem.departmentId) return this.positions;
      return this.positions.filter(p => p.departmentId === this.editedItem.departmentId);
    },

    filteredWorkers() {
      let filtered = this.workers;
      if (this.selectedDepartment) {
        filtered = filtered.filter(w => w.departmentId === this.selectedDepartment);
      }
      if (this.selectedPosition) {
        filtered = filtered.filter(w => w.positionId === this.selectedPosition);
      }
      return filtered;
    },

    availableUsers() {
      // Filter out users that are already associated with workers
      const assignedUserIds = this.workers
        .filter(w => w.userProfileId && w.id !== this.editedItem.id)
        .map(w => w.userProfileId);
      return this.users.filter(u => !assignedUserIds.includes(u.id));
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Новый сотрудник' : 'Редактировать сотрудника';
    }
  },

  created() {
    this.fetchWorkers();
    this.fetchDepartments();
    this.fetchPositions();
    this.fetchUsers();
  },

  methods: {
    ...mapActions([
      'fetchWorkers',
      'fetchDepartments',
      'fetchPositions',
      'fetchUsers',
      'createWorker',
      'updateWorker',
      'deleteWorker'
    ]),

    getFullName(item) {
      const parts = [item.lastName, item.firstName, item.secondName];
      return parts.filter(Boolean).join(' ');
    },

    getDepartmentName(departmentId) {
      const department = this.departments.find(d => d.id === departmentId);
      return department ? department.name : '';
    },

    getPositionName(positionId) {
      const position = this.positions.find(p => p.id === positionId);
      return position ? position.name : '';
    },

    handleDepartmentChange() {
      // Reset position when department changes
      this.editedItem.positionId = null;
    },

    openDialog(item) {
      this.editedIndex = item ? this.workers.indexOf(item) : -1;
      this.editedItem = Object.assign({}, item || this.defaultItem);
      this.errors = {};
      this.dialog = true;
    },

    closeDialog() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.errors = {};
      });
    },

    async save() {
      this.saving = true;
      this.errors = {};

      try {
        if (this.editedIndex > -1) {
          await this.updateWorker({
            id: this.editedItem.id,
            data: this.editedItem
          });
        } else {
          await this.createWorker(this.editedItem);
        }
        this.closeDialog();
      } catch (error) {
        if (error.errors) {
          this.errors = error.errors.reduce((acc, err) => {
            acc[err.field] = err.message;
            return acc;
          }, {});
        }
      } finally {
        this.saving = false;
      }
    },

    confirmDelete(item) {
      this.deleteItem = item;
      this.deleteDialog = true;
    },

    async deleteItemConfirm() {
      this.deleting = true;
      try {
        await this.deleteWorker(this.deleteItem.id);
        this.deleteDialog = false;
      } catch (error) {
        // Error handling is done in the store
      } finally {
        this.deleting = false;
      }
    }
  }
};
</script> 