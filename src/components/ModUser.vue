<template>
  <b-container fluid>
    <b-form @submit="post_or_put">

      <template v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </template>

      <b-form-group
          id="input-group-1"
          label="Name:"
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="newName"
            type="text"
            placeholder="Enter user name here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-2"
          label="Last name:"
          label-for="input-2"
      >
        <b-form-input
            id="input-2"
            v-model="newLastName"
            type="text"
            placeholder="Enter user last name here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-3"
          label="Email:"
          label-for="input-3"
      >
        <b-form-input
            id="input-3"
            v-model="newEmail"
            type="email"
            placeholder="Enter user email here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="select-group-1" label="Select user type: " label-for="select-1">
        <b-form-select
            id="select-1"
            v-model="newType"
            :options="options"
        ></b-form-select>
      </b-form-group>

      <template v-if="passField">
      <b-form-group
          id="input-group-4"
          label="Password:"
          label-for="input-4"
      >
        <b-form-input
            id="input-4"
            v-model="newPass"
            type="password"
            placeholder="Enter user password here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-5"
          label="Confirm user password:"
          label-for="input-5"
      >
        <b-form-input
            id="input-5"
            v-model="newPassConfirm"
            type="password"
            placeholder="Re-type user password here..."
            required
        ></b-form-input>
      </b-form-group>
      </template>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>

  </b-container>
</template>

<script>
export default {
  name: "ModCategory",

  props: {
    name: {
      type: String,
      default : ''
    },
    lastname: {
      type: String,
      default : ''
    },
    email: {
      type: String,
      default : ''
    },
    type: {
      type: String,
      default : ''
    },
    passField: {
      type: Boolean,
      default : false
    },

    //put metoda nema opicju menja password prema tekstu zadatka, zato prosledjen isti iz parenta
    passHashForPut: {
      type: String,
      default : ''
    },
  },

  data() {
    return {
      newName: '',
      newLastName: '',
      newEmail: '',
      newType: '',
      newPass: '',
      newPassConfirm: '',

      options: [
        { value: '', text: 'Please select an option' },
        { value: 'CONTENT_CREATOR', text: 'Content creator' },
        { value: 'ADMIN', text: 'Admin'}
      ],
      errors: []
    }
  },

  mounted() {
    this.newName = this.name;
    this.newLastName = this.lastname;
    this.newEmail = this.email;
    this.newType = this.type;
  },

  methods: {
    post_or_put: function(e) {
      e.preventDefault();

      this.errors = [];

      if (this.$route.params.email === undefined) {
        this.$axios.post(`/api/users`, {
          name: this.newName,
          lastname: this.newLastName,
          email: this.newEmail,
          type: this.newType,
          status: 1,
          passHash: this.newPass
        }).then((response) => {
          if(response.status === 200){
            alert("User successfully created");
          }
        }).catch((error) => {
          this.errors.push(error.response.data);
        });
        this.newName = '';
        this.newLastName = '';
        this.newEmail = '';
        this.newType = '';
        this.newPass = '';
        this.newPassConfirm = '';
      } else {
        this.$axios.put(`/api/users/${this.$route.params.email}`, {
          name: this.newName,
          lastname: this.newLastName,
          email: this.newEmail,
          type: this.newType,
          passHash: this.passHashForPut
        }).then((response) => {
          if (response.status === 200) {
            alert("User data modified successfully.");
            this.$router.push({name : "Users"});
          }
        }).catch((error) => {
          this.errors.push(error.response.data);
        });
        }
    }
  }
}
</script>

<style scoped>

</style>