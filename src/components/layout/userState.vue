<template>
  <div v-if="user">
    <button>
      <q-avatar
        :style="`background: ${user.color}; color: ${textColor}`"
        size="md"
        >{{ nickName }}</q-avatar
      >

      <q-menu
        class="shadow-15"
        style="width: 18rem; border-radius: 1rem"
        :offset="[50, 10]"
      >
        <q-list class="column justify-center items-center q-pa-md">
          <q-item>
            <q-item-section>
              <q-avatar
                :style="`background: ${user.color}; color: ${textColor}`"
                size="8rem"
              >
                <div>
                  {{ nickName }}
                </div>

                <q-badge
                  v-if="user.admin"
                  class="q-pa-sm"
                  label="관리자"
                  color="orange"
                  floating
                  transparent
                >
                </q-badge>
              </q-avatar>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="column items-center">
              <q-item-label class="name" style="font-size: 1.2rem">{{
                user.userName
              }}</q-item-label>
              <q-item-label>{{ user.email }}</q-item-label>
            </q-item-section>
          </q-item>

          <q-item class="q-my-md">
            <q-item-section>
              <q-btn
                style="width: 10rem; border-radius: 2rem"
                label="사용자정보"
                to="/user"
              />
            </q-item-section>
          </q-item>

          <q-separator class="full-width" />

          <q-item class="q-mt-md">
            <q-item-section>
              <q-btn
                color="red-8"
                style="width: 10rem; border-radius: 2rem"
                label="로그아웃"
                @click="logout"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </q-menu>
    </button>
  </div>
  <div v-else>
    <router-link class="link" to="/login">로그인</router-link>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { api } from '@/boot/axios'
import pickColor from '@/api/pickColor'

export default {
  setup() {
    const { state, commit } = useStore()
    const router = useRouter()

    const user = computed(() => state.user.user)
    const nickName = computed(() => {
      if (user.value && user.value.userName) {
        return user.value.userName.charAt(0)
      } else {
        return ''
      }
    })
    const textColor = computed(() => {
      if (user.value && user.value.color) {
        return pickColor(user.value.color)
      } else {
        return '#111'
      }
    })

    async function logout() {
      await api.get('api/auth/logout')
      commit('user/updateUser', null)
      router.push('/')
    }

    return {
      user,
      nickName,
      textColor,
      logout
    }
  }
}
</script>

<style scoped>
button {
  text-decoration: none;
  border: none;
  background: transparent;
}
.link {
  text-decoration: none;
  color: #111;
  background: transparent;
}
</style>
