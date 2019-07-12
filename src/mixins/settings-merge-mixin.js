import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

export default {
    props: ["widgetId"],
    
    /**
     * Merges widget settings with base settings.
     */
    created () {  
        let mergedSettings = merge(this.widgetSettings, this.$parent.settings)    
        this.$emit("update", this.widgetId, cloneDeep(mergedSettings))
    },
    methods: {
        /**
         * This function loads the widget-setting from database. However if there is nothing 
         * stored yet (on initial creation of the widget) it loads the default widget setting.
         * 
         * @param {String} key 
         */
        loadSetting(key) {
            if (this.settings[key] === undefined) {
                return this.widgetSettings[key].val
            }

            return this.settings[key].val
        }
    }
}
