import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'

export default {
    props: ["widgetId"],
    
    //This works only in a very specific scenario
    created () {  
        let mergedSettings = merge(this.widgetSettings, this.$parent.settings)    
        this.$emit("update", this.widgetId, cloneDeep(mergedSettings))
    }
}
