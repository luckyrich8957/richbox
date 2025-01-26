import { Module } from 'vuex';
import axios from 'axios';

interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'completed';
  shipping: {
    address: string;
    contact: string;
    phone: string;
  };
  createTime: string;
  updateTime: string;
}

interface ShopState {
  cart: OrderItem[];
  orders: Order[];
  promotions: Array<{
    id: string;
    type: 'discount' | 'limited' | 'lottery';
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    conditions: any;
  }>;
}

const shop: Module<ShopState, any> = {
  namespaced: true,

  state: {
    cart: [],
    orders: [],
    promotions: []
  },

  mutations: {
    ADD_TO_CART(state, item: OrderItem) {
      const existingItem = state.cart.find(i => i.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
      } else {
        state.cart.push(item);
      }
    },
    
    REMOVE_FROM_CART(state, productId: string) {
      state.cart = state.cart.filter(item => item.productId !== productId);
    },
    
    CLEAR_CART(state) {
      state.cart = [];
    },
    
    ADD_ORDER(state, order: Order) {
      state.orders.unshift(order);
    },
    
    UPDATE_ORDER_STATUS(state, { orderId, status }) {
      const order = state.orders.find(o => o.id === orderId);
      if (order) {
        order.status = status;
        order.updateTime = new Date().toISOString();
      }
    },
    
    SET_PROMOTIONS(state, promotions) {
      state.promotions = promotions;
    }
  },

  actions: {
    async checkout({ commit, state, dispatch }, shippingInfo) {
      try {
        const response = await axios.post('/api/shop/checkout', {
          items: state.cart,
          shipping: shippingInfo
        });
        
        const order = response.data;
        commit('ADD_ORDER', order);
        commit('CLEAR_CART');
        
        // Trigger order notification
        await dispatch('notifications/createOrderNotification', {
          orderId: order.id,
          status: 'pending'
        }, { root: true });
        
        return order;
      } catch (error) {
        console.error('Checkout failed:', error);
        throw error;
      }
    },

    async submitReview({ commit }, { orderId, rating, content }) {
      try {
        await axios.post(`/api/shop/orders/${orderId}/review`, {
          rating,
          content
        });
        
        // 更新订单状态为已完成
        commit('UPDATE_ORDER_STATUS', { orderId, status: 'completed' });
      } catch (error) {
        console.error('Failed to submit review:', error);
        throw error;
      }
    },

    async fetchPromotions({ commit }) {
      try {
        const response = await axios.get('/api/shop/promotions');
        commit('SET_PROMOTIONS', response.data);
      } catch (error) {
        console.error('Failed to fetch promotions:', error);
        throw error;
      }
    },

    async applyPromotion({ commit }, { orderId, promotionId }) {
      try {
        const response = await axios.post(`/api/shop/orders/${orderId}/promotion`, {
          promotionId
        });
        return response.data;
      } catch (error) {
        console.error('Failed to apply promotion:', error);
        throw error;
      }
    }
  },

  getters: {
    cartTotal: state => state.cart.reduce((total, item) => total + item.price * item.quantity, 0),
    cartItemCount: state => state.cart.reduce((count, item) => count + item.quantity, 0),
    activePromotions: state => {
      const now = new Date().toISOString();
      return state.promotions.filter(p => 
        p.startTime <= now && p.endTime >= now
      );
    }
  }
};

export default shop;
