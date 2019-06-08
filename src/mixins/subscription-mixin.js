import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions([
            'increment_subs',
            'decrement_subs',
            'update_subscription_value',
          ]),
        /**
         * Get the current state of objId
         * @param {String} objId 
         */
        getState: function(objId) {
            return new Promise((resolve, reject) => {
                this.$socket.emit('getState', objId, function (err, data) {
                    if (err || !data) {
                        reject(err)
                    } else {
                        resolve(data)
                    }
                })
            })
        },
        /**
         * Get the current state of all available objects
         */
        getStates: function() {
            return new Promise(resolve => {
                this.$socket.emit('getStates', function(err, states) {
                    resolve(states)
                })
            })
        },
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
                this.getState(objId).then(data => {
                    self.update_subscription_value({ id: objId, newVal: data.val })
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
                this.$socket.emit('subscribe', objId); 
            })

        },
        /**
         * Decrements subcount of objId in $store and unsubcribes if
         * subcount reaches 0
         * @param {String} objId 
         */
        unsubscribe: function(objId) {
            if (!objId) return;

            this.decrement_subs(objId).then(noReferencesLeft => {
                // if object isn't referenced by any widget unsubscribe from object...
                if(noReferencesLeft) this.$socket.emit('unsubscribe', objId)
            })
        },
        /**
         * Tries to update value to new state if object exists 
         * @param {String} objId 
         * @returns {String} val or N/A
         */
        updateValue: function(objId) {
            const notAvailable = "N/A"
            if (objId && this.$store.state.subscriptions[objId.val]) {
                const val = this.$store.state.subscriptions[objId.val].val
                return  val !== undefined ? val : notAvailable   
            }
            return notAvailable
        }
    }
}