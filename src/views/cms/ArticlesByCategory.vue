<template>
  <b-container>
    <Navbar/>
    <ArticleList v-if="ready" :articlesCount="articlesCount"
                              :category="this.$route.params.label"
    />
  </b-container>
</template>

<script>
import Navbar from "../../components/Navbar";
import ArticleList from "@/components/ArticleList";

export default {
  name: "ArticlesByCategory",
  components: {
    ArticleList,
    Navbar
  },
  data() {
    return {
      articlesCount : 0,
      ready: false,
    }
  },
  created() {
    this.$axios.get(`/api/category/${this.$route.params.label}/articles/count`).then((response) => {
      this.articlesCount = response.data;
      this.ready = true;
    });
  }
}
</script>

<style scoped>

</style>