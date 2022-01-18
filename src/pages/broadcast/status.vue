<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-end">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#clipboard-list" size="sm" />
        <span class="name" style="font-size: 1.4rem"> 방송상태 </span>
        <span class="caption">
          총 {{ deviceCount }}개의 방송구간 중 {{ activeCount }}개의
          방송구간이 방송중, {{ deviceError }}개의 방송구간이 점검이
          필요합니다
        </span>
      </div>

      <div>
        <q-btn
          round
          flat
          icon="svguse:icons.svg#ban"
          color="red-10"
          size="sm"
          @click="fnCancelAll"
        >
          <q-tooltip> 전체방송취소 </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="q-mt-md">
      <!-- component -->
      <Status />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import notify from '@/api/notify'

import Status from '@/components/broadcast/status'

export default {
  components: { Status },
  setup() {
    const { state, getters, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const user = computed(() => state.user.user)
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])
    const activeCount = computed(() => getters['devices/actives'])

    const fnCancelAll = async () => {
      try {
        const r = await api.get('/api/broadcast/cancelAll')
        console.log(r)
      } catch (e) {
        notifyError({
          message: '전체 방송 취소를 실행할 수 없습니다',
          caption: '관리자에게 문의하세요'
        })
      }
    }

    onMounted(async () => {
      $q.loading.show()
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
      activeCount,
      fnCancelAll
    }
  }
}
</script>
