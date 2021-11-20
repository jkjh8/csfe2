<template>
  <q-page>
    <div class="row justify-center" style="margin: 10% auto">
      <NeedLogin />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'
import NeedLogin from '@/components/widgets/needLogin'
import { api } from '@/boot/axios'

export default defineComponent({
  name: 'PageIndex',
  components: { NeedLogin },
  setup() {
    const { dispatch } = useStore()
    onMounted(async () => {
      await dispatch('user/login')
    })
  }
})
</script>
