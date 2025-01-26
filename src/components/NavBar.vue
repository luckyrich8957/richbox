<template>
  <nav class="navbar">
    <div class="navbar-brand">
      <router-link to="/" class="logo-link">
        <img src="@/assets/logo.png" alt="Logo" class="logo">
        <span class="brand-name">超級抽盲盒</span>
      </router-link>
    </div>

    <div class="navbar-menu">
      <ul class="navbar-items">
        <li class="navbar-item">
          <router-link to="/" class="nav-link">
            <i class="icon-home"></i>
            首頁
          </router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/shop" class="nav-link">
            <i class="icon-shop"></i>
            商城
          </router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/rank" class="nav-link">
            <i class="icon-rank"></i>
            排行榜
          </router-link>
        </li>
        <li class="navbar-item">
          <router-link to="/profile" class="nav-link">
            <i class="icon-profile"></i>
            個人中心
          </router-link>
        </li>
      </ul>

      <div class="navbar-actions">
        <button class="action-button" @click="openChat">
          <i class="icon-chat"></i>
          客服
        </button>
        <button class="action-button" @click="toggleTheme">
          <i class="icon-theme"></i>
          切換主題
        </button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    openChat() {
      this.$store.dispatch('chat/openChatWindow')
    },
    toggleTheme() {
      this.$store.dispatch('ui/toggleTheme')
    }
  }
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-brand {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.logo {
  width: 40px;
  height: 40px;
  margin-right: 0.5rem;
}

.brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.navbar-menu {
  display: flex;
  align-items: center;
}

.navbar-items {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

.navbar-item {
  margin: 0 1rem;
}

.nav-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-color);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.router-link-exact-active {
    color: var(--primary-color);
    font-weight: bold;
  }
}

.navbar-actions {
  display: flex;
  margin-left: 2rem;
}

.action-button {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  margin: 0 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }
}

/* 響應式設計 */
@media (max-width: 768px) {
  .navbar {
    padding: 0.5rem 1rem;
  }

  .navbar-menu {
    display: none;
  }
}
</style>