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
import { gsap } from 'gsap';

interface BlindboxState {
  boxes: Array<{
    id: string;
    name: string;
    price: number;
    probability: number;
    model: string;
    animation: string;
  }>;
  rewards: Array<{
    id: string;
    type: 'normal' | 'hidden' | 'special';
    name: string;
    image: string;
    value: number;
  }>;
  userStats: {
    dailyDraws: number;
    totalDraws: number;
    lastDrawTime: string;
  };
  currentBox: any;
  drawHistory: Array<{
    id: string;
    boxId: string;
    rewardId: string;
    createTime: string;
  }>;
}

const blindbox: Module<BlindboxState, any> = {
  namespaced: true,

  state: {
    boxes: [],
    rewards: [],
    userStats: {
      dailyDraws: 0,
      totalDraws: 0,
      lastDrawTime: ''
    },
    currentBox: null,
    drawHistory: []
  },

  mutations: {
    SET_BOXES(state, boxes) {
      state.boxes = boxes;
    },
    SET_REWARDS(state, rewards) {
      state.rewards = rewards;
    },
    SET_CURRENT_BOX(state, box) {
      state.currentBox = box;
    },
    UPDATE_USER_STATS(state, stats) {
      state.userStats = { ...state.userStats, ...stats };
    },
    ADD_DRAW_HISTORY(state, record) {
      state.drawHistory.unshift(record);
    }
  },

  actions: {
    async loadBoxes({ commit }) {
      try {
        const response = await axios.get('/api/blindbox/boxes');
        commit('SET_BOXES', response.data);
      } catch (error) {
        console.error('Failed to load boxes:', error);
        throw error;
      }
    },

    async drawBox({ commit, state }, { boxId, retryCount = 0 }) {
      try {
        // 检查每日抽取限制
        if (state.userStats.dailyDraws >= 10) {
          throw new Error(this.$t('blindbox.dailyLimit') || '已達到每日抽取限制');
        }

        const response = await axios.post('/api/blindbox/draw', {
          boxId,
          retryCount
        });

        const { reward, stats } = response.data;

        // 更新用户统计
        commit('UPDATE_USER_STATS', stats);

        // 添加抽奖记录
        commit('ADD_DRAW_HISTORY', {
          id: Date.now().toString(),
          boxId,
          rewardId: reward.id,
          createTime: new Date().toISOString()
        });

        // 如果是隐藏奖励，触发红包雨动画
        if (reward.type === 'hidden') {
          this.dispatch('blindbox/triggerRedPacketRain');
        }

        return reward;
      } catch (error) {
        console.error('Draw box failed:', error);
        throw error;
      }
    },

    async retryDraw({ dispatch }, boxId) {
      return dispatch('drawBox', { boxId, retryCount: 1 });
    },

    triggerRedPacketRain({ state }) {
      // 创建红包雨动画
      const container = document.createElement('div');
      container.className = 'red-packet-rain';
      document.body.appendChild(container);

      // 创建多个红包元素
      for (let i = 0; i < 20; i++) {
        const packet = document.createElement('div');
        packet.className = 'red-packet';
        container.appendChild(packet);

        // 使用GSAP创建动画
        gsap.fromTo(packet,
          {
            x: Math.random() * window.innerWidth,
            y: -50,
            rotation: Math.random() * 360
          },
          {
            y: window.innerHeight + 50,
            rotation: Math.random() * 360,
            duration: 2 + Math.random() * 2,
            ease: 'none',
            onComplete: () => {
              packet.remove();
              if (container.children.length === 0) {
                container.remove();
              }
            }
          }
        );
      }
    },

    async getDrawHistory({ commit }) {
      try {
        const response = await axios.get('/api/blindbox/history');
        return response.data;
      } catch (error) {
        console.error('Failed to get draw history:', error);
        throw error;
      }
    }
  },

  getters: {
    canDraw: state => state.userStats.dailyDraws < 10,
    remainingDraws: state => 10 - state.userStats.dailyDraws,
    boxById: state => (id: string) => state.boxes.find(box => box.id === id),
    rewardById: state => (id: string) => state.rewards.find(reward => reward.id === id)
  }
};

export default blindbox;
