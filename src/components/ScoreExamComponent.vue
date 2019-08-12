<template>
    <modal name="ScoreExamComponent" @before-open="beforeOpen">
        <div class="card text-center">
            <!--img class="card-img-top" src="" alt="Card image cap">-->
            <div class="card-body">
                <h5 class="card-title">Resultado {{score}} / {{numberOfQuestions}}</h5>
                <h1 class="card-text">{{(score*100)/numberOfQuestions}} %</h1>
                <h6 class="card-text">{{timeElapsed}}</h6>
            </div>
        </div>
    </modal>
</template>
<script>
    export default {
        name: 'ScoreExamComponent',
        data() {
            return{
                score: 0,
                numberOfQuestions: 0,
                timeElapsed: 0
            }
        },
        methods: {
            beforeOpen(event) {
                this.score = event.params.score;
                this.numberOfQuestions = event.params.numberOfQuestions;
                this.timeElapsed = event.params.timeElapsed;
            }                          
        }
    }
</script>