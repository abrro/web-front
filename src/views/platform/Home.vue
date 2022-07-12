<template>
  <b-container>
    <Navbar/>

    <b-container>
      <b-row>
        <b-col>
          <h1>Newest stories</h1>
        </b-col>
        <b-col>
          <MostReactionsSection v-if="articlesHot.length" :articles="articlesHot"/>
        </b-col>
      </b-row>
    </b-container>

    <div v-for="article in articles" v-bind:key="article.id">

      <b-card>
        <b-card-title>
          {{article.title}}
        </b-card-title>
        <b-card-sub-title>
          In category :  {{article.category}}
        </b-card-sub-title>
        <br>
        <b-card-sub-title>
          By :  {{article.creator}}
        </b-card-sub-title>
        <br>

        <b-card-text>
          <div>{{article.content | sliceContent}}</div>
          <span>
            <router-link :to="{name : 'Article', params: {id : article.id}}">
              See more
            </router-link>
          </span>
        </b-card-text>

        <b-card-text>
          <span> Views: {{article.visits}}</span>
          <br>
          <span> Likes: {{article.likes}}</span>
          <span> Dislikes: {{article.dislikes}}</span>
        </b-card-text>

        <b-card-sub-title>
          Date:  {{article.date}}
        </b-card-sub-title>

      </b-card>
      <br>
      <br>

    </div>
  </b-container>
</template>

<script>
import Navbar from "../../components/Navbar";
import MostReactionsSection from "@/components/MostReactionsSection";

export default {
  name: 'Home',

  components: {
    Navbar,
    MostReactionsSection
  },

  data(){
    return {
      articles: [],
      articlesHot: [],
      user: {}
    }
  },

  filters: {
    sliceContent(value) {
      if (value.length < 200) {
        return value;
      }
      return value.slice(0, 200) + '...'
    }
  },

  created(){
    this.$axios.get(`/api/articles/newest`).then((response) => {
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

