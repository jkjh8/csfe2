<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#device-tablet" size="sm" />
        <span class="name" style="font-size: 1.4rem"
          >방송장비 설정</span
        >
        <span class="caption">
          총 {{ deviceCount }}개의 디바이스 중 {{ deviceError }}개의
          디바이스가 점검이 필요합니다</span
        >
      </div>

      <div class="row justify-start items-center">
        <q-input v-model="searchKeyword" dense filled label="검색">
          <template #append>
            <q-icon class="btn-icon" name="search" />
          </template>
        </q-input>
        <q-btn
          class="q-mx-md"
          round
          flat
          color="green-8"
          icon="svguse:icons.svg#plus-circle-fill"
          @click="fnAdd"
        />
      </div>
    </div>
    <div class="q-mt-md">
      <DeviceTable />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import DeviceTable from '@/components/devices/table'
import Add from '@/components/dialog/devices/add'

export default {
  components: { DeviceTable },
  setup() {
    const { state, getters, commit, dispatch } = useStore()
    const $q = useQuasar()
    const searchKeyword = computed({
      get() {
        return state.devices.search
      },
      set(v) {
        return commit('devices/updateSearch', v)
      }
    })
    const deviceCount = computed(() => getters['devices/deviceCount'])
    const deviceError = computed(() => getters['devices/error'])

    function fnAdd() {
      $q.dialog({
        component: Add
      }).onOk(async () => {
        dispatch('devices/getDevices')
      })
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
      searchKeyword,
      deviceCount,
      deviceError,
      fnAdd
    }
  }
}
</script>

<style scoped>
.btn-icon:hover {
  cursor: pointer;
}
</style>
