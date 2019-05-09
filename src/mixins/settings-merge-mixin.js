import merge from 'lodash/merge'

export default {
    //This works only in a very specific scenario
    mounted () {
        //Merge widget specifig settings with base settings
        this.$parent.settings = merge(this.$parent.settings, this.settings)    
      }
}
