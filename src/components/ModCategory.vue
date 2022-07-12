<template>
  <b-container fluid>
    <b-form @submit="post_or_put">

      <template v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </template>

      <b-form-group
          id="input-group-1"
          label="Label:"
          label-for="input-1"
      >
        <b-form-input
            id="input-1"
            v-model="newLabel"
            type="text"
            placeholder="Enter category label here..."
            required
        ></b-form-input>
      </b-form-group>

      <b-form-group
          id="input-group-2"
          label="Description:"
          label-for="input-2"
      >
        <b-form-textarea
            id="input-2"
            v-model="newDescription"
            type="text"
            placeholder="Describe this category..."
            rows="4"
            required
        ></b-form-textarea>
      </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>

    </b-form>
  </b-container>
</template>

<script>
export default {
  name: "ModCategory",

  props: {
    label: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    }
  },

  data() {
    return {
      newLabel: '',
      newDescription: '',

      errors: []
    }
  },

  mounted: function () {
    this.newLabel = this.label;
    this.newDescription = this.description;
  },

  methods: {
    post_or_put: function(e) {
      e.preventDefault()

      this.errors = [];

      if (!this.$route.params.label) {
        this.$axios.post(`/api/category`, {
          label: this.newLabel,
          description: this.newDescription,
        }).then((response) => {
          if (response.status === 200) {
            alert("Category successfully created");
          }
        }).catch(error => {
          this.errors.push(error.response.data)
        });
        this.newLabel = '';
        this.newDescription = '';
      } else {
        this.$axios.put(`/api/category/${this.$route.params.label}`, {
          label: this.newLabel,
          description: this.newDescription,
        }).then((response) => {
          if (response.status === 200) {
            alert("Category modified successfully");
            this.$router.push({name: "CategoryList"})
          }
        }).catch(error => {
          this.errors.push(error.response.data)
        });
      }
    }
  },
}
</script>

<style scoped>

</style>