<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list dense>
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.to"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>後台管理系統</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { title: '儀表板', icon: 'mdi-view-dashboard', to: '/admin/dashboard' },
      { title: '盲盒管理', icon: 'mdi-package-variant', to: '/admin/blindbox' },
      { title: '彩蛋配置', icon: 'mdi-egg', to: '/admin/eggs' },
      { title: '數據統計', icon: 'mdi-chart-bar', to: '/admin/analytics' },
      { title: '用戶管理', icon: 'mdi-account-group', to: '/admin/users' },
      { title: '權限管理', icon: 'mdi-shield-account', to: '/admin/roles' },
      { title: '系統監控', icon: 'mdi-monitor', to: '/admin/monitor' },
      { title: '潮幣管理', icon: 'mdi-currency-usd', to: '/admin/tide-coin' }
    ]
  })
}
</script>

<style scoped>
/* Layout */
.v-application {
  background: #f8f8f8;
}

/* Navbar */
.v-app-bar {
  background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, 0.7)) !important;
  box-shadow: 0 0 10px 1px rgb(115 103 240 / 70%) !important;
}

.v-app-bar .v-toolbar-title {
  color: #fff;
  font-weight: 600;
}

/* Sidebar */
.v-navigation-drawer {
  background: #fff !important;
  box-shadow: 0 0 15px 0 rgba(34, 41, 47, 0.05);
}

.v-list-item {
  margin: 0.5rem;
  border-radius: 0.5em;
  background: #e8e8e8;
  border: 1px solid #e8e8e8;
  transition: all 0.3s;
  box-shadow:
    6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
}

.v-list-item--active {
  background-color: rgba(115, 103, 240, 0.12) !important;
  color: #7367f0 !important;
  box-shadow:
    0px 0px 0px #c5c5c5,
    0px 0px 0px #ffffff,
    inset 4px 4px 12px #c5c5c5,
    inset -4px -4px 12px #ffffff;
}

.v-list-item--active .v-icon {
  color: #7367f0 !important;
}

.v-list-item:hover {
  box-shadow:
    6px 6px 12px #c5c5c5,
    -6px -6px 12px #ffffff;
}

.v-list-item:active {
  color: #666;
  box-shadow:
    0px 0px 0px #c5c5c5,
    0px 0px 0px #ffffff,
    inset 4px 4px 12px #c5c5c5,
    inset -4px -4px 12px #ffffff;
}

/* Main Content */
.v-main {
  padding: 2rem 1.5rem !important;
}

/* Cards */
.v-card {
  border-radius: 6px;
  box-shadow: 0 4px 24px 0 rgba(34, 41, 47, 0.1);
  border: none;
}

.v-card-title {
  font-weight: 600;
  color: #5e5873;
}
</style>