<template>
  <div id="appForm">
    <form v-on:submit.prevent="formSubmit">
      <div v-for="(form, index) in forms" v-bind:key="form.id">
        <label>Name:</label>
        <input v-model="form.name" id="form-id" type="text" required/>
        <label>Email</label>
        <input v-model="form.email" id="form-email" type="text" required/>
        <button type="button" v-on:click="deleteForm(index)">Delete Form</button>
      </div>
      <div>
        <button type="button" v-on:click="addForm">Add Form</button>
        <button type="submit">Add Dog</button>
      </div>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { bus } from '../main';
import _ from 'lodash';

export default {
  name: 'appForm',
  data() {
    return {
      forms: [
        {
          name: '',
          email: ''
        }
      ]
    }
  },
  methods: {
    formSubmit(){
      axios.post('/dogs/addDogs', this.forms)
        .then( response =>  {
          bus.$emit('addDog', response.data);

          this.forms.length = 1;
          this.forms[0].name = '';
          this.forms[0].email = '';

          document.querySelector('#form-id').focus();
      });
    },
    addForm(){
      this.forms.push({
        name: '',
        email: ''
      });
    },
    deleteForm(index){
      if(this.forms.length > 1){
        this.forms.splice(index, 1);
      }
    }
  },
}
</script>

<style scoped>
#appForm{
  max-width: 500px;
  margin: auto;
  border: solid 1px;
  padding: 10px
}


</style>