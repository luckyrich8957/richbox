<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">用戶管理</h1>
      </v-col>

      <!-- 搜索和操作按鈕 -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="搜索用戶"
          outlined
          dense
          hide-details
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="exportUsers">
          <v-icon left>mdi-download</v-icon>
          導出用戶
        </v-btn>
      </v-col>

      <!-- 用戶列表 -->
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="users"
          :search="search"
          :loading="loading"
          loading-text="加載中..."
          no-data-text="暫無數據"
        >
          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" small>
              {{ item.status }}
            </v-chip>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editUser(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteUser(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 編輯用戶對話框 -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.username"
                  label="用戶名"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.email"
                  label="郵箱"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="editedItem.status"
                  :items="statusOptions"
                  label="狀態"
                  outlined
                  dense
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="close">
            取消
          </v-btn>
          <v-btn color="blue darken-1" text @click="save">
            保存
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      search: '',
      loading: false,
      dialog: false,
      editedIndex: -1,
      editedItem: {
        username: '',
        email: '',
        status: 'active'
      },
      defaultItem: {
        username: '',
        email: '',
        status: 'active'
      },
      statusOptions: [
        { text: '啟用', value: 'active' },
        { text: '停用', value: 'inactive' },
        { text: '封禁', value: 'banned' }
      ],
      headers: [
        { text: '用戶名', value: 'username' },
        { text: '郵箱', value: 'email' },
        { text: '狀態', value: 'status' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      users: []
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新增用戶' : '編輯用戶'
    }
  },
  methods: {
    getStatusColor(status) {
      switch (status) {
        case 'active': return 'success'
        case 'inactive': return 'warning'
        case 'banned': return 'error'
        default: return 'grey'
      }
    },
    editUser(item) {
      this.editedIndex = this.users.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteUser(item) {
      confirm('確定要刪除此用戶嗎？') && this.users.splice(this.users.indexOf(item), 1)
    },
    exportUsers() {
      // 導出用戶邏輯
      this.$toast.success('用戶數據已導出')
    },
    close() {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.users[this.editedIndex], this.editedItem)
      } else {
        this.users.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped>
/* Table */
.v-data-table {
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  background: #fff;
}

.v-data-table-header {
  background: #f8f8f8;
}

.v-data-table-header th {
  color: #6e6b7b !important;
  font-weight: 600;
}

/* Search */
.v-text-field--outlined >>> fieldset {
  border-color: #d8d6de;
}

.v-text-field--outlined.v-input--is-focused >>> fieldset {
  border-color: #7367f0;
}

/* Buttons */
.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-btn--contained {
  box-shadow: 0 2px 4px 0 rgba(115, 103, 240, 0.4);
}

/* Chips */
.v-chip {
  font-weight: 500;
}

.v-chip--success {
  background: rgba(40, 199, 111, 0.12) !important;
  color: #28c76f !important;
}

.v-chip--warning {
  background: rgba(255, 159, 67, 0.12) !important;
  color: #ff9f43 !important;
}

.v-chip--error {
  background: rgba(234, 84, 85, 0.12) !important;
  color: #ea5455 !important;
}

/* Dialog */
.v-dialog .v-card {
  border-radius: 6px;
}

.v-dialog .v-card-title {
  border-bottom: 1px solid #ebe9f1;
  padding: 1.5rem;
}

.v-dialog .v-card-text {
  padding: 1.5rem;
}

.v-dialog .v-card-actions {
  padding: 1rem 1.5rem;
  border-top: 1px solid #ebe9f1;
}
</style>