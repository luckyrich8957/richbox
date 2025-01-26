import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

type GetterTree<S, R> = any;
type ActionTree<S, R> = any;
type MutationTree<S> = any;
type ModuleTree<R> = any;
type Module<S, R> = any;

declare module 'vuex' {
  interface Module<S, R> {
    namespaced?: boolean;
    state?: S | (() => S);
    getters?: GetterTree<S, R>;
    actions?: ActionTree<S, R>;
    mutations?: MutationTree<S>;
    modules?: ModuleTree<R>;
  }
}

interface Notification {
  id: string;
  type: 'order' | 'promotion' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: string;
  metadata?: any;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const notifications: Module<NotificationState, any> = {
  namespaced: true,

  state: {
    notifications: [],
    unreadCount: 0
  },

  mutations: {
    ADD_NOTIFICATION(state, notification: Notification) {
      state.notifications.unshift(notification);
      if (!notification.read) {
        state.unreadCount++;
      }
    },

    MARK_AS_READ(state, id: string) {
      const notification = state.notifications.find(n => n.id === id);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount--;
      }
    },

    MARK_ALL_AS_READ(state) {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },

    CLEAR_NOTIFICATIONS(state) {
      state.notifications = [];
      state.unreadCount = 0;
    }
  },

  actions: {
    async fetchNotifications({ commit }) {
      try {
        const response = await axios.get('/api/notifications');
        response.data.forEach((n: Notification) => commit('ADD_NOTIFICATION', n));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        throw error;
      }
    },

    async createOrderNotification({ commit }, { orderId, status }) {
      try {
        const response = await axios.post('/api/notifications/order', {
          orderId,
          status
        });
        commit('ADD_NOTIFICATION', response.data);
      } catch (error) {
        console.error('Failed to create order notification:', error);
        throw error;
      }
    },

    async markAsRead({ commit }, id: string) {
      try {
        await axios.patch(`/api/notifications/${id}/read`);
        commit('MARK_AS_READ', id);
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
        throw error;
      }
    }
  },

  getters: {
    unreadNotifications: state => state.notifications.filter(n => !n.read),
    recentNotifications: state => state.notifications.slice(0, 5),
    hasUnread: state => state.unreadCount > 0
  }
};

export default notifications;