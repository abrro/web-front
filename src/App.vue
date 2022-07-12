<template>
  <div>
    <div class="container">
      <router-view/>
    </div>
  </div>
</template>

<script>
//import Navbar from "./components/Navbar";
export default {

  created() {
    console.log("setting session")
    if(localStorage.getItem("artViews") === null || undefined){
      localStorage.setItem("artViews", "");
    }
    if(localStorage.getItem("artLikes") === null || undefined){
      localStorage.setItem("artLikes", "");
    }
    if(localStorage.getItem("artDislikes") === null || undefined){
      localStorage.setItem("artDislikes", "");
    }
    if(localStorage.getItem("commLikes") === null || undefined){
      localStorage.setItem("commLikes", "");
    }
    if(localStorage.getItem("commDislikes") === null || undefined){
      localStorage.setItem("commDislikes", "");
    }
  }
}

</script>

