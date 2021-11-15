<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="q-pa-none">
        <div style="width: 100%">
          <q-color
            v-model="rfColor"
            flat
            style="width: 100%; min-width: 400px"
            class="my-picker"
          />
        </div>
      </q-card-section>
      <q-card-actions class="bg-black" align="right">
        <q-btn label="취소" rounded flat color="white" @click="onCancelClick" />
        <q-btn
          color="primary"
          rounded
          unelevated
          label="확인"
          @click="onOKClick(rfColor)"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    color: String
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const rfColor = ref(null)

    onMounted(() => {
      if (props.color) {
        rfColor.value = props.color
      }
    })
    return {
      rfColor,
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
