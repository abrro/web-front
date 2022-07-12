<template>
  <b-container fluid>
    <Navbar/>

    <b-form @submit="login">

      <template v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </template>

      <b-form-group
          id="input-group-1"
          label="Email:"
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="email"
            type="email"
            placeholder="Enter your email here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-2"
          label="Password:"
          label-for="input-2"
      >
        <b-form-input
            id="input-2"
            v-model="password"
            type="password"
            placeholder="Enter your password here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>
  </b-container>
</template>

<script>
import Navbar from "../../components/Navbar";

export default {
  name: "Login",

  components: {
    Navbar
  },

  data() {
    return {
      email: '',
      password: '',

      errors: []
    }
  },
  methods: {
    login(e) {
      e.preventDefault();
      this.errors = [];

      this.$axios.post('/api/authenticate', {
        email: this.email,
        password: this.password,
      }).then(response => {
        localStorage.setItem('jwt', response.data.jwt)
        this.$router.push({name: 'CategoryList'});
      }).catch(error => {
        this.errors.push(error.response.data.message);
      });

      this.email = '';
      this.password = '';
    }
  },
}
</script>

<style scoped>

</style>