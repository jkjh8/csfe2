<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#card-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem"
          >방송 구간 설정</span
        >
        <span class="caption">
          총 {{ eventlog.totalPages }}개의 페이지
          {{ eventlog.totalDocs }}개의 이벤트 로그가 있습니다
        </span>
      </div>
      <div>
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
    <div class="row justify-evenly">
      <Parents class="q-mt-md" />
      <Childrens class="q-mt-md" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Add from '@/components/dialog/devices/add'
import Parents from '@/components/devices/parents'
import Childrens from '@/components/devices/childrens'

export default {
  components: { Parents, Childrens },
  setup() {
    const { state, dispatch } = useStore()
    const $q = useQuasar()
    const eventlog = computed(() => state.eventlog.eventlog)
    const searchKeyword = ref('')

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
      eventlog,
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
