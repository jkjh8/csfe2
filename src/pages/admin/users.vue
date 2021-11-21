<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-start items-end q-gutter-sm">
      <q-icon name="svguse:icons.svg#user-group-fill" size="sm" />
      <span class="name" style="font-size: 1.4rem">사용자관리</span>
      <span class="caption"
        >총 {{ usersCount }}명의 사용자가 있습니다</span
      >
    </div>
    <div class="q-mt-md">
      <Users />
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

import Users from '@/components/users/users'

export default {
  components: { Users },
  setup() {
    const { getters, dispatch } = useStore()
    const router = useRouter()
    const $q = useQuasar()
    const usersCount = computed(() => getters['users/usersCount'])

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
        await dispatch('users/updateUsers')
      } catch (err) {
        $q.loading.hide()
        $q.notify({
          icon: 'svguse:icons.svg#exclamation',
          message: '사용자가 권한이 없습니다.',
          caption: '접근을 하려면 관리자 권한이 필요합니다.',
          color: 'red',
          position: 'center'
        })
        router.push('/')
      }
      $q.loading.hide()
    })

    return {
      usersCount
    }
  }
}
</script>
