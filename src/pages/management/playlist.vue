<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-start items-end q-gutter-sm">
      <q-icon name="svguse:icons.svg#card-fill" size="sm" />
      <span class="name" style="font-size: 1.4rem"
        >플레이 리스트</span
      >
      <span class="caption"
        >플레이 리스트를 생성하거나 삭제 할 수 있습니다</span
      >
    </div>
    <div class="q-mt-md">
      <div class="row justify-evenly">
        <Names class="q-mt-md" />
        <Lists class="q-mt-md" />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useStore } from 'vuex'
import Names from '@/components/playlist/names'
import Lists from '@/components/playlist/lists'

export default {
  components: { Names, Lists },
  setup() {
    const { dispatch } = useStore()
    onMounted(() => {
      dispatch('playlist/updatePlaylist')
    })
    return {
      //
    }
  }
}
</script>
