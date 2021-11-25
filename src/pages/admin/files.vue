<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-start items-end q-gutter-sm">
      <q-icon name="svguse:icons.svg#card-fill" size="sm" />
      <span class="name" style="font-size: 1.4rem">파일관리</span>
      <span class="caption"
        >파일을 업로드하거나 삭제할 수 있습니다</span
      >
    </div>
    <div class="q-mt-md">
      <Files />
    </div>
  </div>
</template>

<script>
import { onMounted, onBeforeMount, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import Files from '@/components/files/admin'

export default {
  components: { Files },
  setup() {
    const { dispatch } = useStore()
    const router = useRouter()
    const user = computed(() => state.user.user)
    const $q = useQuasar()
    const { notifyError } = notify()

    onBeforeMount(async () => {
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
      $q.loading.hide()
    })

    return {
      //
    }
  }
}
</script>
