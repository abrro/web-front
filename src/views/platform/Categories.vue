<template>
  <b-container>
    <Navbar/>

    <b-container>
      <b-row>
        <b-col>
          <h1>Categories</h1>
        </b-col>
        <b-col>
          <MostReactionsSection v-if="articlesHot.length" :articles="articlesHot"/>
        </b-col>
      </b-row>
    </b-container>

    <template>
      <div v-if="totalRows">

        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            aria-controls="category-list"
            align="center"
        ></b-pagination>
            <div class="category_list" v-for="category in categories" :key="category.label">
              <b-card>
                <b-card-title>
                  <router-link :to="{name : 'ArticlesInCategory', params: {label : category.label}}">
                    {{category.label}}
                  </router-link>
                </b-card-title>

                <b-card-sub-title>
                  Description :
                </b-card-sub-title>

                <b-card-text>
                 {{category.description}}
                </b-card-text>
              </b-card>
            </div>
      </div>
      <h1 v-else>No categories yet.</h1>
    </template>

  </b-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import MostReactionsSection from "@/components/MostReactionsSection";

export default {
  name: "Categories",
  components: {
    Navbar,
    MostReactionsSection
  },

  data() {
    return {
      categories: [],
      articlesHot: [],
      totalRows: 0,
      currentPage: 1,
      perPage: 10
    }
  },

  watch:{
    currentPage: function(page){
      this.$axios.get(`/api/category/page/${page}`).then((response) => {
        console.log(response.data)
        this.categories = response.data;
      })
    }
  },

  created() {
    this.$axios.get(`/api/category/count`).then((response) => {
      this.totalRows = response.data;
    });
    this.$axios.get(`/api/category/page/1`).then((response) => {
      this.categories = response.data;
    });
    this.$axios.get(`/api/articles/hot`).then((response) => {
      this.articlesHot = response.data;
    });
  }
}
</script>

<style scoped>

</style>