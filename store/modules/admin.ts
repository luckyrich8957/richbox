import { Module } from 'vuex';
import axios from 'axios';

interface ThemeConfig {
  id: string;
  name: string;
  backgroundImage: string;
  buttonStyle: string;
  colorScheme: string;
  isActive: boolean;
}

interface AdminState {
  statistics: {
    activeUsers: number;
    totalRevenue: number;
    salesData: any[];
    userRetention: any[];
  };
  notifications: any[];
  systemStatus: {
    cpuUsage: number;
    memoryUsage: number;
    onlineUsers: number;
    errorRate: number;
  };
  marketingCampaigns: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    startTime: string;
    endTime: string;
    conditions: any;
    rewards: any;
  }>;
  themes: ThemeConfig[];
  currentTheme: ThemeConfig | null;
  uploadedImages: Array<{
    id: string;
    url: string;
    type: 'background' | 'icon' | 'logo';
    uploadTime: string;
  }>;
}

const admin: Module<AdminState, any> = {
  namespaced: true,

  state: {
    statistics: {
      activeUsers: 0,
      totalRevenue: 0,
      salesData: [],
      userRetention: []
    },
    notifications: [],
    systemStatus: {
      cpuUsage: 0,
      memoryUsage: 0,
      onlineUsers: 0,
      errorRate: 0
    },
    marketingCampaigns: [],
    themes: [],
    currentTheme: null,
    uploadedImages: []
  },

  mutations: {
    UPDATE_STATISTICS(state, stats) {
      state.statistics = { ...state.statistics, ...stats };
    },
    ADD_NOTIFICATION(state, notification) {
      state.notifications.unshift(notification);
    },
    UPDATE_SYSTEM_STATUS(state, status) {
      state.systemStatus = { ...state.systemStatus, ...status };
    },
    SET_MARKETING_CAMPAIGNS(state, campaigns) {
      state.marketingCampaigns = campaigns;
    },
    
    ADD_THEME(state, theme) {
      state.themes.push(theme);
    },
    
    UPDATE_THEME(state, updatedTheme) {
      const index = state.themes.findIndex(t => t.id === updatedTheme.id);
      if (index !== -1) {
        state.themes.splice(index, 1, updatedTheme);
      }
    },
    
    SET_ACTIVE_THEME(state, themeId) {
      const theme = state.themes.find(t => t.id === themeId);
      if (theme) {
        state.currentTheme = theme;
      }
    },
    
    ADD_UPLOADED_IMAGE(state, image) {
      state.uploadedImages.push(image);
    },
    
    REMOVE_UPLOADED_IMAGE(state, imageId) {
      state.uploadedImages = state.uploadedImages.filter(img => img.id !== imageId);
    }
  },

  actions: {
    async fetchStatistics({ commit }) {
      try {
        const response = await axios.get('/api/admin/statistics');
        commit('UPDATE_STATISTICS', response.data);
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        throw error;
      }
    },

    async monitorSystem({ commit }) {
      try {
        const response = await axios.get('/api/admin/system-status');
        commit('UPDATE_SYSTEM_STATUS', response.data);

        // 检查异常情况
        if (response.data.errorRate > 0.05) {
          commit('ADD_NOTIFICATION', {
            type: 'error',
            message: '系统错误率超过阈值',
            timestamp: new Date().toISOString()
          });
        }

        if (response.data.cpuUsage > 80) {
          commit('ADD_NOTIFICATION', {
            type: 'warning',
            message: 'CPU使用率过高',
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('System monitoring failed:', error);
        throw error;
      }
    },

    async createMarketingCampaign({ commit }, campaign) {
      try {
        const response = await axios.post('/api/admin/marketing/campaigns', campaign);
        const newCampaign = response.data;
        
        commit('SET_MARKETING_CAMPAIGNS', [
          newCampaign,
          ...state.marketingCampaigns
        ]);
        
        return newCampaign;
      } catch (error) {
        console.error('Failed to create marketing campaign:', error);
        throw error;
      }
    },

    async updateBlindboxConfig({ commit }, config) {
      try {
        await axios.put('/api/admin/blindbox/config', config);
      } catch (error) {
        console.error('Failed to update blindbox config:', error);
        throw error;
      }
    },

    async detectAbnormalBehavior({ commit }) {
      try {
        const response = await axios.get('/api/admin/security/abnormal');
        
        response.data.forEach(incident => {
          commit('ADD_NOTIFICATION', {
            type: 'security',
            message: `检测到异常行为: ${incident.description}`,
            timestamp: new Date().toISOString(),
            data: incident
          });
        });
      } catch (error) {
        console.error('Abnormal behavior detection failed:', error);
        throw error;
      }
    },

    async uploadThemeImage({ commit }, file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await axios.post('/api/admin/themes/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        commit('ADD_UPLOADED_IMAGE', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to upload theme image:', error);
        throw error;
      }
    },

    async createTheme({ commit }, themeData) {
      try {
        const response = await axios.post('/api/admin/themes', themeData);
        commit('ADD_THEME', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to create theme:', error);
        throw error;
      }
    },

    async updateTheme({ commit }, themeData) {
      try {
        const response = await axios.put(`/api/admin/themes/${themeData.id}`, themeData);
        commit('UPDATE_THEME', response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to update theme:', error);
        throw error;
      }
    },

    async applyTheme({ commit }, themeId) {
      try {
        await axios.post(`/api/admin/themes/${themeId}/apply`);
        commit('SET_ACTIVE_THEME', themeId);
      } catch (error) {
        console.error('Failed to apply theme:', error);
        throw error;
      }
    }
  },

  getters: {
    revenueByPeriod: state => (start: string, end: string) => {
      // 根据时间范围计算收入
      return state.statistics.salesData.filter(data =>
        data.timestamp >= start && data.timestamp <= end
      ).reduce((total, data) => total + data.revenue, 0);
    },
    
    activeMarketingCampaigns: (state) => {
      const now = new Date().toISOString();
      return state.marketingCampaigns.filter(campaign =>
        campaign.status === 'active' &&
        campaign.startTime <= now &&
        campaign.endTime >= now
      );
    },
    
    criticalNotifications: state =>
      state.notifications.filter(n =>
        n.type === 'error' || n.type === 'security'
      ),
      
    availableThemes: state => state.themes,
    activeTheme: state => state.currentTheme,
    uploadedImagesByType: state => (type: string) =>
      state.uploadedImages.filter(img => img.type === type),
    themeOptions: state => state.themes.map(theme => ({
      value: theme.id,
      label: theme.name,
      preview: theme.backgroundImage
    }))
  }
};

export default admin;
