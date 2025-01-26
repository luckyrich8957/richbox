<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">權限管理</h1>
      </v-col>

      <!-- 角色列表 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>角色列表</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="role in roles"
                :key="role.name"
                @click="selectRole(role)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ role.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ role.description }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 權限配置 -->
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>權限配置</v-card-title>
          <v-card-text>
            <v-treeview
              v-if="selectedRole"
              v-model="selectedPermissions"
              :items="permissions"
              selectable
              return-object
            ></v-treeview>
            <v-alert
              v-else
              type="info"
              outlined
            >
              請選擇一個角色進行配置
            </v-alert>
          </v-card-text>
          <v-card-actions v-if="selectedRole">
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="savePermissions">
              保存配置
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      roles: [
        {
          name: '管理員',
          description: '擁有所有權限',
          permissions: ['*']
        },
        {
          name: '運營人員',
          description: '負責日常運營',
          permissions: ['user:read', 'order:read']
        },
        {
          name: '客服',
          description: '負責用戶支持',
          permissions: ['user:read']
        }
      ],
      selectedRole: null,
      selectedPermissions: [],
      permissions: [
        {
          id: 'user',
          name: '用戶管理',
          children: [
            { id: 'user:read', name: '查看用戶' },
            { id: 'user:write', name: '編輯用戶' },
            { id: 'user:delete', name: '刪除用戶' }
          ]
        },
        {
          id: 'order',
          name: '訂單管理',
          children: [
            { id: 'order:read', name: '查看訂單' },
            { id: 'order:write', name: '編輯訂單' },
            { id: 'order:delete', name: '刪除訂單' }
          ]
        },
        {
          id: 'system',
          name: '系統管理',
          children: [
            { id: 'system:settings', name: '系統設置' },
            { id: 'system:logs', name: '查看日誌' }
          ]
        }
      ]
    }
  },
  methods: {
    selectRole(role) {
      this.selectedRole = role
      this.selectedPermissions = this.permissions
        .flatMap(p => p.children)
        .filter(p => role.permissions.includes(p.id))
    },
    savePermissions() {
      this.selectedRole.permissions = this.selectedPermissions.map(p => p.id)
      this.$toast.success('權限配置已保存')
    }
  }
}
</script>

<style scoped>
/* Cards */
.v-card {
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  background: #fff;
}

.v-card-title {
  padding: 1.5rem;
  border-bottom: 1px solid #ebe9f1;
  color: #5e5873;
  font-weight: 600;
}

.v-card-text {
  padding: 1.5rem;
}

/* List */
.v-list {
  padding: 0;
}

.v-list-item {
  margin: 0;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid #ebe9f1;
}

.v-list-item:last-child {
  border-bottom: none;
}

.v-list-item__title {
  color: #5e5873;
  font-weight: 500;
}

.v-list-item__subtitle {
  color: #6e6b7b;
}

/* Treeview */
.v-treeview-node__label {
  color: #5e5873;
}

.v-treeview-node--active > .v-treeview-node__label {
  color: #7367f0;
  font-weight: 500;
}

/* Alert */
.v-alert {
  border-radius: 6px;
  margin: 0;
}

/* Buttons */
.v-btn {
  text-transform: none;
  font-weight: 500;
}

.v-btn--contained {
  box-shadow: 0 2px 4px 0 rgba(115, 103, 240, 0.4);
}
</style>