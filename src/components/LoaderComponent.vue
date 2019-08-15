<template>
    <div>        
        <Gauge :size="260"></Gauge>
    </div>    
</template>
<script>

    import Gauge from 'vue-loading-spinner/src/components/Gauge';    

    export default {
        name: 'LoaderComponent',
            data: function() {
                return {                    
                }
        },
        components: {            
            'Gauge': Gauge
        }
    }
</script>