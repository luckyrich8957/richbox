<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">盲盒管理</h1>
      </v-col>

      <!-- 搜索和新增按鈕 -->
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="搜索盲盒"
          outlined
          dense
          hide-details
          append-icon="mdi-magnify"
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="6" class="text-right">
        <v-btn color="primary" @click="openCreateDialog">
          <v-icon left>mdi-plus</v-icon>
          新增盲盒
        </v-btn>
      </v-col>

      <!-- 盲盒列表 -->
      <v-col cols="12">
        <v-data-table
          :headers="headers"
          :items="blindboxes"
          :search="search"
          :loading="loading"
          loading-text="加載中..."
          no-data-text="暫無數據"
        >
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- 新增/編輯對話框 -->
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
                  v-model="editedItem.name"
                  label="盲盒名稱"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.price"
                  label="價格"
                  type="number"
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
        name: '',
        price: 0,
        status: 'active'
      },
      defaultItem: {
        name: '',
        price: 0,
        status: 'active'
      },
      statusOptions: [
        { text: '啟用', value: 'active' },
        { text: '停用', value: 'inactive' }
      ],
      headers: [
        { text: '盲盒名稱', value: 'name' },
        { text: '價格', value: 'price' },
        { text: '狀態', value: 'status' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      blindboxes: []
    }
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? '新增盲盒' : '編輯盲盒'
    }
  },
  methods: {
    openCreateDialog() {
      this.dialog = true
    },
    editItem(item) {
      this.editedIndex = this.blindboxes.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    deleteItem(item) {
      confirm('確定要刪除此盲盒嗎？') && this.blindboxes.splice(this.blindboxes.indexOf(item), 1)
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
        Object.assign(this.blindboxes[this.editedIndex], this.editedItem)
      } else {
        this.blindboxes.push(this.editedItem)
      }
      this.close()
    }
  }
}
</script>

<style scoped>
.v-data-table {
  border-radius: 15px;
  background: #e0e5ec;
  box-shadow:  9px 9px 16px rgb(163,177,198,0.6),
              -9px -9px 16px rgba(255,255,255, 0.5);
}
</style>