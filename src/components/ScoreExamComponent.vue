<template>
    <modal name="ScoreExamComponent" @before-open="beforeOpen" @opened="showLoader">

        <div class="card text-center" v-if="!loadingWizard">
            <!--img class="card-img-top" src="" alt="Card image cap">-->
            <div class="card-body">
                <h5 class="card-title">Resultado {{score}} / {{numberOfQuestions}}</h5>
                <h1 class="card-text">{{ (score*100)/numberOfQuestions | percent}} %</h1>
                <h6 class="card-text">{{timeElapsed}}</h6>
            </div>
        </div>
        <LoaderComponent class="center-loader" v-if="loadingWizard" :loaderName="'Gauge'"></LoaderComponent>
    </modal>
</template>
<script>

    import LoaderComponent from './LoaderComponent'

    var numeral = require("numeral");

    export default {
        name: 'ScoreExamComponent',

        components: {
            'LoaderComponent': LoaderComponent
        },
        data() {
            return{
                score: 0,
                numberOfQuestions: 0,
                timeElapsed: 0,
                loadingWizard: true
            }
        },
        methods: {
            beforeOpen(event) {
                this.loadingWizard= true;
                this.score = event.params.score;
                this.numberOfQuestions = event.params.numberOfQuestions;
                this.timeElapsed = event.params.timeElapsed;
            },
            showLoader() {
                setTimeout(() => this.loadingWizard= false, 2500);
            }                       
        },
        filters: {
            percent(val) {
                return numeral(val).format("0.0");;
            }
        }
    }
</script>
<style scoped>
.center-loader{
    margin: 80px 0px 0px 10px;
}
</style>