<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
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
          <div style="font-size: 1.2rem">비밀번호 변경</div>
        </div>
      </q-card-section>

      <q-card-section v-if="error">
        <div
          class="q-mx-md q-pa-sm bg-red text-white text-center"
          style="border-radius: 1rem"
        >
          {{ error }}
        </div>
      </q-card-section>
      <q-form @submit="onOKClick">
        <q-card-section>
          <div class="q-mx-md">
            <div v-if="user">
              <div v-if="user.email">
                사용자: <strong>{{ user.email }}</strong>
              </div>

              <div class="q-gutter-sm q-mt-md">
                <q-input
                  dense
                  filled
                  v-model="currentPassword"
                  label="현재 비밀번호"
                  :rules="rules.password"
                  :type="showCurr ? 'text' : 'password'"
                >
                  <template #append>
                    <q-icon
                      :name="
                        showCurr ? 'visibility' : 'visibility_off'
                      "
                      @click="showCurr = !showCurr"
                    />
                  </template>
                </q-input>
                <q-input
                  dense
                  filled
                  v-model="changePassword"
                  label="변경할 비밀번호"
                  :rules="rules.change"
                  :type="showChange ? 'text' : 'password'"
                >
                  <template #append>
                    <q-icon
                      :name="
                        showChange ? 'visibility' : 'visibility_off'
                      "
                      @click="showChange = !showChange"
                    />
                  </template>
                </q-input>
                <q-input
                  dense
                  filled
                  v-model="checkChange"
                  label="변경할 비밀번호 확인"
                  :rules="rules.check"
                  :type="showCheck ? 'text' : 'password'"
                >
                  <template #append>
                    <q-icon
                      :name="
                        showCheck ? 'visibility' : 'visibility_off'
                      "
                      @click="showCheck = !showCheck"
                    />
                  </template>
                </q-input>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions class="bg-grey-1" align="right">
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
              color="negative"
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
import { ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { api } from '@/boot/axios'

export default {
  props: {
    user: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const error = ref('')
    const currentPassword = ref('')
    const changePassword = ref('')
    const checkChange = ref('')

    const showCurr = ref(false)
    const showChange = ref(false)
    const showCheck = ref(false)

    async function onOKClick() {
      error.value = ''
      try {
        const r = await api.post('/api/users/changePassword', {
          email: props.user.email,
          currentPassword: currentPassword.value,
          changePassword: changePassword.value
        })

        $q.notify({
          icon: 'svguse:icons.svg#check-circle',
          message: '비밀번호가 변경 되었습니다',
          caption: '다음 로그인 부터 변경된 비밀번호가 적용됩니다.',
          position: 'top',
          color: 'primary'
        })

        onDialogOK()
      } catch (err) {
        console.error(err.response)
        error.value = err.response.data.message
      }
    }

    return {
      rules: {
        password: [
          (v) => !!v || '비밀번호를 입력하세요',
          (v) => v.length >= 8 || '최소 8자 이상 입력하세요'
        ],
        change: [
          (v) => !!v || '비밀번호를 입력하세요',
          (v) => v.length >= 8 || '최소 8자 이상 입력하세요',
          (v) =>
            v !== currentPassword.value ||
            '기존 비밀번호와 동일합니다'
        ],
        check: [
          (v) => !!v || '비밀번호를 입력하세요',
          (v) => v.length >= 8 || '최소 8자 이상 입력하세요',
          (v) =>
            v === changePassword.value ||
            '비밀번호가 일치하지 않습니다'
        ]
      },
      error,
      showCurr,
      showChange,
      showCheck,
      currentPassword,
      changePassword,
      checkChange,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
