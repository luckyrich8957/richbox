<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">系統監控</h1>
      </v-col>

      <!-- 系統狀態 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="primary" class="mr-3">mdi-server</v-icon>
            <div>
              <div class="text-h6">服務器狀態</div>
              <div class="text-h4 font-weight-bold">正常</div>
              <div class="text-caption text--secondary">運行時間: 12天</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="success" class="mr-3">mdi-database</v-icon>
            <div>
              <div class="text-h6">數據庫狀態</div>
              <div class="text-h4 font-weight-bold">正常</div>
              <div class="text-caption text--secondary">連接數: 32</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="warning" class="mr-3">mdi-alert-circle</v-icon>
            <div>
              <div class="text-h6">警告數量</div>
              <div class="text-h4 font-weight-bold">2</div>
              <div class="text-caption text--secondary">過去24小時</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- 監控圖表 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>CPU 使用率</v-card-title>
          <v-card-text>
            <line-chart :chart-data="cpuUsageData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>內存使用</v-card-title>
          <v-card-text>
            <bar-chart :chart-data="memoryUsageData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>網絡流量</v-card-title>
          <v-card-text>
            <line-chart :chart-data="networkTrafficData" />
          </v-card-text>
        </v-card>
      </v-col>

      <!-- 警告列表 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>系統警告</v-card-title>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="alerts"
              :loading="loading"
              loading-text="加載中..."
              no-data-text="暫無數據"
            >
              <template v-slot:item.severity="{ item }">
                <v-chip :color="getSeverityColor(item.severity)" small>
                  {{ item.severity }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

export default {
  components: {
    LineChart,
    BarChart
  },
  data() {
    return {
      loading: false,
      cpuUsageData: {
        labels: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
        datasets: [
          {
            label: 'CPU 使用率',
            backgroundColor: '#1976D2',
            data: [40, 39, 10, 40, 39, 80]
          }
        ]
      },
      memoryUsageData: {
        labels: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
        datasets: [
          {
            label: '內存使用',
            backgroundColor: '#4CAF50',
            data: [4000, 3000, 2000, 2780, 1890, 2390]
          }
        ]
      },
      networkTrafficData: {
        labels: ['1:00', '2:00', '3:00', '4:00', '5:00', '6:00'],
        datasets: [
          {
            label: '網絡流量',
            backgroundColor: '#FF5722',
            data: [300, 50, 100, 200, 150, 250]
          }
        ]
      },
      headers: [
        { text: '時間', value: 'timestamp' },
        { text: '級別', value: 'severity' },
        { text: '描述', value: 'description' }
      ],
      alerts: []
    }
  },
  methods: {
    getSeverityColor(severity) {
      switch (severity) {
        case 'critical': return 'error'
        case 'warning': return 'warning'
        case 'info': return 'info'
        default: return 'grey'
      }
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

/* Metrics */
.metric-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.metric-card {
  padding: 1.5rem;
}

.metric-card .v-icon {
  font-size: 2rem;
  padding: 1rem;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.12);
  color: #7367f0;
}

.metric-card .text-h6 {
  color: #6e6b7b;
  font-size: 1rem;
}

.metric-card .text-h4 {
  color: #5e5873;
  font-weight: 600;
}

.metric-card .text-caption {
  color: #b9b9c3;
}

/* Charts */
.chart-container {
  position: relative;
  height: 400px;
}

.chart-legend {
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Alerts */
.v-alert {
  border-radius: 6px;
  margin: 0;
}
</style>