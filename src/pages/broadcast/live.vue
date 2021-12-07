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
    <div class="q-mt-xl row justify-center">
      <!-- component -->
      <Live />
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Live from '@/components/broadcast/live'

export default {
  components: { Live },
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
}
</script>
