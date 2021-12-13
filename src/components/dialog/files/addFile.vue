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
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { api } from '@/boot/axios'
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

    const file = ref(null)
    const onOKClick = async () => {
      $q.loading.show()
      // 파일확인
      if (!file.value) {
        $q.loading.hide()
        return notifyError({
          message: '선택된 파일이 없습니다',
          caption: '업로드 할 파일을 먼저 선택 해주세요'
        })
      }
      try {
        // 중복 확인
        await api.get(
          `/api/files/check?folder=${encodeURIComponent(
            props.folders.join('/')
          )}&name=${encodeURIComponent(file.value.name)}`
        )
        // 업로드 데이터 생성
        let formData = new FormData()
        formData.append('file', file.value)
        formData.append('folder', props.folders.join('/'))

        // 파일 업로드
        await api.post('/api/files/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progress) => {
            console.log(
              parseInt(
                Math.round((progress.loaded / progress.total) * 100)
              )
            )
          }
        })
        onDialogOK()
      } catch (e) {
        $q.loading.hide()
        if (e.response.status == 409) {
          return notifyError({
            message: '파일 중복',
            caption: '선택된 폴더에 동일한 이름의 파일이 존재합니다.'
          })
        } else {
          console.error(e.response)
        }
      }

      // onDialogOK(file.value)
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
