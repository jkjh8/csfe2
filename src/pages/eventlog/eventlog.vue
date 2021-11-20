<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-start items-end q-gutter-sm">
      <q-icon name="svguse:icons.svg#card-fill" size="sm" />
      <span class="name" style="font-size: 1.4rem">이벤트 로그</span>
      <span class="caption">
        총 {{ eventlog.totalPages }}개의 페이지
        {{ eventlog.totalDocs }}개의 이벤트 로그가 있습니다</span
      >
    </div>
    <div class="q-mt-md">
      <EventLog />
    </div>
  </div>
</template>

<script>
import { onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import EventLog from '@/components/eventlog/eventlog'

export default {
  components: { EventLog },
  setup() {
    const { state, dispatch } = useStore()
    const $q = useQuasar()
    const eventlog = computed(() => state.eventlog.eventlog)

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
        await dispatch('eventlog/getEventlogs')
      } catch (err) {
        console.error(err)
      }
      $q.loading.hide()
    })

    return {
      eventlog
    }
  }
}
</script>
