<template>
  <b-container>
    <Navbar/>
    <ArticleList v-if="ready" :articlesCount="articlesCount"/>
  </b-container>
</template>

<script>
import Navbar from "../../components/Navbar";
import ArticleList from "@/components/ArticleList";

export default {
  name: "Articles",
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
    this.$axios.get(`/api/articles/count`).then((response) => {
      this.articlesCount = response.data;
      this.ready = true;
    });
  }
}
</script>

<style scoped>

</style>