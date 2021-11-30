<template>
  <q-dialog
    v-model="dialog"
    seamless
    transition-hide="fade"
    transition-show="fade"
  >
    <q-card class="q-dialog-plugin local-card">
      <q-btn class="close" round icon="close" v-close-popup />
      <q-card-section
        class="q-pa-none"
        style="overflow: hidden; border-radius: 0.5rem 0.5rem 0 0"
      >
        <div class="gradient-red text-white">
          <div class="q-pa-md">
            {{ file.name }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="q-pb-xs row justify-center">
        <audio
          v-if="file && file.type === 'audio'"
          class="q-ma-sm"
          controls
          autoplay
          :src="source"
          @ended="fnOnEnded"
        />
        <video
          v-else
          class="q-ma-sm"
          width="360"
          controls
          autoplay
          :src="source"
          @ended="fnOnEnded"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const { state, commit } = useStore()
    const defaultPath = ref('')
    const file = computed(() => state.preview.file)
    const dialog = computed({
      get() {
        return state.preview.dialog
      },
      set(v) {
        return commit('preview/updateDialog', v)
      }
    })

    const source = computed(() => {
      return `${defaultPath.value}/${
        file.value.base
      }/${encodeURIComponent(file.value.name)}`
    })

    const fnOnEnded = () => {
      commit('preview/updateDailog', false)
    }

    onBeforeMount(() => {
      if (process.env.DEV) {
        defaultPath.value = `http://${window.location.hostname}:3000/files`
      } else {
        defaultPath.value = `http://${window.location.hostname}/files`
      }
    })
    return {
      dialog,
      file,
      source,
      fnOnEnded
    }
  }
}
</script>

<style scoped>
.local-card {
  position: absolute;
  width: 380px;
  border-radius: 0.5rem;
  bottom: 1rem;
  right: 1rem;
  overflow: visible;
  box-shadow: 0 0 2rem #999;
}
.close {
  position: absolute;
  font-size: 0.5rem;
  background-color: red;
  color: white;
  top: -0.3rem;
  right: -0.3rem;
  z-index: 999;
  border: 2px solid #eee;
}
</style>
