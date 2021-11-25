<template>
  <div
    class="
      fullscreen
      bg-primary
      text-white text-center
      q-pa-md
      flex flex-center
    "
  >
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">
        앗. 페이지를 찾을 수 없습니다...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        to="/"
        label="홈으로"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Error404'
})
</script>
