<template>
  <div class="row items-center">
    <div style="margin: 5% auto">
      <UserInfo />
      <div style="text-align: center; margin-top: 4rem">
        <router-link to="/">홈으로</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

import UserInfo from '@/components/users/userInfo'
export default {
  components: { UserInfo },
  setup() {
    const { dispatch } = useStore()
    const router = useRouter()
    const $q = useQuasar()

    onBeforeMount(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
      } catch (err) {
        $q.loading.hide()
        $q.notify({
          icon: 'svguse:icons.svg#exclamation',
          message: '사용자 로그인이 필요합니다',
          caption: '로그인 페이지로 이동해서 로그인후 이용하세요.',
          color: 'red',
          position: 'center'
        })
        router.push('/')
      }
      $q.loading.hide()
    })
  }
}
</script>
