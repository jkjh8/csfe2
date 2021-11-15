<template>
  <q-form @submit="onRegister">
    <q-card class="shadow-10" style="width: 25rem">
      <q-card-section class="pa-none gradient-red">
        <div class="q-px-md q-py-xs text-grey-2 name" style="font-size: 1.2rem">
          <span>
            <q-icon name="svguse:icons.svg#user"></q-icon>
          </span>
          <span> 회원가입 </span>
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
            v-model="userInfo.userName"
            dense
            filled
            :rules="rules.name"
            label="이름"
          />

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

          <q-input
            v-model="userInfo.checkPassword"
            dense
            filled
            :rules="rules.checkPassword"
            label="패스워드 확인"
            :type="showCheckPassword ? 'text' : 'password'"
          >
            <template #append>
              <q-icon
                :name="showCheckPassword ? 'visibility' : 'visibility_off'"
                @click="showCheckPassword = !showCheckPassword"
              />
            </template>
          </q-input>

          <q-btn
            class="full-width"
            :style="`background: ${userInfo.color}; color: ${textColor}`"
            label="색상선택"
            @click="fnSelectColor"
          ></q-btn>
        </div>
      </q-card-section>

      <q-card-actions>
        <div class="q-px-md q-pb-sm fit row">
          <q-btn
            class="full-width"
            style="background: #006b82; color: #fff"
            label="가입하기"
            type="submit"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-form>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import pickColor from '@/api/pickColor'

import colorPicker from '@/components/dialog/colorPicker'

export default {
  setup() {
    const { commit } = useStore()
    const $q = useQuasar()
    const router = useRouter()

    const error = ref('')
    const userInfo = ref({
      userName: '',
      email: '',
      color: '#4ED6BE',
      password: '',
      checkPassword: ''
    })
    const showPassword = ref(false)
    const showCheckPassword = ref(false)
    const saveEmail = ref(false)
    const textColor = computed(() => {
      return pickColor(userInfo.value.color)
    })

    function fnSelectColor() {
      $q.dialog({
        component: colorPicker,
        componentProps: {
          color: userInfo.value.color
        }
      }).onOk((rt) => {
        userInfo.value.color = rt
      })
    }

    async function onRegister() {
      $q.loading.show()
      error.value = ''
      try {
        const r = await api.post('/api/auth/register', userInfo.value)
        commit('user/updateUser', r.data.user)
        $q.loading.hide()
        // console.log(r)
        router.push('/')
      } catch (err) {
        if (err.response.data && err.response.data.message) {
          error.value = err.response.data.message
        }
      }
      $q.loading.hide()
    }

    return {
      rules: {
        name: [(value) => !!value || '이름을 입력하세요'],
        email: [
          (value) => !!value || '이메일을 입력하세요',
          (value) => /.+@.+\..+/.test(value) || '이메일 형식이 아닙니다'
        ],
        password: [
          (value) => !!value || '패스워드를 입력하세요',
          (value) => value.length >= 8 || '최소 8자 이상 입력하세요'
        ],
        checkPassword: [
          (value) =>
            value === userInfo.value.password || '패스워드가 일치 하지 않습니다'
        ]
      },
      error,
      textColor,
      userInfo,
      showPassword,
      showCheckPassword,
      fnSelectColor,
      onRegister
    }
  }
}
</script>
