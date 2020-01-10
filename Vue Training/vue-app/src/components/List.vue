<template>
  <div id="appList">
    <table>
      <thead>
        <th>Name</th>
        <th>Email</th>
        <th>Delete</th>
      </thead>
      <tbody>
        <tr v-for="dog in dogs" v-bind:key="dog.id" v-bind:class="{selectedRow: dog.isSelected}" v-on:click="selectRow(dog)">
          <td>
            <div v-show="(dog.id === dog.eventId) || !dog.eventNameKey" v-on:dblclick="toggleName(dog); toggleEvent($event);">{{ dog.name }}</div>
            <input v-show="(dog.id !== dog.eventId) && dog.eventNameKey" type="text" v-bind:value="dog.name" v-on:blur="updateDogName(dog, $event)"/>
          </td>
          <td>
            <div v-show="(dog.id === dog.eventId) || !dog.eventEmailKey" v-on:dblclick="toggleEmail(dog); toggleEvent($event);">{{ dog.email }}</div>
            <input v-show="(dog.id !== dog.eventId) && dog.eventEmailKey" type="text" v-bind:value="dog.email" v-on:blur="updateDogEmail(dog, $event)"/>
          </td>
          <td>
            <button v-on:click="deleteDog(dog.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <table v-show="selectedDogs.length > 1 && dogs.length > 1">
      <tbody>
        <tr>
          <td>
            <button v-on:click="deleteDogs">Batch delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';
import _ from 'lodash';
import { bus } from '../main';

export default {
  name: 'appList',
  data(){
    return {
      toggleClickTrigger: 0,
      toggleInputTrigger: 0,
      dogs: [],
      selectedDogs: []
    }
  },
  methods: {
    deleteDog(id){
      axios.delete(`/dogs/deleteDog/${id}`).then( response =>  {
        console.log(response.data);
        this.dogs = _.remove(this.dogs, dog => {
          return dog.id !== id;
        });
      });
    },
    deleteDogs(){
      axios.delete(`/dogs/deleteDogs`, {
        data: this.selectedDogs
      }).then( response =>  {
        var dgs = this.dogs;
        var selDgs = this.selectedDogs

        for(var i = 0; i < dgs.length; i++){
          for(var j = 0; j < selDgs.length; j++){
            if(this.dogs[i].id === this.selectedDogs[j]){
              console.log(this.dogs[i].id);
              console.log(this.selectedDogs[j]);
              this.dogs.splice(i, 1);
            }
          }
        }
      });
    },
    updateDogName(dog, e){
      axios.put(`/dogs/updateDog/${dog.id}`, {
        name: e.target.value,
        email: dog.email
      }).then( response =>  {
        var data = response.data;

        _.map(this.dogs, (d) => {
          if(d.id === data.id){
            d.name = data.name;
            d.eventNameKey = !d.eventNameKey;
          }
        });
      });
    },
    updateDogEmail(dog, e){
      axios.put(`/dogs/updateDog/${dog.id}`, {
        name: dog.name,
        email: e.target.value
      }).then( response =>  {
        var data = response.data;

        _.map(this.dogs, (d) => {
          if(d.id === data.id){
            d.email = data.email;
            d.eventEmailKey = !d.eventEmailKey;
          }
        });
      });
    },
    toggleName(dog){
      dog.eventId = 0;
      dog.eventNameKey = !dog.eventNameKey;
    },
    toggleEmail(dog){
      dog.eventId = 0;
      dog.eventEmailKey = !dog.eventEmailKey;
    },
    toggleEvent(e){
      setTimeout( () => {
        e.target.nextSibling.focus();
      }, 1);
    },
    selectRow(dog){
      if(!dog.isSelected){
        dog.isSelected = !dog.isSelected;
        this.selectedDogs.push(dog.id);
      } else if(dog.isSelected){
        dog.isSelected = !dog.isSelected;

        this.selectedDogs = _.remove(this.selectedDogs, doggy => {
          return doggy.id !== dog.id;
        });
      }
    }
  },
  computed: {
    
  },
  created(){
    bus.$on('addDog', (data) => {
      this.dogs = this.dogs.concat(data);
    });

    axios.get('/dogs/getDogs').then( response =>  {
      var data = response.data;

      _.map(data, (d) => {
        d.eventId = d.id;
        d.eventNameKey = false;
        d.eventEmailKey = false;
        d.isSelected = false;
      });

      this.dogs = data;
    });
  }
}
</script>

<style scoped>

#appList{
  max-width: 500px;
  margin: auto;
  border: solid 1px;
  padding: 10px
}

table{
  width: 100%
}

table thead th, table tbody tr td{
  text-align: center;
}

table tbody tr td{
  padding: 5px;
}

table tbody tr td div{
  margin: 10px;
}

table tbody tr:hover{
  background-color: lightblue;
}

.selectedRow{
  background-color: lightblue;
}


</style>