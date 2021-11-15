<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    />
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api } from '@/boot/axios'

export default defineComponent({
  name: 'PageIndex',
  setup() {
    const { dispatch } = useStore()
    onMounted(async () => {
      await dispatch('user/login')
    })
  }
})
</script>
