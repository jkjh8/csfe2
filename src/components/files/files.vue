<template>
  <q-card>
    <q-card-section> files </q-card-section>
    <q-card-section>{{ files }}</q-card-section>
  </q-card>
</template>

<script>
import { ref, onMounted } from 'vue'
import { api } from '@/boot/axios'

export default {
  setup() {
    const files = ref(null)

    onMounted(async () => {
      const r = await api.post('/api/files/get', { folder: ['media'] })
      files.value = r.data
    })

    return {
      files
    }
  }
}
</script>
