<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-sm">
          <q-avatar size="2.5rem">
            <q-icon
              name="svguse:icons.svg#file"
              color="blue"
              size="1.5rem"
            />
          </q-avatar>
          <div>
            <div class="name" style="font-size: 1rem">파일선택</div>
            <div class="caption" style="font-size: 0.5rem">
              업로드 할 파일을 선택하세요
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div class="q-mt-md">
            <q-file
              color="cyan"
              dense
              filled
              v-model="file"
              label="파일선택"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            style="width: 5rem"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="negative"
            style="width: 5rem"
            label="확인"
            unelevated
            rounded
            @click="onOKClick()"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    //
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const file = ref(null)
    async function onOKClick() {
      onDialogOK(file.value)
    }
    return {
      file,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
