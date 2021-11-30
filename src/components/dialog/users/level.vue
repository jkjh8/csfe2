<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-md">
          <q-avatar size="md">
            <q-icon
              name="svguse:icons.svg#check-circle"
              color="green"
              size="1.5rem"
            />
          </q-avatar>
          <div style="font-size: 1.2rem">사용자 등급</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div v-if="user">
            <div v-if="user.email">
              사용자: <strong>{{ user.email }}</strong>
            </div>
            <div class="q-mt-md">
              <q-input
                v-model="level"
                dense
                filled
                type="number"
                level
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            rounded
            unelevated
            @click="onCancelClick"
          />
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
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    user: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const level = ref(0)
    return {
      level,
      dialogRef,
      onDialogHide,

      onOKClick() {
        onDialogOK({ value: level.value })
      },

      onCancelClick: onDialogCancel
    }
  }
}
</script>
