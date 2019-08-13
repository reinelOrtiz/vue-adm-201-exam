<template>
  <div class="alert alert-dismissible alert-primary">    
    <form @submit.prevent="loadExam">
      <h4>Salesforce ADM-201 Exam</h4>
      <hr>
      <div class="form-group">        
        <label for="questionsNumber">Número de preguntas</label>
        <select id="questionsNumber" class="form-control" v-model="numberOfQuestions" required>
          <option>25</option>
          <option>50</option>
          <option>75</option>
          <option>100</option>
        </select>
        <br>
        <button type="submit" class="btn btn-primary">Cargar!</button>
      </div>
    </form>    
  </div>
</template>

<script>  
  import QuestionComponent from './QuestionComponent'
  export default {
    name: 'AdmExamInitComponent',
    components: {
      'QuestionComponent': QuestionComponent
    },
    data () {
      return {
        numberOfQuestions: 0
      }
    },
    methods: {
      loadExam() {
        this.$router.push({
          name: 'QuestionComponent',
          params: {numberOfQuestions: this.numberOfQuestions}
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
