<template>
    <div class="alert alert-secondary border border-danger rounded">
        <form-wizard
            @on-complete="onComplete"
            step-size="xs"
            color="#e67e22"
            title="Salesforce ADM-201 Exam" subtitle=""><hr>

            <tab-content>
              Este prueba contiene {{numberOfQuestions}} preguntas.
            </tab-content>

            <tab-content v-for="(question, index) in bdExamTest" :key="index" class="text-left">
                <h5>{{question.text}}</h5><br>
                <div v-for="(answer, index) in question.answers" :key="index">

                    <div v-if="question.single_type" class="custom-control custom-radio">
                        <input type="radio" 
                            :id="'question_' + question.id + '_answer_' + answer.id" 
                            :name="'question_' + question.id"
                            :value="answer.id" v-model="question.answ_selected"
                            class="custom-control-input" required>
                            
                            <label :for="'question_' + question.id + '_answer_' + answer.id" class="custom-control-label">
                                <span v-if="attemps > 0 && answer.is_ok" class="is_ok">&#10003;</span>
                                <span v-if="attemps > 0 && !answer.is_ok" class="is_wrong">&#10008;</span>
                                {{answer.text}}</label>
                    </div>

                    <div v-if="!question.single_type" class="custom-control custom-checkbox">
                        <input type="checkbox" 
                            :id="'question_' + question.id + '_answer_' + answer.id" 
                            :name="'question_' + question.id"
                            :value="!answer.is_selected" v-model="answer.is_selected"
                            class="custom-control-input" required>
                            
                            <label :for="'question_' + question.id + '_answer_' + answer.id" class="custom-control-label">
                                <span v-if="attemps > 0 && answer.is_ok" class="is_ok">&#10003;</span>
                                <span v-if="attemps > 0 && !answer.is_ok" class="is_wrong">&#10008;</span>
                                {{answer.text}}
                            </label>
                    </div>                    
                </div>
                <hr>
            </tab-content>    
        </form-wizard>

        <ScoreExamComponent></ScoreExamComponent>
             
    </div> 
</template>
<script>
    import axios from 'axios'
    import ScoreExamComponent from './ScoreExamComponent'

    export default {
        name: 'QuestionComponent',
        props: ['questionList'],
        data() {
            return{
                attemps: 0,
                bdExamTest: [],
                numberOfQuestions: 0
            }
        },
        components: {
            'ScoreExamComponent': ScoreExamComponent
        },
        methods: {
            getQuestions(numberOfQuestions) {
                console.log("aqui");
                this.numberOfQuestions = numberOfQuestions;                
                let url_bd = './static/adm_201.json';
                axios.get(url_bd).then((response) => {
                    do{                        
                        let question = response.data[Math.floor(Math.random() * response.data.length)];
                        if(!this.bdExamTest.includes(question)){
                            question.answers = this.randomSort(question.answers);
                            this.bdExamTest.push(question);
                        }                
                    }while (this.bdExamTest.length < this.numberOfQuestions);                     
                }, (error) => {
                    console.log(error);
                })
            },
            onComplete () {
                this.attemps++;
                let score = 0;
                this.bdExamTest.forEach(function(question) {

                    if(question.single_type){
                        let answ = question.answers.find(function(a) {
                            return a.id === question.answ_selected;
                        });
                        if(answ.is_ok)
                            score++;
                    } else {
                        let is_ok = true;
                        let answ = question.answers;
                        answ.forEach(function(a) {
                            if(a.is_selected && !a.is_ok){
                                is_ok = false;
                            }
                        });
                        if(is_ok)
                            score++;
                    }
                });               
                //alert('Resultado:' + score +' / '+ this.numberOfQuestions);
                this.show(score, this.numberOfQuestions);

            },
            randomSort(list) {
                return list.sort(function(a, b) {
                    return 0.5 - Math.random()
                });
            },
            show (score, numberOfQuestions) {
                this.$modal.show('ScoreExamComponent', {"score": score, "numberOfQuestions": numberOfQuestions});
            },
            hide () {
                this.$modal.hide('ScoreExamComponent');
            }  
        },
        created() {            
            let numberOfQuestions = `${this.$route.params.numberOfQuestions}`;
            if(numberOfQuestions === 'undefined'){
                alert("Se requiere la cantidad de preguntas a cargar.");
                this.$router.push({name: 'AdmExamInitComponent'});            
            } else {
                this.getQuestions(numberOfQuestions);
            }
        }
    }
</script>
<style>
span.is_ok{
    color: #50ae20;
    font-weight: bold;
    content: "\2713";
}
span.is_wrong{
    color: #e60b0b;
    font-weight: bold;
    content: "\2718";
}
.vue-form-wizard.xs .wizard-icon-circle {
    width: 20px;
    height: 20px;
    font-size: 12px;
}
.vue-form-wizard.xs .wizard-nav-pills > li.active > a .wizard-icon {
    font-size: 12px;
}
.vue-form-wizard.xs .wizard-navigation .wizard-progress-with-circle {
    position: relative;
    top: 15px;
    height: 2px;
}
</style>

