<template>
  <q-card class="shadow-15" style="width: 25rem; border-radius: 1rem">
    <q-card-section class="pa-none gradient-red">
      <div
        class="q-px-md q-py-xs text-grey-2 name"
        style="font-size: 1.2rem"
      >
        <span>
          <q-icon name="svguse:icons.svg#user"></q-icon>
        </span>
        <span> 사용자 정보 </span>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="q-mx-sm">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>사용자이름</q-item-label>
              <q-item-label caption>{{ user.userName }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>이메일</q-item-label>
              <q-item-label caption>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>로그인횟수</q-item-label>
              <q-item-label caption>{{
                user.numberOfLogin
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>마지막로그인</q-item-label>
              <q-item-label caption>{{
                fnDateFormat(user.loginAt)
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>가입일</q-item-label>
              <q-item-label caption>{{
                fnDateFormat(user.createdAt)
              }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section avatar>
              <q-avatar
                :style="`background: ${user.color}`"
                size="md"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>사용자색상</q-item-label>
              <q-item-label caption>{{ user.color }}</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                flat
                icon="svguse:icons.svg#pencil-fill"
                size="md"
                @click="fnColorPicker"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>비밀번호 변경</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                flat
                icon="svguse:icons.svg#arrow-circle-right"
                color="purple"
                @click="fnChangePassword"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label>회원탈퇴</q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                flat
                icon="svguse:icons.svg#arrow-circle-right"
                color="red-10"
                @click="fnDeleteUser"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import moment from 'moment'
import { api } from '@/boot/axios'

import colorPicker from '@/components/dialog/colorPicker'
import deleteUser from '@/components/dialog/delete'
import changePassword from '@/components/dialog/users/changePassword'

export default {
  setup() {
    const { state, commit, dispatch } = useStore()
    const router = useRouter()
    const $q = useQuasar()
    const user = computed(() => state.user.user)

    function fnColorPicker() {
      $q.dialog({
        component: colorPicker,
        componentProps: {
          color: user.value.color
        }
      }).onOk(async (rt) => {
        $q.loading.show()
        try {
          await api.post('/api/users/color', {
            email: user.value.email,
            color: rt
          })
          await dispatch('user/login')
        } catch (err) {
          console.error(err.response)
        }
        $q.loading.hide()
      })
    }

    function fnDateFormat(date) {
      return moment(date).format('YYYY-MM-DD HH:mm:ss')
    }

    async function fnDeleteUser() {
      try {
        $q.dialog({
          component: deleteUser,
          componentProps: {
            user: user.value
          }
        }).onOk(async () => {
          $q.loading.show()
          await api.get(`/api/users/delete?id=${user.value._id}`)
          $q.loading.hide()
          commit('user/updateUser', null)
          router.push('/')
        })
      } catch (err) {
        console.error(err.reponse)
      }
      $q.loading.hide()
    }

    function fnChangePassword() {
      $q.dialog({
        component: changePassword,
        componentProps: { user: user.value }
      })
    }

    return {
      user,
      fnColorPicker,
      fnDateFormat,
      fnDeleteUser,
      fnChangePassword
    }
  }
}
</script>
