<template>
  <v-container class="fill-height d-flex align-items-center justify-content-center">
    <v-card max-width="500" class="mx-auto pa-6">
      <v-card-title class="text-center mb-6">
        <h1 class="display-2 font-weight-bold">ספר המתכונים של עדו</h1>
      </v-card-title>

      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
            v-model="email"
            label="דוא״ל"
            type="email"
            required
            :error="!!error"
            class="mb-4"
          ></v-text-field>

          <v-text-field
            v-model="password"
            label="סיסמה"
            type="password"
            required
            :error="!!error"
            class="mb-4"
          ></v-text-field>

          <v-alert v-if="error" type="error" class="mb-4">{{ error }}</v-alert>

          <div class="d-flex gap-2">
            <v-btn
              :loading="loading"
              type="button"
              variant="outlined"
              @click="toggleMode"
              class="flex-grow-1"
            >
              {{ isLogin ? 'צור חשבון' : 'התחברות' }}
            </v-btn>

            <v-btn
              :loading="loading"
              type="submit"
              color="primary"
              class="flex-grow-1"
            >
              {{ isLogin ? 'התחבר' : 'הרשם' }}
            </v-btn>
          </div>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')
const isLogin = ref(true)

const toggleMode = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  error.value = ''
  loading.value = true

  try {
    if (isLogin.value) {
      await signInWithEmailAndPassword(auth, email.value, password.value)
      console.log('User signed in')
    } else {
      await createUserWithEmailAndPassword(auth, email.value, password.value)
      console.log('User created')
    }
    router.push({ name: 'home' })
  } catch (err) {
    error.value = getErrorMessage(err.code)
  } finally {
    loading.value = false
  }
}

const getErrorMessage = (code) => {
  const messages = {
    'auth/invalid-email': 'דוא״ל לא תקין',
    'auth/user-disabled': 'חשבון זה מבוטל',
    'auth/user-not-found': 'משתמש לא נמצא',
    'auth/wrong-password': 'סיסמה שגויה',
    'auth/email-already-in-use': 'דוא״ל זה כבר בשימוש',
    'auth/weak-password': 'סיסמה חלשה מדי',
  }
  return messages[code] || 'שגיאה בהתחברות, נסה שוב'
}
</script>

<style scoped>
.fill-height {
  height: 100vh;
}
</style>
