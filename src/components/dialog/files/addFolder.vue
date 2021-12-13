<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-sm">
          <q-avatar size="2.5rem">
            <q-icon
              name="svguse:icons.svg#folder-fill"
              color="yellow"
              size="1.5rem"
            />
          </q-avatar>
          <div>
            <div class="name" style="font-size: 1.2rem">
              폴더 추가
            </div>
            <div class="caption" style="font-size: 0.5rem">
              해당 폴더에 새로운 폴더를 생성합니다
            </div>
          </div>
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
              @keyup.enter="onOKClick()"
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
import { api } from '@/boot/axios'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import notify from '@/api/notify'
export default {
  props: {
    folders: Array
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const $q = useQuasar()
    const { notifyError } = notify()

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
        if (err.response.data.message === '중복 폴더') {
          notifyError({
            message: '폴더를 생성할 수 없습니다',
            caption: '해당 폴더에 같은 이름의 폴더가 이미 존재합니다'
          })
        } else {
          notifyError({ message: err.response.data.message })
        }
      }
    }

    return {
      name,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
