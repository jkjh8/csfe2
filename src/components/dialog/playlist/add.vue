<template>
  <!-- notice dialogRef here -->
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="row items-center q-gutter-md">
            <q-avatar size="2.5rem">
              <q-icon
                name="svguse:icons.svg#clipboard-list"
                color="blue"
                size="1.5rem"
              />
            </q-avatar>
            <div>
              <div class="name" style="font-size: 1rem">
                플레이 리스트 추가 및 수정
              </div>
              <div class="caption" style="font-size: 0.5rem">
                새로운 플레이 리스트를 추가 하거나 수정합니다
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-form @submit="onOKClick()">
        <q-card-section>
          <div class="q-mx-md">
            <q-input
              v-model="name.name"
              filled
              dense
              label="플레이 리스트 이름"
              lazy-rules
              :rules="[
                (val) =>
                  (val !== null && val !== '') ||
                  '이름을 입력해 주세요'
              ]"
            />
          </div>
        </q-card-section>
        <q-card-actions class="bg-grey-2" align="right">
          <q-btn
            style="width: 4rem"
            label="취소"
            rounded
            flat
            color="red"
            @click="onCancelClick"
          />
          <q-btn
            style="width: 4rem"
            color="primary"
            rounded
            unelevated
            label="확인"
            type="submit"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import notify from '@/api/notify'

export default {
  props: {
    item: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const { notifyError } = notify()
    const name = ref({
      name: '',
      list: []
    })

    onMounted(() => {
      console.log(props.item)
      if (props.item) {
        name.value = { ...props.item }
      }
    })
    const onOKClick = () => {
      if (!name.value) {
        return notifyError({
          message: '플레이 리스트 이름을 입력해주세요'
        })
      }
      onDialogOK({
        ...name.value
      })
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
