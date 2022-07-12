<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="secondary">
      <b-navbar-brand href="#">News flash</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>

        <b-navbar-nav>
          <b-nav-item>
            <router-link :to="{name : 'Home'}"> Home </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="{name : 'TopNews'}"> Top news </router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="{name : 'Categories'}"> Categories </router-link>
          </b-nav-item>
        </b-navbar-nav>

        <b-navbar-nav class="ml-auto">

          <b-nav-form>
            <b-form-input v-model="searchInput"  size="md" class="mr-md-2" placeholder="Search articles..."></b-form-input>
            <b-button class="btn btn-primary" type="submit" @click="searchArticles">Search</b-button>
          </b-nav-form>


          <b-nav-form v-if="!isLogged" class="d-flex" @click="loginPage" right>
            <button class="btn btn-primary">Login</button>
          </b-nav-form>

          <b-nav-item v-if="isLogged">
            <span> User : {{getEmail}} </span>
          </b-nav-item>

          <b-nav-form v-if="isLogged" class="d-flex" @submit.prevent="logout" right>
            <button class="btn btn-primary" type="submit">Logout</button>
          </b-nav-form>

          <b-nav-item-dropdown v-if="isLogged" text="Menu" right>
            <b-dropdown-item>
              <div v-if="loggedAs === 'CONTENT_CREATOR' || 'ADMIN'" class="nav-item">
              <router-link :to="{name: 'CategoryList'}">Categories</router-link>
              </div>
            </b-dropdown-item>
            <b-dropdown-item>
              <div v-if="loggedAs === 'CONTENT_CREATOR' || 'ADMIN'" class="nav-item">
                <router-link :to="{name: 'Articles'}">All articles</router-link>
              </div>
            </b-dropdown-item>
            <b-dropdown-item>
              <div v-if="loggedAs === 'ADMIN'" class="nav-item">
                <router-link :to="{name: 'Users'}">User panel</router-link>
              </div>
            </b-dropdown-item>
          </b-nav-item-dropdown>

        </b-navbar-nav>

      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: "Navbar",

  data() {
    return {
     searchInput : '',
      userEmail : '',
    }
  },

  computed: {
    isLogged() {
      if(localStorage.getItem('jwt')) {
        return true;
      }
      return false;
    },
    loggedAs() {
      const jwt = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      const role = payload.role;
      return role;
    },

    getEmail : function (){
      const jwt = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.sub;
    }
  },
  methods: {
    loginPage() {
      this.$router.push({name : 'Login'})
    },

    logout() {
      localStorage.removeItem('jwt');
      if(this.$route.fullPath.includes("cms")){
        this.$router.push({name : 'Home'})
      }else{
        this.$router.go();
      }
    },

    searchArticles(e){
      e.preventDefault();
      if(this.searchInput === ''){
       alert("Search field must not be null");
      }else{
        if(this.$route.name !== 'SearchArticles'){
          this.$router.push({name: 'SearchArticles', params: {string : this.searchInput}});
        }else{
          this.$router.replace({name : 'SearchArticles', params: {string : this.searchInput}});
        }
      }
      this.searchInput = '';
    }
  }
}
</script>

<style scoped>

</style>