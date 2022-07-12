<template>
  <b-container>
      <Navbar/>
      <ModCategory v-if="mountFlag" :label="label" :description="description"/>
  </b-container>
</template>

<script>
import ModCategory from "@/components/ModCategory";
import Navbar from "../../components/Navbar";

export default {

  name: "NewCategory",
  components: {
    ModCategory,
    Navbar
  },
  data() {
    return {
      label: '',
      description: '',
      mountFlag: false
    }
  },
  created() {
    if(this.$route.params.label !== undefined && this.$route.params.label.length > 0){
      this.$axios.get(`/api/category/${this.$route.params.label}`).then((response) => {
        this.label = response.data.label;
        this.description = response.data.description;

        this.mountFlag = true;
      });
    }else{
        this.mountFlag = true;
      }
    }
  }

</script>

<style scoped>

</style>