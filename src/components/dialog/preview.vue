<template>
  <q-dialog
    v-model="dialog"
    seamless
    transition-hide="fade"
    transition-show="fade"
  >
    <q-card
      :class="changeSize ? 'local-card' : ''"
      :style="changeSize ? '' : 'width: 660px; max-width: 800px;'"
    >
      <q-btn
        v-if="changeSize"
        class="close"
        round
        icon="close"
        v-close-popup
      />
      <q-card-section
        class="q-pa-none"
        style="overflow: hidden; border-radius: 0.2rem 0.2rem 0 0"
      >
        <div
          class="gradient-red text-white row justify-between items-center q-px-sm"
        >
          <div
            class="q-pa-md cursor-pointer"
            @click="changeSize = !changeSize"
          >
            {{ file.name }}
          </div>
          <div>
            <q-btn
              v-if="!changeSize"
              round
              flat
              size="sm"
              icon="photo_size_select_small"
              @click="changeSize = !changeSize"
            />
            <q-btn
              v-if="!changeSize"
              round
              flat
              size="sm"
              icon="close"
              v-close-popup
            />
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
          :width="changeSize ? '360' : '640'"
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
    const changeSize = ref(true)
    const defaultPath = ref(
      `http://${window.location.hostname}:3000/files`
    )
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
      return `${defaultPath.value}/${encodeURIComponent(
        file.value.stream
      )}`
    })

    const fnOnEnded = () => {
      commit('preview/updateDialog', false)
    }

    onBeforeMount(() => {
      // if (process.env.DEV) {
      //   defaultPath.value = `http://${window.location.hostname}:3000/files`
      // } else {
      //   defaultPath.value = `http://${window.location.hostname}/files`
      // }
    })
    return {
      changeSize,
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
