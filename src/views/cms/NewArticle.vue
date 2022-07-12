<template>
  <b-container>
    <Navbar/>
    <ModArticle v-if="mountFlag" :title="title"
                :content="content"
                :category="category"
                :creator="creator"
                :tags="tags"/>
  </b-container>
</template>

<script>
import ModArticle from "@/components/ModArticle";
import Navbar from "../../components/Navbar";

export default {
  name: "NewArticle",
  components: {
    ModArticle,
    Navbar
  },
  data() {
    return {
      title: '',
      content: '',
      creator: '',
      category: '',
      tags: [],

      mountFlag: false
    }
  },
  created() {
    this.creator = this.getUserInfo();
    if (this.$route.params.id !== undefined && this.$route.params.id > 0) {
      this.$axios.get(`/api/articles/${this.$route.params.id}`).then(response => {
        this.title = response.data.title;
        this.content = response.data.content;
        this.category = response.data.category;
        this.tags = response.data.tags;
        this.mountFlag = true;
      })
    } else {
      this.mountFlag = true
    }
  },
  methods: {
    getUserInfo : function(){
      const jwt = localStorage.getItem('jwt');
      const payload = JSON.parse(atob(jwt.split('.')[1]));
      return payload.sub;
    }
  }
}
</script>

<style scoped>

</style>