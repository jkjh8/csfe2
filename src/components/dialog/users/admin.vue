<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-1">
        <div class="row items-center q-gutter-md">
          <q-avatar size="md">
            <q-icon
              name="svguse:icons.svg#check-circle"
              color="green"
              size="1.5rem"
            />
          </q-avatar>
          <div style="font-size: 1.2rem">관리자 권한</div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div v-if="user">
            <div v-if="user.email">
              사용자: <strong>{{ user.email }}</strong>
            </div>
            <div>
              해당 사용자에게 관리자 권한을
              {{ user.admin ? '회수' : '부여' }} 합니다.
            </div>
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
            @click="onOKClick(user)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    user: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    return {
      dialogRef,
      onDialogHide,

      onOKClick(user) {
        onDialogOK(user)
      },

      onCancelClick: onDialogCancel
    }
  }
}
</script>
