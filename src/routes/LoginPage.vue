<template>
        <section class="wrapper">
            <h2>Login</h2>
            <form @submit.prevent="handleSubmit">
                <div class="form-group">
                    <input placeholder="Username" type="text" v-model="username" name="username" class="form-control" :class="{ 'is-invalid': submitted && !username }" />
                    <div v-show="submitted && !username" class="invalid-feedback">Username is required</div>
                </div>
                <div class="form-group">
                    <input placeholder="Password" type="password" v-model="password" name="password" class="form-control" :class="{ 'is-invalid': submitted && !password }" />
                    <div v-show="submitted && !password" class="invalid-feedback">Password is required</div>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary">Login</button>
                </div>
            </form>
        </section>
</template>

<script>
import { login } from '../calls/auth'

export default {
  components: {
  },
  data() {
    return {
        username: '',
        password: '',
        submitted: false
    }
  },
  computed: {
  },
  methods: {
      handleSubmit() {
          this.submitted = true;
          const { username, password } = this;
          if (username && password) {
              login(username, password).then(() => {
                  this.$router.push("/")
              })
          }
      }
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
    height: 100vh;
    width: 100vw;
    display: flex;
    justify-content: center;
    flex-flow: column;
    align-items: center;

    h2,form {
        width: 100%;
    }
    form {
        display: flex;
        flex-flow: column;
        justify-content: center;
        align-items: center;
    }
}
.form-control {
    width: 100%;
}
.form-group {
    width: 80%;
}
</style>