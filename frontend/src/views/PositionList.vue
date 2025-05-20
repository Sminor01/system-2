<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex align-center">
            Должности
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
              Добавить должность
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="filteredPositions"
              :search="search"
              :loading="loading"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:item.department="{ item }">
                {{ getDepartmentName(item.departmentId) }}
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

    <!-- Position Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.departmentId"
                  :items="departments"
                  item-text="name"
                  item-value="id"
                  label="Отдел"
                  :error-messages="errors.departmentId"
                  required
                ></v-select>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  label="Название должности"
                  :error-messages="errors.name"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="editedItem.description"
                  label="Описание"
                  :error-messages="errors.description"
                ></v-textarea>
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
          Вы уверены, что хотите удалить должность "{{ deleteItem.name }}"?
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
  name: 'PositionList',

  data: () => ({
    search: '',
    selectedDepartment: null,
    dialog: false,
    deleteDialog: false,
    saving: false,
    deleting: false,
    headers: [
      { text: 'Название', value: 'name' },
      { text: 'Отдел', value: 'department' },
      { text: 'Описание', value: 'description' },
      { text: 'Действия', value: 'actions', sortable: false }
    ],
    editedIndex: -1,
    editedItem: {
      name: '',
      description: '',
      departmentId: null
    },
    defaultItem: {
      name: '',
      description: '',
      departmentId: null
    },
    deleteItem: null,
    errors: {}
  }),

  computed: {
    ...mapState({
      positions: state => state.positions,
      departments: state => state.departments,
      loading: state => state.loading
    }),

    filteredPositions() {
      if (!this.selectedDepartment) return this.positions;
      return this.positions.filter(p => p.departmentId === this.selectedDepartment);
    },

    formTitle() {
      return this.editedIndex === -1 ? 'Новая должность' : 'Редактировать должность';
    }
  },

  created() {
    this.fetchPositions();
    this.fetchDepartments();
  },

  methods: {
    ...mapActions([
      'fetchPositions',
      'fetchDepartments',
      'createPosition',
      'updatePosition',
      'deletePosition'
    ]),

    getDepartmentName(departmentId) {
      const department = this.departments.find(d => d.id === departmentId);
      return department ? department.name : '';
    },

    openDialog(item) {
      this.editedIndex = item ? this.positions.indexOf(item) : -1;
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
          await this.updatePosition({
            id: this.editedItem.id,
            data: this.editedItem
          });
        } else {
          await this.createPosition(this.editedItem);
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
        await this.deletePosition(this.deleteItem.id);
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