<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">彩蛋配置</h1>
      </v-col>

      <!-- 彩蛋配置表單 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>彩蛋設置</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="eggSettings.probability"
                    label="觸發概率 (%)"
                    type="number"
                    min="0"
                    max="100"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="eggSettings.minAmount"
                    label="最小獎勵金額"
                    type="number"
                    min="0"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="eggSettings.maxAmount"
                    label="最大獎勵金額"
                    type="number"
                    min="0"
                    outlined
                    dense
                  ></v-text-field>
                </v-col>

                <v-col cols="12" md="6">
                  <v-switch
                    v-model="eggSettings.enabled"
                    label="啟用彩蛋"
                    color="primary"
                  ></v-switch>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="saveSettings">
              保存設置
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- 彩蛋觸發記錄 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>彩蛋觸發記錄</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="eggRecords"
              :loading="loading"
              loading-text="加載中..."
              no-data-text="暫無數據"
            >
              <template v-slot:item.amount="{ item }">
                ¥{{ item.amount }}
              </template>
              <template v-slot:item.timestamp="{ item }">
                {{ formatDate(item.timestamp) }}
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      eggSettings: {
        enabled: true,
        probability: 10,
        minAmount: 5,
        maxAmount: 20
      },
      headers: [
        { text: '用戶', value: 'user' },
        { text: '金額', value: 'amount' },
        { text: '時間', value: 'timestamp' }
      ],
      eggRecords: []
    }
  },
  methods: {
    saveSettings() {
      this.loading = true
      // 模擬保存操作
      setTimeout(() => {
        this.loading = false
        this.$toast.success('設置已保存')
      }, 1000)
    },
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleString()
    }
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 15px;
  background: #e0e5ec;
  box-shadow:  9px 9px 16px rgb(163,177,198,0.6),
              -9px -9px 16px rgba(255,255,255, 0.5);
}
</style>