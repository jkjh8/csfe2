<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#pencil-fill"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">
              프리셋 이름
            </div>
          </div>
        </div>
      </q-card-section>
      <q-form @submit="onOKClick">
        <q-card-section>
          <!-- 내용 -->
          <div class="q-pt-md q-px-sm">
            <q-input
              v-model="vname"
              dense
              filled
              label="이름"
              :rules="rules.required"
            />
          </div>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right">
          <div class="q-mx-sm q-gutter-sm">
            <q-btn
              style="width: 4rem"
              label="취소"
              rounded
              unelevated
              @click="onCancelClick"
            />
            <q-btn
              style="width: 4rem"
              color="primary"
              label="확인"
              unelevated
              rounded
              type="submit"
            />
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { ref, onMounted } from 'vue'

export default {
  emits: [...useDialogPluginComponent.emits],
  props: { name: String },
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const vname = ref('')

    const onOKClick = () => {
      onDialogOK(vname.value)
    }

    onMounted(() => {
      vname.value = props.name
    })

    return {
      vname,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel,
      rules: {
        required: [(value) => !!value || '이름을 입력하세요']
      }
    }
  }
}
</script>

<style scoped>
.active-class {
  background: #91ecec;
  color: #000;
  border-radius: 0.5rem;
}
</style>
