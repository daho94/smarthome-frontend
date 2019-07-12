import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({

    state: {
        subscriptions: {},
        connected: false,
    },
    getters: {
        subscriptionCount: state => {
            return Object.keys(state.subscriptions).length
        }
    },
    mutations: {
        SOCKET_connect(state) {
            console.info("Socket connected")
            state.connected = true
        },
        SOCKET_disconnect(state) {
            state.connected = false
        },
        SOCKET_stateChange(state, data) {
            console.info("State changed")
            state.subscriptions[data[0]].state = data[1]
        },
        increment_subs(state, id) {
            let obj = state.subscriptions[id]
            if(!obj) {
                Vue.set(state.subscriptions, id, { 
                    subscriber: 0,
                    state: undefined,
                })
                obj = state.subscriptions[id]
            }
            obj.subscriber++
        },
        decrement_subs(state, id) {
            let obj = state.subscriptions[id]
            obj.subscriber--
           
            if(obj.subscriber == 0) {
                Vue.delete(state.subscriptions, id)
            }
        },
        update_subscription_value(state, { id, newState }) {
            let obj = state.subscriptions[id]
            if (obj) {
                obj.state = newState
            }
        }
    },
    actions: {
        increment_subs ({ commit }, id) {
            commit('increment_subs', id)
        },
        decrement_subs ({ commit, state }, id) {
            return new Promise((resolve) => {
                commit('decrement_subs', id)
                resolve(state.subscriptions[id] === undefined)
            })
        },
        update_subscription_value ({ commit }, payload) {
            commit('update_subscription_value', payload)
        },
    }

})