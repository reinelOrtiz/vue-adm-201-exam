<template>
    <modal name="ScoreExamComponent" @before-open="beforeOpen">
        <h3>{{score}}</h3>
        <h3>{{numberOfQuestions}}</h3>
    </modal>
</template>
<script>    
    export default {
        name: 'ScoreExamComponent',
        data() {
            return{
                score: 0,
                numberOfQuestions: 0
            }
        },
        methods: {
            beforeOpen(event) {
                this.score = event.params.score;
                this.numberOfQuestions = event.params.numberOfQuestions;
            }                          
        },
        created() {            
        }
    }
</script>
<style>
</style>

