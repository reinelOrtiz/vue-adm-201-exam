<template>
    <div>        
        <h5><span id="time" v-html="time"></span></h5>
    </div>    
</template>
<script>
    export default {
        name: 'TimerComponent',
            data: function() {
                return {
                    state: "started",
                    startTime: Date.now(),
                    currentTime: Date.now(),
                    timeElapsed: '',
                    interval: null
                }
        },
        mounted: function() {
            this.interval = setInterval(this.updateCurrentTime, 1000);
        },
        destroyed: function() {
            clearInterval(this.interval)
        },
        computed: {
            time: function() {
                this.timeElapsed = this.hours + ':' + this.minutes + ':' + this.seconds;
                return this.timeElapsed;
            },
            milliseconds: function() {
                return this.currentTime - this.$data.startTime;
            },
            hours: function() {
                var lapsed = this.milliseconds;
                var hrs = Math.floor((lapsed / 1000 / 60 / 60));
                return hrs >= 10 ? hrs : '0' + hrs;
            },
            minutes: function() {
                var lapsed = this.milliseconds;
                var min = Math.floor((lapsed / 1000 / 60) % 60);
                return min >= 10 ? min : '0' + min;
            },
            seconds: function() {
                var lapsed = this.milliseconds;
                var sec = Math.ceil((lapsed / 1000) % 60);
                return sec >= 10 ? sec : '0' + sec;
            }
        },
        methods: {
            reset: function() {
                this.$data.state = "started";
                this.$data.startTime = Date.now();
                this.$data.currentTime = Date.now();
            },
            pause: function() {                              
                this.$data.state = "paused";
                //this.$emit('emitPauseTimer', this.$data);
            },
            resume: function() {
                this.$data.state = "started";
            },
            updateCurrentTime: function() {
                if (this.$data.state == "started") {
                    this.currentTime = Date.now();
                }
            }        
        }
    }
</script>