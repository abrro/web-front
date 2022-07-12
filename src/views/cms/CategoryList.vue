<template>
  <div>
    <Navbar/>

    <b-container>
      <b-button size="md" variant="primary" @click="new_category()">Add new category</b-button>
    </b-container>

    <b-pagination
        v-model="currentPage"
        :total-rows="categoriesCount"
        :per-page="perPage"
        align="fill"
        size="sm"
        class="my-0"
    ></b-pagination>

    <b-table
        ref="categoriesTable"
        align="fill"
        hover v-if="categoriesCount > 0"
        :busy.sync="isBusy"
        :items="itemProvider"
        :fields="fields"
        :current-page="currentPage"
        :per-page="perPage"
        head-variant="dark"
        @row-clicked="articles_by_category">
      <template v-slot:cell(action)="row">
        <b-button size="sm" @click="modify(row.item.label)" class="mr-1">Modify</b-button>
        <b-button size="sm" @click="remove(row.item.label)">Delete</b-button>
      </template>
    </b-table>
    <h1 v-else>No categories yet</h1>
  </div>
</template>

<script>
import Navbar from "../../components/Navbar";

export default {
  name: "CategoryList",
  components: {
    Navbar
  },

  data() {
    return {
      fields: [
        { key: 'label' },
        { key: 'description' },
        { key: 'action' }
      ],
      categoriesCount : 0,
      perPage : 10,
      currentPage : 1,
      isBusy : false
    }
  },
  mounted() {
    this.$axios.get(`/api/category/count`).then((response) => {
      this.categoriesCount = response.data;
    });
  },
  methods: {
    itemProvider : async function(ctx) {
      this.isBusy = true
      try {
        const response = await this.$axios.get(`/api/category/page/${ctx.currentPage}`)
        this.isBusy = false
        return response.data
      } catch (error) {
        this.isBusy = false
        return []
      }
    },

    articles_by_category : function (item){
      this.$router.push({name: 'ArticlesByCategory', params: { label: item.label } });
    },
    remove: function (label) {
      this.$axios.delete(`/api/category/${label}`).then(response => {
        if(response.status === 204){
          this.$refs.categoriesTable.refresh();
        }
      }).catch(error => {
        alert(error.response.data)
      })
    },
    modify: function (label) {
      this.$router.push({name: 'NewCategory', params: { label: label } });
    },
    new_category: function() {
      this.$router.push({name: 'NewCategory'});
    }
  }
}
</script>

<style>
  tr:hover td{
    background: lightblue;
  }
</style>