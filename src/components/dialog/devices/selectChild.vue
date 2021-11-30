<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dailog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div>
            <q-avatar size="md">
              <q-icon
                name="svguse:icons.svg#check-circle"
                color="green"
                size="1.5rem"
              />
            </q-avatar>
            <div class="name" style="font-size: 1.2rem">
              방송구간선택
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
export default {
  props: {
    //
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK()
      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>
