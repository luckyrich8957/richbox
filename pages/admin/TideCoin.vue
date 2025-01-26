<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-tabs v-model="tab">
          <v-tab>潮幣管理</v-tab>
          <v-tab>盲盒設定</v-tab>
        </v-tabs>
        
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card>
              <v-card-title>
                潮幣管理
              </v-card-title>
              <v-card-text>
                <!-- 原有潮幣管理內容 -->
                <v-data-table
                  :headers="headers"
                  :items="tideCoinRecords"
                  :loading="loading"
                  loading-text="加載中..."
                  no-data-text="暫無數據"
                >
                  <template v-slot:item.actions="{ item }">
                    <v-btn
                      small
                      color="primary"
                      @click="approveRecord(item)"
                      :disabled="item.status !== 'pending'"
                    >
                      審核通過
                    </v-btn>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-tab-item>
          
          <v-tab-item>
            <v-card>
              <v-card-title>
                盲盒設定
              </v-card-title>
              <v-card-text>
                <v-form>
                  <v-row>
                    <v-col cols="6">
                      <v-text-field
                        v-model="blindBoxSettings.maxDrawCount"
                        label="每日抽獎次數限制"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="6">
                      <v-text-field
                        v-model="blindBoxSettings.reverseCost"
                        label="逆轉抽獎費用"
                        type="number"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="6">
                      <v-text-field
                        v-model="blindBoxSettings.eggProbability"
                        label="彩蛋出現機率"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="6">
                      <v-select
                        v-model="blindBoxSettings.boxStyle"
                        :items="boxStyles"
                        label="盲盒樣式"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-btn
                        color="primary"
                        @click="saveBlindBoxSettings"
                      >
                        保存設定
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
    </v-row>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="openUploadDialog">
              <v-icon left>mdi-upload</v-icon>
              上傳QR碼
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="tideCoinRecords"
              :loading="loading"
              loading-text="加載中..."
              no-data-text="暫無數據"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn
                  small
                  color="primary"
                  @click="approveRecord(item)"
                  :disabled="item.status !== 'pending'"
                >
                  審核通過
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="uploadDialog" max-width="500">
      <v-card>
        <v-card-title>上傳QR碼</v-card-title>
        <v-card-text>
          <v-file-input
            v-model="qrFile"
            label="選擇QR碼圖片"
            accept="image/*"
            outlined
            dense
          ></v-file-input>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="uploadDialog = false">取消</v-btn>
          <v-btn color="primary" @click="uploadQR" :loading="uploading">
            上傳
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
      loading: false,
      uploadDialog: false,
      uploading: false,
      qrFile: null,
      headers: [
        { text: '用戶', value: 'user' },
        { text: '金額', value: 'amount' },
        { text: '潮幣', value: 'coins' },
        { text: '狀態', value: 'status' },
        { text: '申請時間', value: 'createdAt' },
        { text: '操作', value: 'actions', sortable: false }
      ],
      tideCoinRecords: []
    }
  },
  methods: {
    async loadRecords(params = {}) {
      this.loading = true
      try {
        const res = await this.$api['admin/tide-coin/orders']()
        this.tideCoinRecords = res.data.map(item => ({
          ...item,
          user: item.user.nickname || item.user.username,
          createdAt: new Date(item.createdAt).toLocaleString()
        }))
      } catch (error) {
        console.error(error)
        this.$toast.error('獲取潮幣記錄失敗')
      } finally {
        this.loading = false
      }
    },
    openUploadDialog() {
      this.uploadDialog = true
    },
    async uploadQR() {
      if (!this.qrFile) return
      this.uploading = true
      try {
        const formData = new FormData()
        formData.append('file', this.qrFile)
        await this.$api['admin/tide-coin/upload-qr'](formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        this.$toast.success('QR碼上傳成功')
        await this.loadRecords()
      } catch (error) {
        console.error(error)
        this.$toast.error('QR碼上傳失敗')
      } finally {
        this.uploading = false
        this.uploadDialog = false
      }
    },
    async approveRecord(record) {
      try {
        await this.$api['admin/tide-coin/approve']({ id: record.id })
        this.$toast.success('審核成功')
        await this.loadRecords()
        
        // 發送通知
        await this.$api['admin/notify']({
          userId: record.userId,
          title: '潮幣充值審核通過',
          content: `您的${record.coins}潮幣充值已審核通過`,
          type: 'coin-recharge',
          data: {
            coins: record.coins,
            status: 'approved'
          }
        })
        
        // 更新用戶潮幣餘額
        await this.$api['admin/user/update-coin']({
          userId: record.userId,
          coins: record.coins
        })
      } catch (error) {
        console.error(error)
        this.$toast.error('審核失敗')
      }
    }
  },
  mounted() {
    this.loadRecords()
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 8px;
}

button {
  font: inherit;
  background-color: #f0f0f0;
  border: 0;
  color: #242424;
  border-radius: 0.5em;
  font-size: 1.35rem;
  padding: 0.375em 1em;
  font-weight: 600;
  text-shadow: 0 0.0625em 0 #fff;
  box-shadow: inset 0 0.0625em 0 0 #f4f4f4, 0 0.0625em 0 0 #efefef,
    0 0.125em 0 0 #ececec, 0 0.25em 0 0 #e0e0e0, 0 0.3125em 0 0 #dedede,
    0 0.375em 0 0 #dcdcdc, 0 0.425em 0 0 #cacaca, 0 0.425em 0.5em 0 #cecece;
  transition: 0.15s ease;
  cursor: pointer;
}

button:active {
  translate: 0 0.225em;
  box-shadow: inset 0 0.03em 0 0 #f4f4f4, 0 0.03em 0 0 #efefef,
    0 0.0625em 0 0 #ececec, 0 0.125em 0 0 #e0e0e0, 0 0.125em 0 0 #dedede,
    0 0.2em 0 0 #dcdcdc, 0 0.225em 0 0 #cacaca, 0 0.225em 0.375em 0 #cecece;
}
</style>