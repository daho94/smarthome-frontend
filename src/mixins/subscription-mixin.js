import { mapActions } from 'vuex'
import { getState } from '../calls/iobroker'

export default {
    methods: {
        ...mapActions([
            'increment_subs',
            'decrement_subs',
            'update_subscription_value',
          ]),
        /**
         * Increments subcount of objId in $store and subscribes to it
         * @param {String} objId 
         * @returns {String} val
         */
        subscribe: function(objId) {
            let self = this
            return new Promise(resolve => {
                if (!objId) return resolve("N/A")
                this.increment_subs(objId)

                // Get initial state of object...
                getState(this.$socket, objId).then(data => {
                    self.update_subscription_value({ id: objId, newState: data })
                    resolve(data.val)
                }, (reason) => {
                    if(reason) {
                        console.error(reason)
                    } else {
                        console.error("The state with objectid: " + objId + " does not exist")
                    }
                    resolve("N/A")
                })       

                //...and then subscribe to it
                this.$socket.emit('subscribe', objId + "$"); 
            })

        },
        /**
         * Decrements subcount of objId in $store and unsubcribes if
         * subcount equals 0
         * @param {String} objId 
         */
        async unsubscribe(objId) {
            if (!objId) return;

            const noReferencesLeft = await this.decrement_subs(objId)

            if(noReferencesLeft) this.$socket.emit('unsubscribe', objId + "$")

        },
        /**
         * Tries to update value to new state if object exists 
         * @param {String} objId 
         * @returns {String} val or undefined
         */
        updateValue: function(objId) {
            if (objId && this.$store.state.subscriptions[objId.val]) {
                const state = this.$store.state.subscriptions[objId.val].state
                return  state !== undefined ? state : undefined   
            }
            return undefined
        }
    }
}