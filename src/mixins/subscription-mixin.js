import { mapActions } from 'vuex'

export default {
    methods: {
        ...mapActions([
            'increment_subs',
            'decrement_subs',
            'update_subscription_value',
          ]),
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
        subscribe: function(objId) {  
            let self = this
            this.increment_subs(objId) 

            // Get initial sate of object...
            this.getState(objId).then((data) => {
                self.update_subscription_value({ id: objId, newVal: data.val })
            }, (reason) => {
                if(reason) {
                    console.error(reason)
                } else {
                    console.error("The state with objectid: " + objId + " does not exist")
                }
            })    
            //...and then subscribe to it
            this.$socket.emit('subscribe', objId);
        },
        unsubscribe: function(objId) {
            this.decrement_subs(objId).then(noReferencesLeft => {
                // if object isn't referenced by any widget unsubscribe from object...
                if(noReferencesLeft) this.$socket.emit('unsubscribe', objId)
            })
        }
    }
}