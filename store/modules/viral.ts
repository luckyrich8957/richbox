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

interface ViralState {
  referralCode: string;
  referralStats: {
    totalInvites: number;
    successfulInvites: number;
    pendingInvites: number;
    rewards: any[];
  };
  recommendations: Array<{
    id: string;
    type: 'product' | 'blindbox' | 'event';
    title: string;
    description: string;
    image: string;
    score: number;
  }>;
  seoData: {
    title: string;
    description: string;
    keywords: string[];
    structuredData: any;
  };
}

const viral: Module<ViralState, any> = {
  namespaced: true,

  state: {
    referralCode: '',
    referralStats: {
      totalInvites: 0,
      successfulInvites: 0,
      pendingInvites: 0,
      rewards: []
    },
    recommendations: [],
    seoData: {
      title: '',
      description: '',
      keywords: [],
      structuredData: null
    }
  },

  mutations: {
    SET_REFERRAL_CODE(state, code) {
      state.referralCode = code;
    },
    UPDATE_REFERRAL_STATS(state, stats) {
      state.referralStats = { ...state.referralStats, ...stats };
    },
    SET_RECOMMENDATIONS(state, recommendations) {
      state.recommendations = recommendations;
    },
    UPDATE_SEO_DATA(state, data) {
      state.seoData = { ...state.seoData, ...data };
    }
  },

  actions: {
    async generateReferralCode({ commit }) {
      try {
        const response = await axios.post('/api/viral/referral/generate');
        commit('SET_REFERRAL_CODE', response.data.code);
        return response.data.code;
      } catch (error) {
        console.error(this.$t('viral.generateReferralError') || '生成推薦碼失敗:', error);
        throw error;
      }
    },

    async processReferral({ commit }, { code, userId }) {
      try {
        const response = await axios.post('/api/viral/referral/process', {
          code,
          userId
        });
        
        commit('UPDATE_REFERRAL_STATS', response.data.stats);
        return response.data.reward;
      } catch (error) {
        console.error('Failed to process referral:', error);
        throw error;
      }
    },

    async generateRecommendations({ commit, rootState }, userId) {
      try {
        // 获取用户历史行为数据
        const userData = await axios.get(`/api/users/${userId}/behavior`);
        
        // 获取所有可用内容
        const allItems = await axios.get('/api/items');
        
        // 计算推荐分数
        const recommendations = allItems.data.map(item => {
          let score = 0;
          
          // 基于用户兴趣
          if (userData.data.interests.includes(item.category)) {
            score += 0.4;
          }
          
          // 基于用户历史购买
          if (userData.data.purchasedItems.includes(item.id)) {
            score += 0.3;
          }
          
          // 基于社交推荐
          if (userData.data.friendsPurchased.includes(item.id)) {
            score += 0.2;
          }
          
          // 基于热门程度
          score += item.popularity * 0.1;
          
          return {
            ...item,
            score: parseFloat(score.toFixed(2))
          };
        });
        
        // 按分数排序并取前10
        const sorted = recommendations
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        
        commit('SET_RECOMMENDATIONS', sorted);
        return sorted;
      } catch (error) {
        console.error('Failed to generate recommendations:', error);
        throw error;
      }
    },

    async updateSEOData({ commit }, { path, data }) {
      try {
        // 生成结构化数据
        const structuredData = {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: data.title,
          description: data.description,
          image: data.image,
          url: window.location.href,
          offers: {
            '@type': 'Offer',
            price: data.price,
            priceCurrency: 'TWD',
            availability: 'https://schema.org/InStock'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            reviewCount: data.reviewCount
          },
          brand: {
            '@type': 'Brand',
            name: data.brand
          }
        };

        // 更新SEO数据
        commit('UPDATE_SEO_DATA', {
          ...data,
          structuredData
        });

        // 更新meta标签
        document.title = data.title;
        document.querySelector('meta[name="description"]')?.setAttribute('content', data.description);
        document.querySelector('meta[name="keywords"]')?.setAttribute('content', data.keywords.join(','));

        // 添加结构化数据
        let scriptTag = document.querySelector('#structured-data');
        if (!scriptTag) {
          scriptTag = document.createElement('script');
          scriptTag.id = 'structured-data';
          scriptTag.setAttribute('type', 'application/ld+json');
          document.head.appendChild(scriptTag);
        }
        scriptTag.textContent = JSON.stringify(structuredData);

      } catch (error) {
        console.error('Failed to update SEO data:', error);
        throw error;
      }
    },

    async trackViralMetrics({ commit }, data) {
      try {
        await axios.post('/api/viral/metrics', data);
      } catch (error) {
        console.error('Failed to track viral metrics:', error);
        throw error;
      }
    }
  },

  getters: {
    referralUrl: state => `${window.location.origin}?ref=${state.referralCode}`,
    topRecommendations: state => state.recommendations.slice(0, 5),
    seoTags: state => ({
      title: state.seoData.title,
      meta: [
        { name: 'description', content: state.seoData.description },
        { name: 'keywords', content: state.seoData.keywords.join(',') },
        { property: 'og:title', content: state.seoData.title },
        { property: 'og:description', content: state.seoData.description },
        { property: 'og:image', content: state.seoData.image },
        { property: 'og:url', content: window.location.href },
        { property: 'og:type', content: 'product' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: state.seoData.title },
        { name: 'twitter:description', content: state.seoData.description },
        { name: 'twitter:image', content: state.seoData.image }
      ]
    })
  }
};

export default viral;
