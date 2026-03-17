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
  import { ref , computed, provide, onUnmounted  } from 'vue';
  import { onSnapshot, collection, doc, getDoc } from 'firebase/firestore';
  import { onAuthStateChanged } from 'firebase/auth';
  import { db, auth } from '@/firebase'
  import { useRouter } from 'vue-router'
  
  const router = useRouter()
  const recepies = ref([])
  const loading = ref(true)
  const currentUser = ref(null)
  const userMetaData = ref(null)

  const reload = () => {
    loading.value = true
    onAuthStateChanged(auth, (user) => {
      currentUser.value = user
      if (user) {
        console.log('User logged in:', user.uid);
        if (user.uid == "EjrNn2sqQJgdoPsppRbu0719uaf1")
          user.uid = "pZGq9JUlCdNC2NqfZuIl"
        const userDoc = doc(db, 'users', user.uid)
        getDoc(userDoc).then((docSnap) => {
          if (docSnap.exists()) {
            userMetaData.value = docSnap.data()
          } else {
            console.log('No such document!');
          }
        }).catch((error) => {
          console.log('Error getting document:', error);
        });
        const recepiesColl = collection(db, 'users', user.uid, 'recepies')
        const close = onSnapshot(recepiesColl, 
        (snapshot) => {
          console.log('snapshot data', snapshot);
          loading.value = false
          recepies.value = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }))
        },
        (error) =>{
          console.log(error);
        })
        onUnmounted(() => {
          close()
        })
      } else {
        console.log('No user logged in');
        loading.value = false
        recepies.value = []
        // Only push to login if not already on recepie/<id> route
        const currentRoute = router.currentRoute.value;
        console.log('Current route:', currentRoute.name);
        if (currentRoute.name !== 'recepieView') {
          router.push({ name: 'login' })
        }
      }
    })
  }

  reload()

  const keywords = computed(()=>{ return [...new Set(recepies.value.map(x=>x.keywords).flat(1))].sort() })

  provide('loading', loading)
  provide('recepies', recepies)
  provide('keywords', keywords)
  provide('currentUser', currentUser)
  provide('reload', reload)
  provide('userMetaData', userMetaData)
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Amatic+SC&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500&display=swap');

@font-face {
    font-family: miri;
    src: url('@/assets/miriwin-webfont.ttf');
}
</style>

