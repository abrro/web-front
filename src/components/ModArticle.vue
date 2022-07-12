<template>
  <b-container fluid>
    <b-form @submit="handleSubmit">

      <template v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </template>

      Creator : {{this.creator}}

      <b-form-group
          id="input-group-1"
          label="Title:"
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="newTitle"
            type="text"
            placeholder="Enter news title here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-2"
          label="Content:"
          label-for="input-2"
      >
        <b-form-textarea
            id="input-2"
            v-model="newContent"
            type="text"
            placeholder="Write your news story here..."
            rows="6"
            required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="select-group-1" label="Select news category: " label-for="select-1">
        <b-form-select id="select-1" v-model="newCategory" required>

          <b-form-select-option :value="''">Please select an option</b-form-select-option>
          <b-form-select-option v-for="cat in categories"  :key="cat.label" :value="cat.label">{{ cat.label }}</b-form-select-option>

        </b-form-select>
      </b-form-group>

      <template>
        <div>
          <label for="tags-1">Place tags here in the input field below:</label>
          <b-form-tags
              input-id="tags-1"
              v-model="tagsArr"
              separator=" ,;"
              placeholder="Enter new tags separated by space, comma or semicolon"
              no-add-on-enter
              remove-on-delete
          ></b-form-tags>
          <p class="mt-2">Value: {{ tagsArr }}</p>
        </div>
      </template>

      <b-button type="submit" variant="primary">Submit</b-button>
    </b-form>

  </b-container>
</template>

<script>
export default {
  name: "ModArticle",

  props: {
    title: {
      type: String,
      default : ''
    },
    content: {
      type: String,
      default : ''
    },
    category: {
      type: String,
      default : ''
    },
    tags: {
      type: Array,
    },

    //creator uvek u propu, ne menja se
    creator: {
      type: String,
      default : ''
    }
  },

  data() {
    return {
      newTitle: '',
      newContent: '',
      newCategory: '',
      categories: [],
      errors: [],
      tagsArr: [],
    }
  },

  mounted() {
    this.newTitle = this.title;
    this.newContent = this.content;
    this.newCategory = this.category;
    this.tagsArr = this.tags;

    this.$axios.get(`/api/category`).then((response) => {
      this.categories = response.data;
    });
  },

  methods: {
    handleSubmit: async function (e) {
      e.preventDefault();

      this.errors = [];

      //POST
      if(!this.$route.params.id){
        this.$axios.post(`/api/articles`, {
          title: this.newTitle,
          content: this.newContent,
          category: this.newCategory,
          creator: this.creator,
          tags : this.tagsArr
        }).catch((error) => {
          this.errors.push(error.response.data);
        })

        this.newTitle = '';
        this.newContent = '';
        this.newCategory = '';
        this.tagsArr = [];
      }else{
        //MODIFY
        this.$axios.put(`/api/articles/${this.$route.params.id}`, {
          title: this.newTitle,
          content: this.newContent,
          category: this.newCategory,
          creator: this.creator,
          tags : this.tagsArr
        }).then((response) => {
          if(response.status === 200) {
            alert("Article successfully modified");
            this.$router.push({name: 'ArticlesByCategory', params: {label: this.newCategory}})
          }
        }).catch((error) => {
          this.errors.push(error.response.data);
        });
      }
    }
  }
}
</script>

<style scoped>

</style>