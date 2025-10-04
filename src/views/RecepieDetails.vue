<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="text-center display-2 font-weight-bold mb-3">
         ספר המתכונים של עדו
        </h1>
        <p v-if="loading">טוען נתונים</p>
        <p v-else-if="!recepie">המתכון לא נמצא <v-btn :to="{name: 'home'}">חזרה</v-btn></p>
        <v-card v-else>
          <v-card-title>{{ recepie.name }}</v-card-title>
          <v-card-subtitle>
            <v-chip v-for="item in recepie.keywords" :key="item" variant="flat" color="blue" size="small">{{ item }}</v-chip>
          </v-card-subtitle>
          <v-card-text  class="recepie-text">
            <p>פורסם ב{{ new Date(recepie.datePublished) }} על ידי {{ recepie.author.name }}</p>
            <p v-if="recepie.credit">מקור {{ recepie.credit.href ? "" : recepie.credit.name }}<a :href="recepie.credit.href" target="_blank">{{ recepie.credit.name ? recepie.credit.name :recepie.credit.href }}</a> <br/></p>
            <br/>
            <template v-for="line,n in recepie.description" :key="n">
              <p>{{ line }}</p>
            </template>
            <br/>
            <template v-for="section,n in recepie.recipeIngredients" :key="n">
              <p class="font-weight-bold">{{ section.name }}</p>
              <ul>
                <li v-for="item, i in section.items" :key="i">{{ item.quantity }} {{ item.unit }} {{ item.name }} {{  item.prepare }}</li>
              </ul>
            </template>
            <br/>
            <template v-for="section,n in recepie.recipeInstructions" :key="n">
              <p class="font-weight-bold">{{ section.name }}</p>
              <ol>
                <li v-for="item, i in section.items" :key="i">{{ item.text }} </li>
              </ol>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn size="small" icon="mdi-printer"></v-btn>
            <v-btn size="small" icon="mdi-delete"></v-btn>
            <v-btn size="small" icon="mdi-close-box" :to="{name: 'home'}"></v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { inject, computed } from 'vue';
import { useRoute } from 'vue-router';

const loading = inject('loading')
const recepies = inject('recepies')
const route = useRoute();  
const recepie = computed(() => {return recepies.value.find(x=>x.id==route.params.id)} )
</script>

<style>
h1 {
  font-family: 'Amatic SC', sans-serif;
  font-size: 3em;
}
.recepie-text {
  font-family: 'Open Sans', sans-serif;
}
.v-card-title {
    font-family: miri;
}
</style>