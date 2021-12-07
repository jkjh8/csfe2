<template>
  <q-page>
    <div v-if="user" style="margin: 5% 10% 0 10%">
      <div class="row justify-between items-center">
        <div class="row justify-start items-end q-gutter-sm">
          <q-icon name="svguse:icons.svg#clipboard-list" size="sm" />
          <span class="name" style="font-size: 1.4rem">
            방송상태
          </span>
          <span class="caption">
            총 {{ deviceCount }}개의 방송구간 중 {{ activeCount }}개의
            방송구간이 방송중, {{ deviceError }}개의 방송구간이 점검이
            필요합니다
          </span>
        </div>
      </div>
      <div class="q-mt-md">
        <!-- component -->
        <Status />
      </div>
    </div>

    <div v-else class="row justify-center" style="margin: 10% auto">
      <NeedLogin />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import NeedLogin from '@/components/widgets/needLogin'
import Status from '@/components/broadcast/status'

export default defineComponent({
  name: 'PageIndex',
  components: { NeedLogin, Status },
  setup() {
    const { state, getters } = useStore()

    const user = computed(() => state.user.user)
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])
    const activeCount = computed(() => getters['devices/actives'])

    return {
      user,
      deviceCount,
      deviceError,
      activeCount
    }
  }
})
</script>
