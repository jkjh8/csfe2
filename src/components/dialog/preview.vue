<template>
  <q-dialog
    ref="dialogRef"
    @hide="onDialogHide"
    seamless
    transition-hide="fade"
    transition-show="fade"
  >
    <q-card class="q-dialog-plugin local-card">
      <q-btn
        class="close"
        round
        icon="close"
        @click="onCancelClick"
      />
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
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    item: Object,
    message: String,
    file: Object,
    user: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const defaultPath = ref('')
    const source = computed(() => {
      return encodeURIComponent(
        `${defaultPath.value}/${props.file.base}/${props.file.name}`
      )
    })

    const fnOnEnded = () => {
      onDialogOK()
    }

    onBeforeMount(() => {
      console.log(props.file)
      if (process.env.DEV) {
        defaultPath.value = `http://${window.location.hostname}:3000/files`
      } else {
        defaultPath.value = `http://${window.location.hostname}/files`
      }
    })
    return {
      source,
      fnOnEnded,
      dialogRef,
      onDialogHide,

      onOKClick(item) {
        onDialogOK(item)
      },

      onCancelClick: onDialogCancel
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
