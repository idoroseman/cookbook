<template>
  <v-app>
    <v-main>
      <v-locale-provider rtl>
        <router-view/>
      </v-locale-provider>
    </v-main>
  </v-app>
</template>

<script setup>
  import { onMounted, onUnmounted, ref , computed, provide  } from 'vue';
  import { onSnapshot, collection } from 'firebase/firestore';
  import { db } from '@/firebase'
  
  const recepies = ref([])
  const loading = ref(true)

  onMounted(() => {
    console.log('snapshot request');
    const recepiesColl = collection(db, 'users', 'pZGq9JUlCdNC2NqfZuIl', 'recepies')
    const close = onSnapshot(recepiesColl, 
    (snapshot) => {
      console.log('snapshot data', snapshot);
      loading.value = false
      recepies.value = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }))
    },
    (error) =>{
      console.log(error);
    })
    onUnmounted(close)
  })

  const keywords = computed(()=>{ return [...new Set(recepies.value.map(x=>x.keywords).flat(1))].sort() })

  provide('loading', loading)
  provide('recepies', recepies)
  provide('keywords', keywords)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap');

@font-face {
    font-family: miri;
    src: url('@/assets/miriwin-webfont.ttf');
}
</style>

