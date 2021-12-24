<template>
  <div style="margin: 5% 10% 0 10%">
    <div class="row justify-start items-end q-gutter-sm">
      <q-icon name="svguse:icons.svg#card-fill" size="sm" />
      <span class="name" style="font-size: 1.4rem">서버관리</span>
      <span class="caption">서버 상태 확인 및 관리</span>
    </div>
    <div class="q-mt-md">
      <Status />
    </div>
  </div>
</template>

<script>
import Status from '@/components/status/status'

export default {
  components: { Status },
  setup() {
    return {
      //
    }
  }
}
</script>
