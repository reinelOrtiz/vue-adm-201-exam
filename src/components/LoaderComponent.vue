<template>
    <div>        
        <Gauge :size="260" v-if="loaderName === 'Gauge'"></Gauge>
        <RotateSquare5 :size="120" v-if="loaderName === 'RotateSquare5'"></RotateSquare5>
        <Circle10 :size="120" v-if="loaderName === 'Circle10'"></Circle10>
    </div>    
</template>
<script>

    import Gauge from 'vue-loading-spinner/src/components/Gauge'; 
    import RotateSquare5 from 'vue-loading-spinner/src/components/RotateSquare5';
    import Circle10 from 'vue-loading-spinner/src/components/Circle10';

    export default {
        name: 'LoaderComponent',
            props: {
                loaderName: {
                    default: "RotateSquare5"
                }
            },
            data: function() {
                return {                    
                }
        },
        components: {            
            'Gauge': Gauge,
            'RotateSquare5': RotateSquare5,
            'Circle10': Circle10
        }
    }
</script>