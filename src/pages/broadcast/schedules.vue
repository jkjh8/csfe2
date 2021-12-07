<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#calendar-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem"> 예약방송 </span>
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
          :icon="
            viewMode === 'list'
              ? 'svguse:icons.svg#calendar-fill'
              : 'svguse:icons.svg#view-list'
          "
          :color="viewMode === 'list' ? 'info' : 'accent'"
          @click="$store.dispatch('schedules/changeView')"
        >
          <q-tooltip
            style="background: rgb(5, 5, 5, 0.5)"
            :offset="[10, 10]"
            anchor="top middle"
            self="center middle"
          >
            {{ viewMode === 'list' ? '리스트보기' : '달력보기' }}
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div class="q-mt-md">
      <!-- component -->
      <Table v-if="viewMode === 'list'" />
      <Calendar v-else />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Table from '@/components/broadcast/scheduleTable'
import Calendar from '@/components/broadcast/scheduleCalendar'

export default {
  components: { Table, Calendar },
  setup() {
    const { state, getters, dispatch } = useStore()
    const $q = useQuasar()

    const user = computed(() => state.user.user)
    const viewMode = computed(() => state.schedules.viewMode)
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])
    const activeCount = computed(() => getters['devices/actives'])

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
      viewMode,
      deviceCount,
      deviceError,
      activeCount
    }
  }
}
</script>
