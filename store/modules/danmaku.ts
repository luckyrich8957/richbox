import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// 手动定义 Module 类型
interface Module<S, R> {
  namespaced?: boolean;
  state?: S | (() => S);
  getters?: any;
  actions?: any;
  mutations?: any;
  modules?: any;
}
import axios from 'axios';

interface DanmakuState {
  messages: Array<{
    id: string;
    content: string;
    type: 'normal' | 'special' | 'reward';
    color: string;
    timestamp: string;
  }>;
  templates: Array<{
    id: string;
    content: string;
    type: string;
    conditions: any;
  }>;
  settings: {
    enabled: boolean;
    speed: number;
    opacity: number;
    density: number;
  };
}

const danmaku: Module<DanmakuState, any> = {
  namespaced: true,

  state: {
    messages: [],
    templates: [],
    settings: {
      enabled: true,
      speed: 1,
      opacity: 0.8,
      density: 1
    }
  },

  mutations: {
    ADD_MESSAGE(state, message) {
      state.messages.push(message);
      // 保持消息队列在合理范围内
      if (state.messages.length > 100) {
        state.messages.shift();
      }
    },
    SET_TEMPLATES(state, templates) {
      state.templates = templates;
    },
    UPDATE_SETTINGS(state, settings) {
      state.settings = { ...state.settings, ...settings };
    }
  },

  actions: {
    async loadTemplates({ commit }) {
      // 加載特殊獎品模板
      const specialTemplates = [
        {
          id: 'special-1',
          content: '🎉 恭喜 {user} 獲得限量獎品：{reward}！',
          type: 'special',
          conditions: {
            minValue: 1000,
            types: ['limited']
          }
        },
        {
          id: 'special-2',
          content: '✨ {user} 抽中了稀有獎品：{reward}！',
          type: 'special',
          conditions: {
            minValue: 500,
            types: ['rare']
          }
        }
      ];
      commit('SET_TEMPLATES', specialTemplates);
      try {
        const response = await axios.get('/api/danmaku/templates');
        commit('SET_TEMPLATES', response.data);
      } catch (error) {
        console.error(this.$t('danmaku.loadTemplatesError') || '加載彈幕模板失敗:', error);
        throw error;
      }
    },

    async createDanmaku({ commit, state }, { type, reward }) {
      try {
        // 根据类型和奖励选择合适的模板
        const templates = state.templates.filter(t => 
          t.type === type && 
          (!t.conditions || this.matchConditions(t.conditions, reward))
        );

        if (templates.length === 0) return;

        // 随机选择一个模板
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // 替换模板中的变量
        let content = template.content
          .replace('{reward}', reward.name)
          .replace('{value}', reward.value.toString());

        const message = {
          id: Date.now().toString(),
          content,
          type,
          color: type === 'special' ? '#ff4444' : '#ffffff',
          timestamp: new Date().toISOString()
        };

        commit('ADD_MESSAGE', message);

        // 发送到服务器保存
        await axios.post('/api/danmaku/messages', message);

        return message;
      } catch (error) {
        console.error(this.$t('danmaku.createError') || '創建彈幕失敗:', error);
        throw error;
      }
    },

    matchConditions(conditions: any, reward: any) {
      // 检查奖励是否满足模板条件
      if (conditions.minValue && reward.value < conditions.minValue) {
        return false;
      }
      if (conditions.maxValue && reward.value > conditions.maxValue) {
        return false;
      }
      if (conditions.types && !conditions.types.includes(reward.type)) {
        return false;
      }
      return true;
    }
  },

  getters: {
    activeMessages: state => state.messages.slice(-20),
    specialMessages: state => state.messages.filter(m => m.type === 'special'),
    templatesByType: state => (type: string) => 
      state.templates.filter(t => t.type === type)
  }
};

export default danmaku;
