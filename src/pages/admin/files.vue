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
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import Files from '@/components/files/admin'

export default {
  components: { Files },
  setup() {
    const { dispatch } = useStore()
    const $q = useQuasar()

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('user/login')
      } catch (err) {
        console.error(err)
      }
      $q.loading.hide()
    })

    return {
      //
    }
  }
}
</script>
