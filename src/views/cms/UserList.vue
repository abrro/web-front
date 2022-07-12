<template>
  <div>
    <Navbar/>

    <b-container>
      <b-button size="md" variant="primary" @click="new_user()">Add new user</b-button>
    </b-container>

    <b-pagination
        v-model="currentPage"
        :total-rows="userCount"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
    ></b-pagination>

    <b-table
        ref="usersTable"
        align="fill"
        hover v-if="userCount > 0"
        :busy.sync="isBusy"
        :items="itemProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        head-variant="dark">
      <template v-slot:cell(action)="row">
        <b-button size="sm" @click="modify(row.item.email)" class="mr-1">Modify</b-button>
        <b-button size="sm" @click="toggle_status(row.item.email)">Toggle status</b-button>
      </template>
    </b-table>
    <h1 v-else>No categories yet</h1>
  </div>
</template>

<script>
import Navbar from "../../components/Navbar";

export default {
  name: "UserList",

  components: {
    Navbar
  },

  data() {
    return {
      fields: [
        { key: 'email' },
        { key: 'name' },
        { key: 'lastname' },
        { key: 'type' },
        { key: 'status' },
        { key: 'action' }
      ],
      userCount : 0,
      perPage : 10,
      currentPage : 1,
      isBusy : false
    }
  },
  mounted() {
    this.$axios.get(`/api/users/count`).then((response) => {
      this.userCount = response.data;
    });
  },
  methods: {

    itemProvider : async function(ctx) {
      this.isBusy = true;
      try {
        const response = await this.$axios.get(`/api/users/page/${ctx.currentPage}`);
        this.isBusy = false;
        return response.data;
      } catch (error) {
        this.isBusy = false;
        return [];
      }
    },

    toggle_status : function (email){
      this.$axios.put(`/api/users/toggle/${email}`).then(response => {
          if(response.status === 204){
            this.$refs.usersTable.refresh();
          }
      }).catch(error => {
        alert(error.response.data)
        this.$refs.usersTable.refresh();
      })
    },

    modify: function (email) {
      this.$router.push({name: 'NewUser', params: { email: email } });
    },

    new_user: function() {
      this.$router.push({name: 'NewUser'});
    }
  }
}
</script>

<style>
tr:hover td{
  background: lightblue;
}
</style>