<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">數據統計</h1>
      </v-col>

      <!-- 關鍵指標 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="primary" class="mr-3">mdi-chart-line</v-icon>
            <div>
              <div class="text-h6">日活躍用戶</div>
              <div class="text-h4 font-weight-bold">1,234</div>
              <div class="text-caption text--secondary">+12% 較昨日</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="success" class="mr-3">mdi-cash-multiple</v-icon>
            <div>
              <div class="text-h6">日收入</div>
              <div class="text-h4 font-weight-bold">¥12,345</div>
              <div class="text-caption text--secondary">+8% 較昨日</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="warning" class="mr-3">mdi-package-variant</v-icon>
            <div>
              <div class="text-h6">盲盒銷售</div>
              <div class="text-h4 font-weight-bold">567</div>
              <div class="text-caption text--secondary">+15% 較昨日</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- 圖表區域 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>用戶增長趨勢</v-card-title>
          <v-card-text>
            <line-chart :chart-data="userGrowthData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>收入來源分布</v-card-title>
          <v-card-text>
            <pie-chart :chart-data="revenueSourceData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>用戶留存率</v-card-title>
          <v-card-text>
            <bar-chart :chart-data="retentionRateData" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

export default {
  components: {
    LineChart,
    BarChart,
    PieChart
  },
  data() {
    return {
      userGrowthData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '用戶數',
            backgroundColor: '#1976D2',
            data: [400, 390, 100, 400, 390, 800]
          }
        ]
      },
      revenueSourceData: {
        labels: ['盲盒銷售', '廣告收入', '其他'],
        datasets: [
          {
            backgroundColor: ['#FFC107', '#FF5722', '#9C27B0'],
            data: [300, 50, 100]
          }
        ]
      },
      retentionRateData: {
        labels: ['1日', '7日', '30日'],
        datasets: [
          {
            label: '留存率',
            backgroundColor: '#4CAF50',
            data: [80, 50, 20]
          }
        ]
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

/* Statistics Cards */
.stat-card {
  padding: 1.5rem;
}

.stat-card .v-icon {
  font-size: 2rem;
  padding: 1rem;
  border-radius: 50%;
  background: rgba(115, 103, 240, 0.12);
  color: #7367f0;
}

.stat-card .text-h6 {
  color: #6e6b7b;
  font-size: 1rem;
}

.stat-card .text-h4 {
  color: #5e5873;
  font-weight: 600;
}

.stat-card .text-caption {
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

.chart-legend-item {
  display: flex;
  align-items: center;
  margin: 0.25rem 0;
}

.chart-legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

/* Filters */
.filter-container {
  margin-bottom: 1.5rem;
}

.filter-container .v-select {
  margin-right: 1rem;
}

.filter-container .v-btn {
  text-transform: none;
  font-weight: 500;
}
</style>