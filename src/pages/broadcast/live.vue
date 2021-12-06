<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#mic-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem">
          라이브 방송
        </span>
        <span class="caption">
          총 {{ deviceCount }}개의 방송구간 중 {{ activeCount }}개의
          방송구간이 방송중, {{ deviceError }}개의 방송구간이 점검이
          필요합니다
        </span>
      </div>
    </div>
    <div class="q-mt-md row justify-center">
      <!-- component -->
      <Live />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import Live from '@/components/broadcast/live'

export default {
  components: { Live },
  setup() {
    const { state, getters, dispatch } = useStore()
    const router = useRouter()
    const $q = useQuasar()
    const { notifyError } = notify()

    const user = computed(() => state.user.user)
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])
    const activeCount = computed(() => getters['devices/actives'])

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
      } catch (err) {
        $q.loading.hide()
        notifyError({
          message: '사용자 로그인이 필요합니다',
          caption: '로그인 페이지로 이동해서 로그인후 이용하세요.'
        })
        router.push('/')
      }
      try {
        await dispatch('devices/getDevices')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
    })

    return {
      user,
      deviceCount,
      deviceError,
      activeCount
    }
  }
}
</script>
