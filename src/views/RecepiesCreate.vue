
import { onMounted } from 'vue';

import { onMounted } from 'vue';

<template>
  <v-container>
    <v-row>
      <v-col class="mb-4">
        <h1 class="text-center display-2 font-weight-bold mb-3">
         ספר המתכונים של עדו
        </h1>
        <p v-if="loading">טוען נתונים</p>
        <p v-else>{{  }}</p>
        <form @submit.prevent="submit">
            <v-row>
                <v-col cols="12" sm="12">
                    <v-text-field
                        v-model="name"
                        label="שם"
                        ></v-text-field>
                </v-col>
            
                <v-col cols="12" sm="5">
                    <v-text-field
                        v-model="credit"
                        label= "מקור"
                        ></v-text-field>
                </v-col>

                <v-col cols="6" sm="4">
                    <v-autocomplete
                        chips
                        v-model="keywords"
                        label="קטגוריות"
                        :items="keywordsValues"
                        multiple
                    ></v-autocomplete>
                </v-col>

                <v-col cols="6" sm="3">
                    <v-text-field
                        v-model="recipeYield"
                        label= "כמות"
                        ></v-text-field>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea v-model="notes" label="הערות" rows="2"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea v-model="ingredients" label="רכיבים"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-textarea v-model="instructions" label="הוראות"></v-textarea>
                </v-col>

                <v-col cols="12" sm="12">
                    <v-btn
                    class="me-4"
                    type="submit"
                    @click="decodeRecepie"
                    >
                    הוספה
                    </v-btn>

                    <v-btn @click="$router.push({ name: 'home' })">
                    ביטול
                    </v-btn>
                </v-col>
            </v-row>
            <pre style="text-align: left;"> {{  debug }}</pre>
        </form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import {ref, inject, computed} from 'vue'
import { db } from '@/firebase'
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'vue-router'

const router = useRouter();  

const name = ref('')
const credit = ref('')
const keywords = ref([])
const recipeYield = ref('')
const notes = ref('')
const ingredients = ref('')
const instructions = ref('')
const debug = ref(null)

const loading = inject('loading')
const recepies = inject('recepies')
const keywordsValues = inject('keywords')

const unitValues = computed(()=>{ 
    // i'm sure i can map-reduce it, but i'm lazy
    var items = []
    recepies.value.map(r=>r.recipeIngredients).forEach(sections=>{
        if (sections)
            sections.forEach(section=>{
                items.push(section.items.map(i=>i.unit))
            })
    })
    return [...new Set(items.flat(1))]
})

const materialValues = computed(()=>{ 
    // i'm sure i can map-reduce it, but i'm lazy
    var items = []
    recepies.value.map(r=>r.recipeIngredients).forEach(sections=>{
        if (sections)
            sections.forEach(section=>{
                items.push(section.items.map(i=>i.name))
            })
    })
    return [...new Set(items.flat(1))]
})

const decodeRecepie = () => {
    const rv = {}
    rv.author = { 'name': 'עדו' }
    rv.datePublished = new Date()
    rv.lang = 'he'
    rv.name = name.value
    rv.credit = credit.value.startsWith("http") ? { 'href': credit.value } : { 'name': credit.value }
    rv.recipeYield = recipeYield.value
    rv.keywords = keywords.value
    rv.description = notes.value.split('\n')
    rv.recipeIngredients = []
    rv.recipeInstructions = []

    // ingredients
    const sec = { name:"מצרכים", items:[]}

    ingredients.value.split('\n').forEach(line=>{
        // notes
        var nts = ''
        const x = line.match(/\(.*\)/)
        if (x){
            line = line.replace(x[0], '')
            nts = x[0].substring(1, x[0].length-1)
        }

        const p = line.indexOf(',')
        if (p>=0) {
            nts += line.substring(p)
            line = line.substring(0, p)
        }

        const words = line.split(/\s+/)
        var token = words.shift()

        // quantity
        var qty = ''
        token = token.replace("½","1/2").replace("¼","1/4").replace("¾","3/4")
        const y = token.match(/^\d*(\.|\/)?\d*$/) // is numeric ?
        if ((y) || (token == "-") || (token =="מעט") || (token =="חופן") || (token == "קצת") || (token == "חצי") || (token == "רבע")) {
            qty += token + ' '
            token = words.shift()
        }
        qty = qty.trim()

        // units
        var unt = null
        if (unitValues.value.includes(token)) {
            unt = token
            token = words.shift()
        }

        // material
        var mtrl = null
        words.unshift(token)
        token = ''
        while ((mtrl === null) && (words.length > 0)) {
            token += words.shift() + ' '
            if (materialValues.value.includes(token.trim()))
              mtrl = token
        }

        if (mtrl === null){
            mtrl = token // new material
            console.log('new material', mtrl);
        }
        else {
            nts += words.join(' ')
            console.log('found material', mtrl);
        }

        sec.items.push({ quantity:qty, unit:unt, name:mtrl.trim(), prepare:nts })
    })
    if (sec.items.length)
       rv.recipeIngredients.push(sec)

    rv.recipeInstructions = [{ name:'הכנה', items:instructions.value.split('\n').filter(x=>x!='').map(x=>({ text:x }))}]

    const recepiesColl = collection(db, 'users', 'pZGq9JUlCdNC2NqfZuIl', 'recepies')
    addDoc(recepiesColl, rv)
    .then(docRef => {
        console.log("Document has been added successfully", docRef);
        router.push({ name: 'recepieView', params: { id: docRef.id }})
    })
    .catch(error => {
            console.log(error);
    })
}
</script>

<style lang="scss" scoped>
</style>