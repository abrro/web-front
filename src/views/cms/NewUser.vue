<template>
  <b-container>
    <Navbar/>
    <ModUser v-if="mountFlag"
             :name="name"
             :lastname="lastname"
             :email="email"
             :type="type"
             :pass-hash-for-put="passHash"
             :pass-field="passField"
    />
  </b-container>
</template>

<script>
import ModUser from "@/components/ModUser";
import Navbar from "@/components/Navbar";

export default {
  name: "NewUser",
  components: {
    ModUser,
    Navbar
  },
  data() {
    return {
      name: '',
      lastname: '',
      email: '',
      type: '',
      passHash: '',
      passField: false,
      mountFlag: false
    }
  },
  created() {
    if (this.$route.params.email !== undefined && this.$route.params.email.length > 0) {
      this.$axios.get(`/api/users/${this.$route.params.email}`).then(response => {
        this.name = response.data.name;
        this.lastname = response.data.lastname;
        this.email = response.data.email;
        this.type = response.data.type;
        this.passHash = response.data.passHash;

        this.mountFlag = true;
      });
      } else {
      this.mountFlag = true;
      this.passField = true;
      }
  }
}
</script>

<style scoped>

</style>