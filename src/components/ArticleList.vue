<template>
  <b-container fluid>

    <b-row align-content="center" align-h="center">
        <h1 v-if="category">Articles in category: {{category}}</h1>
        <h1 v-else>All articles</h1>
    </b-row>

    <b-row>
    <b-col lg="5" class="c-0">
      <b-button size="md" variant="primary" @click="new_article()">Add new article</b-button>
    </b-col>

    <b-col lg="7" class="c-1">
      <b-form-group
          label="Search"
          label-for="filter-input"
          label-cols-md="3"
          label-align-md="right"
          label-size="md"
          class="mb-0"
      >
        <b-input-group size="md">
          <b-form-input
              id="filter-input"
              v-model="filter"
              type="search"
              debounce="1000"
              placeholder="Type to search articles by title or content"
          ></b-form-input>

          <b-input-group-append>
            <b-button :disabled="!filter" @click="resetSearch">Clear</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-form-group>
    </b-col>
    </b-row>

    <b-pagination
        v-model="currentPage"
        :total-rows="totalRows"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
    ></b-pagination>

    <b-table
        ref="articlesTable"
        hover v-if="articlesCount > 0"
        :busy.sync="isBusy"
        :items="itemProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        :filter="filter"
        head-variant="light"
        >
      <template v-slot:cell(title)="link">
        <b-link @click="articleInNewTab(link.item.id)">{{ link.item.title }}</b-link>
      </template>
      <template v-slot:cell(action)="row">
        <b-button size="sm" @click="modify(row.item.id)" class="mr-1">Modify</b-button>
        <b-button size="sm" @click="remove(row.item.id)">Delete</b-button>
      </template>
    </b-table>
    <h1 v-else>No articles yet</h1>
  </b-container>
</template>

<script>
export default {
  name: "ArticleList",
  props: {
    articlesCount : {
      type: Number
    },
    category : {
      type: String
    }
  },
  data() {
    return {
      fields: [
        { key: 'title' },
        { key: 'creator' },
        { key: 'date' },
        { key: 'action' }
      ],

      perPage : 10,
      totalRows: 0,
      currentPage : 1,
      isBusy : false,
      filter: ''
    }
  },
  mounted() {
    this.totalRows = this.articlesCount;
  },
  methods: {
    itemProvider : async function(ctx) {
      if(ctx.filter === '') {
        this.isBusy = true;
        try {
          if (this.$route.params.label !== undefined) {
            const response = await this.$axios.get(`/api/category/${this.$route.params.label}/articles/page/${ctx.currentPage}`);
            this.totalRows = this.articlesCount;
            this.isBusy = false;
            return response.data;
          } else {
            const response = await this.$axios.get(`/api/articles/page/${ctx.currentPage}`);
            this.totalRows = this.articlesCount;
            this.isBusy = false;
            return response.data;
          }
        } catch (error) {
          this.isBusy = false;
          return [];
        }
      }else{
        this.isBusy = true;
        try {
          if (this.$route.params.label !== undefined) {
            const results = await this.$axios.get(`/api/category/${this.$route.params.label}/articles/search/${ctx.filter}/count`);
            this.totalRows = results.data;

            const response = await this.$axios.get(`/api/category/${this.$route.params.label}/articles/search/${ctx.filter}/page/${ctx.currentPage}`);
            this.isBusy = false;
            return response.data;
          } else {
            const results = await this.$axios.get(`/api/articles/search/${ctx.filter}/count`);
            this.totalRows = results.data;

            const response = await this.$axios.get(`/api/articles/search/${ctx.filter}/page/${ctx.currentPage}`);
            this.isBusy = false;
            return response.data;
          }
        } catch (error) {
          this.isBusy = false;
          return [];
        }
      }
    },
    resetSearch: function (){
      this.filter = '';
      this.totalRows = this.articlesCount;
    },
    new_article: function() {
      this.$router.push({name: 'NewArticle'});
    },
    modify : function(id) {
      this.$router.push({name: 'NewArticle', params: { id: id } });
    },
    remove : function(id) {
      this.$axios.delete(`/api/articles/${id}`);
      this.$refs.articlesTable.refresh();
    },
    articleInNewTab : function(id) {
      let route = this.$router.resolve({name : 'Article', params: {id : id}});
      window.open(route.href, '_blank');
    }
  }
}
</script>

<style scoped>

</style>