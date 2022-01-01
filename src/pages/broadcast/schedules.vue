<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row no-wrap justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#calendar-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem"> 예약방송 </span>
        <span class="caption">
          총 {{ deviceCount }}개의 방송구간 중 {{ activeCount }}개의
          방송구간이 방송중, {{ deviceError }}개의 방송구간이 점검이
          필요합니다
        </span>
      </div>

      <div class="q-gutter-x-sm row no-wrap items-center">
        <q-input v-model="search" dense filled label="검색">
          <template #append> <q-icon name="search" /> </template>
        </q-input>
        <q-btn
          round
          flat
          icon="svguse:icons.svg#plus-circle"
          color="primary"
          size="sm"
          @click="fnAdd()"
        >
          <q-tooltip
            style="background: rgb(50, 50, 50, 0.6)"
            anchor="top middle"
            self="center middle"
          >
            스케줄추가
          </q-tooltip>
        </q-btn>
        <q-btn
          round
          flat
          size="sm"
          :icon="
            viewMode === 'list'
              ? 'svguse:icons.svg#calendar-fill'
              : 'svguse:icons.svg#view-list'
          "
          :color="viewMode === 'list' ? 'info' : 'accent'"
          @click="$store.dispatch('schedules/changeView')"
        >
          <q-tooltip
            style="background: rgb(50, 50, 50, 0.6)"
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
import { api } from '@/boot/axios'
import notify from '@/api/notify'

import Table from '@/components/broadcast/scheduleTable'
import Calendar from '@/components/broadcast/scheduleCalendar'
import addSchedule from '@/components/dialog/broadcast/addSchedule'

export default {
  components: { Table, Calendar },
  setup() {
    const { state, getters, commit, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const user = computed(() => state.user.user)
    const viewMode = computed(() => state.schedules.viewMode)
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])
    const activeCount = computed(() => getters['devices/actives'])

    const search = computed({
      get() {
        return state.schedules.search
      },
      set(v) {
        return commit('schedules/updateSearch', v)
      }
    })

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('devices/getDevices')
        await dispatch('schedules/updateSchedules')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
    })

    const fnAdd = (item) => {
      $q.dialog({
        component: addSchedule,
        componentProps: { schedule: item }
      }).onOk(async (rt) => {
        try {
          await dispatch('schedules/updateSchedules')
        } catch (e) {
          console.error(e)
        }
      })
    }

    return {
      user,
      viewMode,
      search,
      fnAdd,
      deviceCount,
      deviceError,
      activeCount
    }
  }
}
</script>
