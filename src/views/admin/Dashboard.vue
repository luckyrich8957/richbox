<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1 class="text-h4 mb-4">儀表板</h1>
      </v-col>

      <!-- 統計卡片 -->
      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="primary" class="mr-3">mdi-account-group</v-icon>
            <div>
              <div class="text-h6">活躍用戶</div>
              <div class="text-h4 font-weight-bold">1,234</div>
              <div class="text-caption text--secondary">過去7天</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="pa-4">
          <div class="d-flex align-center">
            <v-icon large color="success" class="mr-3">mdi-cash-multiple</v-icon>
            <div>
              <div class="text-h6">總收入</div>
              <div class="text-h4 font-weight-bold">¥12,345</div>
              <div class="text-caption text--secondary">本月</div>
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
              <div class="text-caption text--secondary">今日</div>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- 圖表區域 -->
      <v-col cols="12">
        <v-card>
          <v-card-title>用戶活躍度</v-card-title>
          <v-card-text>
            <line-chart :chart-data="userActivityData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>收入分析</v-card-title>
          <v-card-text>
            <bar-chart :chart-data="revenueData" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>盲盒銷售分布</v-card-title>
          <v-card-text>
            <pie-chart :chart-data="salesDistributionData" />
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
      userActivityData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '活躍用戶',
            backgroundColor: '#1976D2',
            data: [40, 39, 10, 40, 39, 80]
          }
        ]
      },
      revenueData: {
        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
        datasets: [
          {
            label: '收入',
            backgroundColor: '#4CAF50',
            data: [4000, 3000, 2000, 2780, 1890, 2390]
          }
        ]
      },
      salesDistributionData: {
        labels: ['普通盲盒', '稀有盲盒', '限定盲盒'],
        datasets: [
          {
            backgroundColor: ['#FFC107', '#FF5722', '#9C27B0'],
            data: [300, 50, 100]
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
  border: none;
  background: #fff;
}

.v-card-title {
  font-weight: 600;
  color: #5e5873;
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
.chart-card {
  padding: 1.5rem;
}

.chart-card .v-card-title {
  padding-bottom: 1.5rem;
}
</style>