import { Module } from 'vuex';
import axios from 'axios';

interface PaymentState {
  balance: number;
  transactions: Array<{
    id: string;
    amount: number;
    type: 'recharge' | 'consume';
    status: 'pending' | 'completed' | 'failed';
    createTime: string;
    qrcode?: string;
  }>;
  exchangeRates: {
    small: { coins: number; price: number };
    large: { coins: number; price: number };
  };
}

const payment: Module<PaymentState, any> = {
  namespaced: true,
  
  state: {
    balance: 0,
    transactions: [],
    exchangeRates: {
      small: { coins: 100, price: 100 },
      large: { coins: 500, price: 450 }
    }
  },

  mutations: {
    SET_BALANCE(state, balance) {
      state.balance = balance;
    },
    ADD_TRANSACTION(state, transaction) {
      state.transactions.unshift(transaction);
    },
    UPDATE_TRANSACTION_STATUS(state, { id, status }) {
      const transaction = state.transactions.find(t => t.id === id);
      if (transaction) {
        transaction.status = status;
      }
    }
  },

  actions: {
    async createRechargeOrder({ commit }, { amount, type }) {
      try {
        const response = await axios.post('/api/payment/recharge', { amount, type });
        const { transaction, qrcode } = response.data;
        
        commit('ADD_TRANSACTION', {
          ...transaction,
          qrcode
        });
        
        return transaction.id;
      } catch (error) {
        console.error('Failed to create recharge order:', error);
        throw error;
      }
    },

    async checkPaymentStatus({ commit }, transactionId) {
      try {
        const response = await axios.get(`/api/payment/status/${transactionId}`);
        const { status, balance } = response.data;
        
        commit('UPDATE_TRANSACTION_STATUS', { id: transactionId, status });
        if (status === 'completed') {
          commit('SET_BALANCE', balance);
        }
        
        return status;
      } catch (error) {
        console.error('Failed to check payment status:', error);
        throw error;
      }
    },

    async getTransactionHistory({ commit }) {
      try {
        const response = await axios.get('/api/payment/transactions');
        return response.data.transactions;
      } catch (error) {
        console.error('Failed to get transaction history:', error);
        throw error;
      }
    }
  },

  getters: {
    currentBalance: state => state.balance,
    pendingTransactions: state => state.transactions.filter(t => t.status === 'pending'),
    exchangeRates: state => state.exchangeRates
  }
};

export default payment;
