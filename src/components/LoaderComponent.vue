<template>
    <div>        
        <Gauge :size="260" v-if="loaderName === 'Gauge'"></Gauge>
        <RotateSquare5 :size="120" v-if="loaderName === 'RotateSquare5'"></RotateSquare5>
        <Origami :size="120" v-if="loaderName === 'Origami'"></Origami>
    </div>    
</template>
<script>

    import Gauge from 'vue-loading-spinner/src/components/Gauge'; 
    import RotateSquare5 from 'vue-loading-spinner/src/components/RotateSquare5';
    import Origami from 'vue-loading-spinner/src/components/Origami';

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
            'Origami': Origami
        }
    }
</script>