<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-between items-center">
      <div class="row justify-start items-end q-gutter-sm">
        <q-icon name="svguse:icons.svg#card-fill" size="sm" />
        <span class="name" style="font-size: 1.4rem"
          >시스템 로그</span
        >
        <span class="caption">
          총 {{ systemlog.totalPages }}개의 페이지
          {{ systemlog.totalDocs }}개의 이벤트 로그가 있습니다</span
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
      <SystemLog />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeMount, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import SystemLog from '@/components/systemlog/systemlog'

export default {
  components: { SystemLog },
  setup() {
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()

    const systemlog = computed(() => state.systemlog.log)
    const searchKeyword = ref('')

    async function fnSearch() {
      $q.loading.show()
      try {
        await commit('systemlog/updateSearch', searchKeyword.value)
        await dispatch('systemlog/getSystemlogs')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
    }

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('systemlog/getSystemlogs')
      } catch (err) {
        console.error(err)
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
      systemlog,
      searchKeyword,
      fnSearch
    }
  }
}
</script>
