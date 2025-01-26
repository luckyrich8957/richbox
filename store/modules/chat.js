import io from 'socket.io-client';

const socket = io('http://localhost:3000', {
  transports: ['websocket'],
  autoConnect: false
});

export default {
    state: {
        messages: [],
        unreadCount: 0,
        currentChat: null,
        chatList: [],
        socket: null,
        isConnected: false,
        searchResults: [],
        searchQuery: '',
        isSearching: false,
        searchError: null
    },
    mutations: {
        SET_SOCKET(state, socket) {
            state.socket = socket;
        },
        SET_CONNECTION_STATUS(state, status) {
            state.isConnected = status;
        },
        SET_MESSAGES(state, messages) {
            state.messages = messages;
        },
        ADD_MESSAGE(state, message) {
            state.messages.push(message);
            if (message.from !== 'user' && !message.read) {
                state.unreadCount++;
            }
        },
        SET_UNREAD(state, count) {
            state.unreadCount = count;
        },
        SET_CURRENT_CHAT(state, chat) {
            state.currentChat = chat;
        },
        UPDATE_CHAT_LIST(state, list) {
            state.chatList = list;
        },
        MARK_AS_READ(state, messageId) {
            const message = state.messages.find(m => m.id === messageId);
            if (message) {
                message.read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        }
    },
    actions: {
        connectSocket({ commit, dispatch }) {
            socket.connect();
            
            socket.on('connect', () => {
                commit('SET_CONNECTION_STATUS', true);
                dispatch('setupSocketListeners');
            });

            socket.on('disconnect', () => {
                commit('SET_CONNECTION_STATUS', false);
            });

            commit('SET_SOCKET', socket);
        },

        disconnectSocket({ state }) {
            if (state.socket) {
                state.socket.disconnect();
            }
        },

        setupSocketListeners({ commit }) {
            socket.on('new_message', (message) => {
                commit('ADD_MESSAGE', {
                    ...message,
                    read: false
                });
            });

            socket.on('message_read', (messageId) => {
                commit('MARK_AS_READ', messageId);
            });

            socket.on('chat_history', (messages) => {
                commit('SET_MESSAGES', messages);
            });
        },

        async sendMessage({ commit, state }, { content, type = 'text', to }) {
            const message = {
                id: Date.now(),
                content,
                type,
                from: 'user',
                to,
                timestamp: new Date().toISOString(),
                read: false
            };
            
            commit('ADD_MESSAGE', message);
            
            if (state.socket) {
                state.socket.emit('send_message', message);
            }
        },

        async loadChatHistory({ state }, userId) {
            if (state.socket) {
                state.socket.emit('request_chat_history', userId);
            }
        },

        async markAsRead({ commit, state }, messageId) {
            commit('MARK_AS_READ', messageId);
            
            if (state.socket) {
                state.socket.emit('mark_message_read', messageId);
            }
        },

        async searchMessages({ commit, state }, { query, startDate, endDate }) {
            commit('SET_SEARCHING', true);
            commit('SET_SEARCH_ERROR', null);
            
            try {
                if (state.socket) {
                    state.socket.emit('search_messages', {
                        query,
                        startDate,
                        endDate,
                        chatId: state.currentChat?.id
                    });
                }
            } catch (error) {
                commit('SET_SEARCH_ERROR', error);
            } finally {
                commit('SET_SEARCHING', false);
            }
        },

        async clearSearchResults({ commit }) {
            commit('SET_SEARCH_RESULTS', []);
            commit('SET_SEARCH_QUERY', '');
        }
    },
    getters: {
        unreadMessages: state => state.messages.filter(m => !m.read),
        currentChatMessages: state => state.messages.filter(m => 
            m.to === state.currentChat?.id || m.from === state.currentChat?.id
        )
    }
};
