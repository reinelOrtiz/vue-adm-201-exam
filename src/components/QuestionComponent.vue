<template>
    <div>

        <LoaderComponent class="center-loader" v-if="loadingWizard" :loaderName="'Circle10'"></LoaderComponent>

        <div class="alert alert-info border border-info rounded" v-if="!loadingWizard">

            <div class="container">
                <div class="row">
                    <TimerComponent ref="timerCount"></TimerComponent>
                </div>
            </div>
            
            <form-wizard
                @on-complete="onComplete"
                step-size="xs"
                color="#0c5460a6"
                title="Salesforce ADM-201 Exam" subtitle=".">
                <hr>

                <tab-content v-if="!loadingWizard">
                <p>En esta prueba encontrará preguntas de selección múltiple y de única respuesta (no todas estan marcadas por el tipo), 
                    tendrá que seleccionar la mejor opción u opciones según corresponda de acuerdo a la pregunta. Al finalizar se mostrará el resumen de la prueba y podrá navegar
                    a través de las preguntas para verificar sus respuestas.</p>
                    <p>Nota: Para reiniciar la prueba presione <span style="font-weight: bold">F5</span> en esta página, será redireccionado a la página inicial para seleccionar la cantidad de preguntas.
                        Tenga en cuenta que si lo realiza durante el transcurso de una prueba, su proceso se perderá y tendrá que inciar nuevamente.</p>
                    <h4>good luck!</h4>
                </tab-content>

                <tab-content v-for="(question, index) in bdExamTest" :key="index" class="text-left"
                    :before-change="() => validateStep(question)">

                    <h5>{{question.text}}</h5><span v-if="question.obs !== ''">{{question.obs}}<br></span><br>
                    <div v-for="(answer, index) in question.answers" :key="index">

                        <div v-if="question.single_type" class="custom-control custom-radio">
                            <input type="radio" 
                                :id="'question_' + question.id + '_answer_' + answer.id" 
                                :name="'question_' + question.id"
                                :value="answer.id" v-model="question.answ_selected"
                                class="custom-control-input">
                                
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
                                class="custom-control-input">
                                
                                <label :for="'question_' + question.id + '_answer_' + answer.id" class="custom-control-label">
                                    <span v-if="attemps > 0 && answer.is_ok" class="is_ok">&#10003;</span>
                                    <span v-if="attemps > 0 && !answer.is_ok" class="is_wrong">&#10008;</span>
                                    {{answer.text}}
                                </label>
                        </div>                    
                    </div>
                    <div class="text-right" style="color: #8b0000; font-style: italic;"><label>{{nonSelectedMsj}}</label></div>
                    <hr>
                </tab-content>    
            </form-wizard>

            <ScoreExamComponent></ScoreExamComponent>
            
        </div>
             
    </div> 
</template>
<script>
    import axios from 'axios'
    import ScoreExamComponent from './ScoreExamComponent'
    import TimerComponent from './TimerComponent'
    import LoaderComponent from './LoaderComponent'
    
    export default {
        name: 'QuestionComponent',
        props: ['questionList'],
        data() {
            return{
                attemps: 0,
                bdExamTest: [],
                numberOfQuestions: 0,
                nonSelectedMsj: '',
                loadingWizard: false,
                loadingWizard: true
            }
        },
        components: {
            'ScoreExamComponent': ScoreExamComponent,
            'TimerComponent': TimerComponent,
            'LoaderComponent': LoaderComponent
        },
        methods: {
            setLoading: function(value) {
                this.loadingWizard = value
            },
            getQuestions(numberOfQuestions) {                
                this.numberOfQuestions = numberOfQuestions;                
                let url_bd = './static/adm_201.json';
                axios.get(url_bd).then((response) => {
                    do{                        
                        let question = response.data[Math.floor(Math.random() * response.data.length)];
                        if(!this.bdExamTest.includes(question)){
                            question.answers = this.randomSort(question.answers);                            
                            this.bdExamTest.push(question);
                        }                        
                    }while (this.bdExamTest.length < this.numberOfQuestions); // 
                    //this.bdExamTest.forEach((q) => console.log(q.id));
                }, (error) => {
                    console.log(error);
                })
            },
            onComplete () {
                this.attemps++;                
                let score = 0;
                this.$refs.timerCount.pause();
                this.bdExamTest.forEach(function(question) {

                    if(question.single_type){
                        let answ = question.answers.find(function(a) {
                            return a.id === question.answ_selected;
                        });
                        if(answ.is_ok){
                            question.is_ok = true;
                            score++;
                        }
                    } else {
                        let is_ok = true;
                        let answ = question.answers;
                        answ.forEach(function(a) {
                            if(a.is_ok && !a.is_selected || !a.is_ok && a.is_selected){
                                is_ok = false;
                            }
                        });
                        if(is_ok){
                            question.is_ok = is_ok;
                            score++;
                        }
                    }
                });               
                //alert('Resultado:' + score +' / '+ this.numberOfQuestions);
                this.show(score, this.numberOfQuestions, this.$refs.timerCount.timeElapsed);
                this.markQuestion();

            },
            randomSort(list) {
                return list.sort(function(a, b) {
                    return 0.5 - Math.random()
                });
            },
            show (score, numberOfQuestions, timeElapsed) {
                this.$modal.show('ScoreExamComponent', {
                    "score": score, 
                    "numberOfQuestions": numberOfQuestions,
                    "timeElapsed": timeElapsed});
            },
            hide () {
                this.$modal.hide('ScoreExamComponent');
            },
            markQuestion () {

                let markList = document.querySelectorAll('.wizard-nav li');
                
                for (let index = 0; index < markList.length-1; index++) {                    
                    if(!this.bdExamTest[index].is_ok){
                        let myDiv = markList[index+1].getElementsByTagName("div").item(0);
                        myDiv.innerHTML= "X";
                        myDiv.style.color = "rgb(139, 0, 0)";              
                        myDiv.style.borderColor = "rgb(139, 0, 0)";
                    }
                }
            },
            validateStep(qu) {
                this.nonSelectedMsj = "";
                let nextStep = 0;
                if(qu.single_type){
                    nextStep = qu.answ_selected;
                } else {
                    qu.answers.forEach(function(a) {
                        if(a.is_selected){
                            nextStep++;
                        }                       
                    });
                }
                if(nextStep > 0) {
                    this.nonSelectedMsj = "";
                    return true;
                } else {
                    this.nonSelectedMsj = "Seleccione una respuesta...";
                    return false;
                }                
            }
        },
        created() {            
            let numberOfQuestions = `${this.$route.params.numberOfQuestions}`;
            this.nonSelectedMsj = "";
            if(numberOfQuestions === 'undefined'){
                alert("Se requiere la cantidad de preguntas a cargar; será redireccionado a la página de incio.");
                this.$router.push({name: 'AdmExamInitComponent'});            
            } else {
                this.getQuestions(numberOfQuestions);
            }
            setTimeout(() => this.loadingWizard= false, 2500);
        }
    }
</script>
<style>
.center-loader{
    margin-top: 250px;
}
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
    width: 20px !important;
    height: 20px !important;
    font-size: 12px !important;
}
.vue-form-wizard.xs .wizard-nav-pills > li.active > a .wizard-icon {
    font-size: 12px !important;
}
.vue-form-wizard.xs .wizard-navigation .wizard-progress-with-circle {
    position: relative !important;
    top: 15px!important;
    height: 2px !important;
}

span.error{
  color:#e74c3c;
  font-size:20px;
  display:flex;
  justify-content:center;
}
/* This is a css loader. It's not related to vue-form-wizard */
.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(255, 255, 255, 0.2);
  border-right: 1.1em solid rgba(255, 255, 255, 0.2);
  border-bottom: 1.1em solid rgba(255, 255, 255, 0.2);
  border-left: 1.1em solid #e74c3c;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>

