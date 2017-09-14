<template>
    <div class="app">{{pageName}}</div>
</template>

<style scoped>
    .app{   
        background: red
    }
</style>

<script>
export default {    
    data() {   
        return {    
            pageName: 'this is index page'
        }
    }
}
</script>