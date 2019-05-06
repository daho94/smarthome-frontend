export const baseSettings = {
    created: function () {
      this.hello()
    },
    data: function () {
        return {
          settings: {
              title: "FromMixin"
          }
        }
    }
  }