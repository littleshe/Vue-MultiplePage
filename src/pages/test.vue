<template>
  <div class="username">
    {{username}}
  </div>
</template>

<script>
export default {
  name: 'app',
  data (){  
      return {  
          username: 'foo-bar'
      }
  }
}
</script>

<style>
    .username{  
        color:red 
    }
</style>
