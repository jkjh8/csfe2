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

import Users from '@/components/users/users'

export default {
  components: { Users },
  setup() {
    const { getters, dispatch } = useStore()
    const $q = useQuasar()
    const usersCount = computed(() => getters['users/usersCount'])

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
        await dispatch('users/updateUsers')
      } catch (err) {
        console.error(err)
      }
      $q.loading.hide()
    })

    return {
      usersCount
    }
  }
}
</script>
