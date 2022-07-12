<template>
  <b-container fluid>
    <Navbar/>

    <b-container v-if="article" align="center">
      <b-row>
        <b-col style="margin-top: 10px">
          <h1>{{article.title}}</h1>
        </b-col>
      </b-row>

      <b-row>
        <b-col style="margin-top: 10px">
          <p>Story by: {{ article.creator}}</p>
        </b-col>
      </b-row>

      <b-row>
        <b-col style="margin-top: 10px">
          <p>Category : {{ article.category}}</p>
        </b-col>
      </b-row>

      <b-row>
        <b-col style="margin-top: 10px">
          <p>{{this.article.content}}</p>
        </b-col>
      </b-row>

      <b-row>
        <b-col style="margin-top: 10px">
          <span v-for="tag in tags" :key="tag">
           <b-link :to="{name : 'ArticlesByTag', params : { word : tag}}">
              #{{tag}}
            </b-link>
          </span>
        </b-col>
      </b-row>

      <b-row>
        <b-col align="left">
          <span>On: {{article.date}}</span>
        </b-col>
        <b-col align="right">
          <span>Likes: {{article.likes}} </span>
          <span>Dislikes: {{article.dislikes}}</span>
        </b-col>
      </b-row>

      <b-row>
        <b-col align="left">
          <span>Views : {{article.visits}}</span>
        </b-col>
        <b-col align="right">
          <b-button  @click="likeArticle(article.id)"> Like </b-button>
          <b-button  @click="dislikeArticle(article.id)"> Dislike </b-button>
        </b-col>
      </b-row>

      <b-row>
        <b-col>
          <b-button @click="showCommentForm"> Leave a new comment </b-button>
        </b-col>
      </b-row>


      <b-row v-if="toggleForm">
        <b-col>
          <b-form @submit="postComment">

          <template v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
            </ul>
          </template>

          <b-form-group
              id="input-group-1"
              label="Author:"
              label-for="input-1"
          >
            <b-form-input
                id="input-1"
                v-model="newAuthor"
                type="text"
                placeholder="Enter your name here..."
                required
            ></b-form-input>
          </b-form-group>

          <b-form-group
              id="input-group-2"
              label="Comment:"
              label-for="input-2"
          >
            <b-form-textarea
                id="input-2"
                v-model="newComment"
                type="text"
                placeholder="Write your comment here..."
                rows="4"
                required
            ></b-form-textarea>
          </b-form-group>
            <b-button type="submit" variant="primary">Submit</b-button>
          </b-form>

        </b-col>
      </b-row>
    </b-container>

    <b-container>
      <h1 v-if="comments.length"> Comments :</h1>
      <h1 v-else>No comments yet</h1>

      <b-pagination v-if="totalRows"
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="center"
      ></b-pagination>

      <div v-for="(comment, index) in comments" v-bind:key="comment.id">
        <b-card>
          <b-card-text>
            <div>{{comment.text}}</div>
          </b-card-text>
          <b-card-sub-title>
            <b-container>
              <b-row>
                <b-col align="left">
                  <span>By: {{comment.author}}  </span>
                </b-col>
                <b-col align="right">
                  <span>Likes: {{comment.likes}} </span>
                  <span>Dislikes: {{comment.dislikes}}</span>
                </b-col>
              </b-row>
              <b-row>
                <b-col align="left">
                  <span>On: {{comment.timestamp}}  </span>
                </b-col>
                <b-col align="right">
                  <b-button size="sm" class="mr-1" @click="likeComment(index, comment.id)">Like</b-button>
                  <b-button size="sm" @click="dislikeComment(index ,comment.id)">Dislike</b-button>
                </b-col>
              </b-row>
            </b-container>
          </b-card-sub-title>
        </b-card>

        <br>
      </div>


    </b-container>

  </b-container>
</template>

<script>
import Navbar from "@/components/Navbar"

export default {
  name: "Article",
  components: {
    Navbar
  },

  data() {
    return {
      ready : false,

      article: {},
      comments: [],
      tags: [],
      currentPage: 1,
      perPage: 10,
      totalRows: 0,

      toggleForm: false,
      newAuthor: '',
      newComment : '',
      errors: [],


      visitNum : 0
    }
  },

  watch:{
    currentPage: function(page){
      this.$axios.get(`/api/articles/${this.$route.params.id}/comments/page/${page}`).then((response) => {
        this.comments = response.data;
      })
    }
  },
  async created() {
    let path1 = '/api/articles/' + this.$route.params.id;
    let path2 = '/api/articles/' + this.$route.params.id + '/comments/page/' + this.currentPage;
    let path3 = '/api/articles/' + this.$route.params.id + '/comments/count';
    let path4 = '/api/session/visit/article/' + this.$route.params.id;

    //prvo provera posete, pa onda getuje artikl,da bi se broj poseta updejtovao pre getovanja
    if (!localStorage.getItem("artViews").includes(this.$route.params.id.toString())) {
      const resp = await this.$axios.post(path4, {
        artViews : localStorage.getItem("artViews")
      });
      if (resp.status === 200) {
        localStorage.setItem("artViews", localStorage.getItem("artViews") + this.$route.params.id + ",")
      }
    }

    const promise1 = this.$axios.get(path1);
    const promise2 = this.$axios.get(path2)
    const promise3 = this.$axios.get(path3);

    Promise.all([promise1, promise2, promise3])
        .then(results => {
          this.article = results[0].data;
          this.tags = results[0].data.tags;
          this.comments = results[1].data;
          this.totalRows = results[2].data;
        })
        .catch(error => {
          console.log(error)
        });
  },

  methods: {
    showCommentForm: function () {
      this.newComment = '';
      this.newAuthor = '';
      this.toggleForm = !this.toggleForm;
    },

    postComment: async function (e) {
      e.preventDefault();
      try{
        const resp = await this.$axios.post(`/api/articles/${this.$route.params.id}/comments`, {
          author: this.newAuthor,
          text: this.newComment
        });
        if(resp.status === 200){
          this.totalRows += 1
          //ako nije na prvoj stranici, prebaciti na prvu i ovo triggeruje watch da dobijem najnoviji komentar na vrhu
          if (this.currentPage !== 1) {
            this.currentPage = 1;
          } else {
            //ako je na prvoj watch ne moze da se triggeruje stavljanjem currentPage na 1 jer je vec na 1, zato samo dohvatim prvu stranicu ponovo
            this.getCommentPage(1);
          }
        }
      } catch (error) {
        this.errors.push(error.response.data);
      }

      this.newComment = '';
      this.newAuthor = '';
    },

    getCommentPage : function (page) {
      this.$axios.get(`/api/articles/${this.$route.params.id}/comments/page/${page}`).then((response) => {
        this.comments = response.data;
      })
    },

    likeArticle : function(id) {
      const artLikes = localStorage.getItem("artLikes");
      const artDislikes = localStorage.getItem("artDislikes");
      this.$axios.post(`/api/session/like/article/${id}`, {
        artLikes : artLikes,
        artDislikes : artDislikes
      }).then((response) => {
        if(response.status === 200){
          console.log(response.data);
          //vec lajkovan, ponovo kad se klikne treba da se skine lajk
          if(artLikes.includes(id)){
            localStorage.setItem("artLikes", artLikes.replace(id.toString() + ",", ""));
            this.article.likes --;
          } else {
            //inace lajkuje
            localStorage.setItem("artLikes", artLikes + id + ",");
            this.article.likes ++;
          }
          //ako je vec bio dislajkovan
          if(artDislikes.includes(id)){
            localStorage.setItem("artDislikes", artDislikes.replace(id.toString() + ",", ""));
            this.article.dislikes --;
          }
        }
      }).catch((error) => {
        alert(error.response.data.message);
      })
    },
    dislikeArticle : function(id){
      const artLikes = localStorage.getItem("artLikes");
      const artDislikes = localStorage.getItem("artDislikes");
      this.$axios.post(`/api/session/dislike/article/${id}`, {
        artLikes : artLikes,
        artDislikes : artDislikes
      }).then((response) => {
        if(response.status === 200){
          console.log(response.data);
          if(artDislikes.includes(id)){
            localStorage.setItem("artDislikes", artDislikes.replace(id.toString() + ",", ""));
            this.article.dislikes --;
          } else {
            localStorage.setItem("artDislikes", artDislikes + id + ",");
            this.article.dislikes ++;
          }
          if(artLikes.includes(id)){
            localStorage.setItem("artLikes", artLikes.replace(id.toString() + ",", ""));
            this.article.likes --;
          }
        }
      }).catch((error) => {
        alert(error.response.data.message);
      })
    },

    likeComment : function (index, id) {
      const commLikes = localStorage.getItem("commLikes");
      const commDislikes = localStorage.getItem("commDislikes");
      this.$axios.post(`/api/session/like/comment/${id}`, {
        commLikes : commLikes,
        commDislikes : commDislikes
      }).then((response) => {
        if(response.status === 200){
          console.log(response.data);
          if(commLikes.includes(id)){
            localStorage.setItem("commLikes", commLikes.replace(id.toString() + ",", ""));
            this.comments[index].likes --;
          } else {
            localStorage.setItem("commLikes", commLikes + id + ",");
            this.comments[index].likes ++;
          }
          //ako je vec bio dislajkovan
          if(commDislikes.includes(id)){
            localStorage.setItem("commDislikes", commDislikes.replace(id.toString() + ",", ""));
            this.comments[index].dislikes --;
          }
        }
      }).catch((error) => {
        alert(error.response.data.message);
      })

    },

    dislikeComment : function (index, id) {
      const commLikes = localStorage.getItem("commLikes");
      const commDislikes = localStorage.getItem("commDislikes");
      this.$axios.post(`/api/session/dislike/comment/${id}`, {
        commLikes : commLikes,
        commDislikes : commDislikes
      }).then((response) => {
        if(response.status === 200){
          console.log(response.data);
          if(commDislikes.includes(id)){
            localStorage.setItem("commDislikes", commDislikes.replace(id.toString() + ",", ""));
            this.comments[index].dislikes --;
          } else {
            localStorage.setItem("commDislikes", commDislikes + id + ",");
            this.comments[index].dislikes ++;
          }
          //ako je vec bio lajkovan
          if(commLikes.includes(id)){
            localStorage.setItem("commLikes", commLikes.replace(id.toString() + ",", ""));
            this.comments[index].likes --;
          }
        }
      }).catch((error) => {
        alert(error.response.data.message);
      })
    },

    storageContains : function(name, id){
      if(localStorage.getItem(name).includes(id)) {
        return true;
      }
      return false;
    }
  }
}
</script>

<style scoped>

</style>