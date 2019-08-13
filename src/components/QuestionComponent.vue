<template>
    <div class="alert alert-secondary border border-danger rounded">

        <div class="container">
            <div class="row">
                <TimerComponent ref="timerCount"></TimerComponent>
            </div>
        </div>
        
        <form-wizard
            @on-complete="onComplete"
            step-size="xs"
            color="#e67e22"
            title="Salesforce ADM-201 Exam" subtitle=""><hr>

            <tab-content>
              <p>Esta prueba contiene {{numberOfQuestions}} preguntas. Encontrará preguntas de selección múltiple y de única respuesta (no todas estan marcadas por el tipo), 
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
                <div class="text-right" style="color: #e60b0b; font-weight: bold"><label>{{nonSelectedMsj}}</label></div>
                <hr>
            </tab-content>    
        </form-wizard>

        <ScoreExamComponent></ScoreExamComponent>
             
    </div> 
</template>
<script>
    import axios from 'axios'
    import ScoreExamComponent from './ScoreExamComponent'
    import TimerComponent from './TimerComponent'

    export default {
        name: 'QuestionComponent',
        props: ['questionList'],
        data() {
            return{
                attemps: 0,
                bdExamTest: [],
                numberOfQuestions: 0,
                nonSelectedMsj: ''
            }
        },
        components: {
            'ScoreExamComponent': ScoreExamComponent,
            'TimerComponent': TimerComponent
        },
        methods: {
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
                    }while (this.bdExamTest.length < this.numberOfQuestions);
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
                this.show(score, this.numberOfQuestions, this.$refs.timerCount.timeElapsed);

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

