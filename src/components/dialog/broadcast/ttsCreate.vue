<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#mic-fill"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">파일선택</div>
          </div>

          <div>
            <q-btn
              flat
              rounded
              color="primary"
              label="초기화"
              @click="fnReset"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- 내용 -->
        <div class="q-pt-md q-gutter-y-sm">
          <div>
            <q-input v-model="name" dense filled label="이름" />
          </div>
          <div>
            <q-select
              v-model="voice"
              dense
              :options="voices"
              filled
              label="음성선택"
              option-label="name"
              :display-value="
                voice ? `${voice.name} - ${voice.languages}` : 'None'
              "
              emit-value
              map-options
            >
              <template #option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="svguse:iconsColor.svg#mic" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ scope.opt.name }}
                    </q-item-label>
                    <q-item-label caption>
                      {{ scope.opt.languages.toString(',') }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div>
            <q-item>
              <q-item-section avatar> Rate </q-item-section>
              <q-item-section>
                <q-slider
                  v-model="rate"
                  label
                  :min="100"
                  :max="300"
                />
              </q-item-section>
            </q-item>
          </div>

          <div>
            <q-input
              v-model="text"
              filled
              type="textarea"
              label="메시지"
            />
          </div>
        </div>

        <div class="q-mx-md q-gutter-sm q-mt-md row justify-between">
          <q-btn
            rounded
            unelevated
            color="grey-3"
            text-color="grey-10"
          >
            <q-icon name="svguse:icons.svg#mic-fill" size="sm" />
            <span class="q-ml-sm">미리듣기</span>
          </q-btn>

          <q-btn
            rounded
            unelevated
            color="cyan-1"
            text-color="grey-10"
          >
            <q-icon name="svguse:icons.svg#archive" size="sm" />
            <span class="q-ml-sm">저장하기</span>
          </q-btn>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            :disabled="!file"
            color="primary"
            label="확인"
            unelevated
            rounded
            @click="onOKClick(file)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api } from '@/boot/axios'

export default {
  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()

    const user = computed(() => state.user.user)
    const voices = computed(() => state.tts.voices)
    const name = ref('')
    const text = ref('')
    const file = ref(null)
    const voice = computed({
      get() {
        return state.tts.voice
      },
      set(v) {
        return commit('tts/updateVoice', v)
      }
    })
    const rate = computed({
      get() {
        return state.tts.rate
      },
      set(v) {
        return commit('updateRate', v)
      }
    })

    const fnReset = () => {
      name.value = ''
      file.value = null
      text.value = ''
    }

    onMounted(async () => {
      $q.loading.show()
      try {
        const r = await api.get('/api/tts')
        console.log(r.data)
        dispatch('tts/updateInfo', r.data)
      } catch (err) {
        console.error('unknown tts', err)
      }
      $q.loading.hide()
    })

    return {
      name,
      voices,
      voice,
      rate,
      text,
      file,
      fnReset,
      dialogRef,
      onDialogHide,
      onOKClick(item) {
        onDialogOK(item)
      },
      onCancelClick: onDialogCancel
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
