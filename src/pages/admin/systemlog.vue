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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import SystemLog from '@/components/systemlog/table'

export default {
  components: { SystemLog },
  setup() {
    const { state, commit, dispatch } = useStore()
    const router = useRouter()
    const $q = useQuasar()
    const { notifyError } = notify()

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
        await dispatch('user/login')
        if (!user.value.admin) {
          notifyError({
            message: '관리자 권한이 필요합니다',
            caption: '접근을 위해서 관리자 권한이 필요합니다.'
          })
          router.push('/')
        }
      } catch (err) {
        $q.loading.hide()
        notifyError({
          message: '사용자 로그인이 필요합니다',
          caption: '로그인 페이지로 이동해서 로그인후 이용하세요.'
        })
        router.push('/')
      }
      try {
        await dispatch('systemlog/getSystemlogs')
      } catch (err) {
        console.error(err)
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
