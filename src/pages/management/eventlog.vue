<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#card-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem"
          >이벤트 로그</span
        >
        <span class="caption">
          총 {{ eventlog.totalPages }}개의 페이지
          {{ eventlog.totalDocs }}개의 이벤트 로그가 있습니다</span
        >
      </div>

      <div>
        <q-input
          v-model="searchKeyword"
          dense
          filled
          label="검색"
          @keyup.enter="fnSearch"
        >
          <template #append>
            <q-icon
              class="btn-icon"
              name="search"
              @click="fnSearch"
            />
          </template>
        </q-input>
      </div>
    </div>
    <div class="q-mt-md">
      <EventLog />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import EventLog from '@/components/eventlog/table'

export default {
  components: { EventLog },
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
        await dispatch('eventlog/getEventlogs')
      } catch (err) {
        console.error(err)
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
