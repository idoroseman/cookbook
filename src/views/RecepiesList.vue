<template>
  <v-container>
    <nav>
      <router-link :to="{name:'new'}">מתכון חדש</router-link>
    </nav>
    <v-row class="text-center">

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">
         ספר המתכונים של עדו
        </h1>
      </v-col>

      <v-col class="mb-5" cols="12" >
        <v-card
          class="mx-auto"
          color="grey-lighten-3"
          max-width="500"
        >
          <v-card-text>
            <v-text-field
              v-model="searchText"
              :loading="loading"
              density="compact"
              variant="solo"
              label="חיפוש"
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="onClick"
              clearable
              @click:clear="searchText=''"
            ></v-text-field>
            <template v-for="k,i in keywords" :key="i">{{ i ? " | ":"" }}<a href="#" @click="()=>{searchText=k}">{{ k }}</a></template>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col v-if="loading">טוען נתונים</v-col>
      <v-col v-else-if="filteredList.length==0">לא נמצאו מתכונים</v-col>
      <template v-else>
      <v-col
          v-for="recepie in filteredList"
          :key="recepie.id"
          cols="12"  sm="4"
        >
          <v-card :title="recepie.name" color="#c6d6f6" @click="$emit('select', recepie.id)" :to="{ name: 'recepieView', params: { id: recepie.id } }"  link>
            <template v-slot:prepend>
              <v-icon :icon="getIconName(recepie)" color="primary"></v-icon>
            </template>
            <v-card-text>
              <v-chip v-for="item in recepie.keywords" :key="item" variant="flat" color="blue">{{ item }}</v-chip>
            </v-card-text>
          </v-card>
        </v-col>
      </template>
    </v-row>
    <p>מציג {{ filteredList.length }} מתוך {{ recepies.length }} מתכונים</p>
  </v-container>
</template>

<script setup>
  import { computed , ref, inject } from 'vue'

  const loading = inject('loading')
  const recepies = inject('recepies')
  const keywords = inject('keywords')

  const searchText = ref("")

  const filteredList = computed(() => {
    // return inspections.value
    return recepies.value.filter((item) =>
          (item.name.includes(searchText.value))
          ||
          (item.keywords.some(d=>d==searchText.value))
          ||
          (item.recipeIngredients && item.recipeIngredients.some(section=>section.items.some(d=>d.name==searchText.value)))
        )
  })

  const getIconName = (recepie) =>{
    if (recepie.name.includes("לחם"))
      return "mdi-baguette"
    if (recepie.name.includes("פיצה"))
      return "mdi-pizza"    
    if (recepie.name.includes("עוגיות"))
      return "mdi-cookie"    
    if (recepie.name.includes("עוף"))
      return "mdi-food-drumstick"
    if (recepie.name.includes("אורז"))
      return "mdi-rice"
    return "mdi-food-fork-drink"
  }


</script>

<style>
h1 {
  font-family: 'Amatic SC', sans-serif;
  font-size: 3em;
}
.v-card-title {
    font-family: miri;
}
</style>