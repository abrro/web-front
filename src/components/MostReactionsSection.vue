<template>
  <b-container>
    <h3>Hot stories</h3>
    <ul v-for="article in articles" :key="article.id">
      <li>
        <router-link :to="{name : 'Article', params : {id : article.id}}">{{ article.title }}</router-link>
      </li>
    </ul>
  </b-container>
</template>

<script>
export default {
  name: "MostReactionsSection",

  props: {
    articles : []
  }
}
</script>

<style scoped>

</style>