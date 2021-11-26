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
    </div>
    <dl class="q-mt-md q-gutter-xl row wrap justify-center">
      <dt>
        <Masters />
      </dt>
      <dt>
        <Slaves />
      </dt>
    </dl>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Masters from '@/components/devices/masters'
import Slaves from '@/components/devices/slaves'

export default {
  components: { Masters, Slaves },
  setup() {
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()
    const eventlog = computed(() => state.eventlog.eventlog)
    const searchKeyword = ref('')

    async function fnSearch() {
      $q.loading.show()
      try {
        commit('eventlog/updateSearch', searchKeyword.value)
        dispatch('eventlog/getEventlogs')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
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

    onBeforeMount(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
      } catch (err) {
        $q.loading.hide()
        $q.notify({
          icon: 'svguse:icons.svg#exclamation',
          message: '사용자 로그인이 필요합니다',
          caption: '로그인 페이지로 이동해서 로그인후 이용하세요.',
          color: 'red',
          position: 'center'
        })
        router.push('/')
      }
      $q.loading.hide()
    })

    return {
      searchKeyword,
      eventlog,
      fnSearch
    }
  }
}
</script>

<style scoped>
.btn-icon:hover {
  cursor: pointer;
}
</style>
