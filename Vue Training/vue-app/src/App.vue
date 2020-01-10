<template>
  <div id="app">
    <app-form></app-form>
    <app-list></app-list>
  </div>
</template>

<script>
import appForm from './components/Form.vue';
import appList from './components/List.vue';

export default {
  name: 'app',
  components: {
    'app-form': appForm,
    'app-list': appList
  }
}
</script>

<style scoped>


</style>
