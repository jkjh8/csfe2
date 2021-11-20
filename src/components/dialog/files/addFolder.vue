<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-1">
        <div class="row items-center q-gutter-sm">
          <q-avatar size="md">
            <q-icon
              name="svguse:icons.svg#folder-fill"
              color="yellow"
              size="1.5rem"
            />
          </q-avatar>
          <div style="font-size: 1.2rem">폴더 추가</div>
        </div>
      </q-card-section>

      <q-card-section v-if="error" class="q-px-lg">
        <div
          class="text-white text-center bg-red q-py-sm"
          style="border-radius: 1rem"
        >
          {{ error }}
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div class="q-mt-md">
            <q-input
              v-model="name"
              color="cyan"
              dense
              filled
              label="폴더 이름"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn label="취소" rounded unelevated @click="onCancelClick" />
          <q-btn
            color="negative"
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
import { api } from '@/boot/axios'
import { useDialogPluginComponent, useQuasar } from 'quasar'

export default {
  props: {
    folders: Array
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const $q = useQuasar()

    const error = ref('')
    const name = ref('')

    async function onOKClick() {
      $q.loading.show()
      try {
        const r = await api.post('/api/files/createFolder', {
          folder: props.folders,
          name: name.value
        })
        console.log(r)
        $q.loading.hide()
        onDialogOK()
      } catch (err) {
        $q.loading.hide()
        error.value = err.response.data.message
      }
    }

    return {
      name,
      error,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
