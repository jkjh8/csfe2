<template>
  <q-form @submit="onLogin">
    <q-card class="shadow-10" style="width: 25rem">
      <q-card-section class="pa-none gradient-red">
        <div class="q-px-md q-py-xs text-grey-2 name" style="font-size: 1.2rem">
          <span>
            <q-icon name="svguse:icons.svg#user"></q-icon>
          </span>
          <span> 로그인 </span>
        </div>
      </q-card-section>

      <q-card-section v-if="error">
        <div
          class="q-px-md q-py-sm text-white"
          style="background: red; border-radius: 1rem; text-align: center"
        >
          {{ error }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-sm">
          <q-input
            v-model="userInfo.email"
            dense
            filled
            :rules="rules.email"
            label="이메일"
          />
          <q-input
            v-model="userInfo.password"
            dense
            filled
            :rules="rules.password"
            label="패스워드"
            :type="showPassword ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="showPassword ? 'visibility' : 'visibility_off'"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>
          <div class="row justify-end">
            <q-checkbox v-model="saveEmail" left-label label="이메일저장" />
            <q-checkbox
              v-model="userInfo.keepLoggedIn"
              left-label
              label="로그인유지"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions>
        <div class="q-px-md q-pb-sm fit row">
          <q-btn
            class="full-width"
            style="background: #006b82; color: #fff"
            label="로그인"
            type="submit"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import vuecookie from 'vue-cookies'

export default {
  setup() {
    const { commit } = useStore()
    const $q = useQuasar()
    const router = useRouter()

    const error = ref('')
    const userInfo = ref({
      email: '',
      password: '',
      keepLoggedIn: false
    })
    const showPassword = ref(false)
    const saveEmail = ref(false)

    async function onLogin() {
      $q.loading.show()
      error.value = ''
      localStorage.setItem('keepLoggedIn', userInfo.value.keepLoggedIn)
      localStorage.setItem('saveEmail', saveEmail.value)
      if (saveEmail.value) {
        localStorage.setItem('email', userInfo.value.email)
      } else {
        localStorage.renmovedItem('email')
      }

      try {
        const r = await api.post('/api/auth/login', userInfo.value)
        commit('user/updateUser', r.data.user)
        commit('user/updateToken', r.data.token.access)

        $q.loading.hide()
        console.log(r.data)
        // console.log(r)
        // router.push('/')
      } catch (err) {
        if (err.response.data && err.response.data.message) {
          error.value = err.response.data.message
        }
      }
      $q.loading.hide()
    }

    onMounted(() => {
      saveEmail.value = Boolean(localStorage.getItem('saveEmail'))
      userInfo.value.keepLoggedIn = Boolean(
        localStorage.getItem('keepLoggedIn')
      )
      if (saveEmail.value) {
        userInfo.value.email = localStorage.getItem('email')
      }
    })
    return {
      rules: {
        email: [
          (value) => !!value || '이메일을 입력하세요',
          (value) => /.+@.+\..+/.test(value) || '이메일 형식이 아닙니다'
        ],
        password: [
          (value) => !!value || '패스워드를 입력하세요',
          (value) => value.length >= 8 || '최소 8자 이상 입력하세요'
        ]
      },
      error,
      userInfo,
      showPassword,
      saveEmail,
      onLogin
    }
  }
}
</script>
