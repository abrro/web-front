<template>
  <b-container>
    <Navbar/>

    <b-container>
      <b-row>
        <b-col>
          <h1>Articles</h1>
        </b-col>
        <b-col>
          <MostReactionsSection v-if="articlesHot.length" :articles="articlesHot"/>
        </b-col>
      </b-row>
    </b-container>

    <b-container v-if="totalRows && articles.length">
      <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          align="center"
      ></b-pagination>

      <ArticlesCardList :articles="articles"/>
    </b-container>

    <h1 v-else> No articles found</h1>

  </b-container>
</template>

<script>
import Navbar from "@/components/Navbar";
import ArticlesCardList from "@/components/ArticlesCardList";
import MostReactionsSection from "@/components/MostReactionsSection";

export default {
  name: "SearchArticles",
  components: {
    Navbar,
    ArticlesCardList,
    MostReactionsSection
  },

  data() {
    return {
      articles: [],
      articlesHot: [],
      currentPage : 1,
      perPage : 10,
      totalRows: 0,
    }
  },

  watch:{
    currentPage: function(page){
      this.$axios.get(`api/articles/search/${this.$route.params.string}/page/${page}`).then((response) => {
        this.articles = response.data;
      })
    },

    "$route.params.string" : function(){
      this.currentPage = 1;
      this.$axios.get(`/api/articles/search/${this.$route.params.string}/count`).then((response) => {
        this.totalRows = response.data;
      })
      this.$axios.get(`api/articles/search/${this.$route.params.string}/page/${this.currentPage}`).then((response) => {
        this.articles = response.data;
      })
    }

  },
  created() {
    this.$axios.get(`/api/articles/search/${this.$route.params.string}/count`).then((response) => {
      this.totalRows = response.data;
    });
    this.$axios.get(`api/articles/search/${this.$route.params.string}/page/${this.currentPage}`).then((response) => {
      this.articles = response.data;
    });
    this.$axios.get(`/api/articles/hot`).then((response) => {
      this.articlesHot = response.data;
    });
  }
}
</script>

<style scoped>

</style>