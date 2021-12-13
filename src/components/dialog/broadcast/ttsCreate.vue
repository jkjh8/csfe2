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
            <div class="name" style="font-size: 1.2rem">TTS 합성</div>
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
                    <q-icon name="svguse:icons.svg#mic-fill" />
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
              v-model="message"
              filled
              type="textarea"
              label="메시지"
            />
          </div>

          <div class="q-gutter-y-sm">
            <FolderSel :folder="folder" />
            <q-btn
              class="full-width"
              rounded
              color="primary"
              unelevated
              label="폴더선택"
              @click="fnFolderSel"
            />
          </div>

          <div
            class="q-mx-md q-gutter-sm q-mt-md row justify-between"
          >
            <q-btn
              rounded
              unelevated
              color="grey-3"
              text-color="grey-10"
              @click="fnTTSPreview"
            >
              <q-icon name="svguse:icons.svg#mic-fill" size="sm" />
              <span class="q-ml-sm">미리듣기</span>
            </q-btn>

            <q-btn
              rounded
              unelevated
              color="cyan-1"
              text-color="grey-10"
              @click="fnOnSave"
            >
              <q-icon name="svguse:icons.svg#archive" size="sm" />
              <span class="q-ml-sm">저장하기</span>
            </q-btn>
          </div>
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
            :disabled="!folder"
            color="primary"
            label="확인"
            unelevated
            rounded
            @click="onOKClick(folder)"
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
import notify from '@/api/notify'
import { api } from '@/boot/axios'

import FolderSel from '@/components/files/folderSel'
import dlFolderSel from '@/components/dialog/files/folderSel'

export default {
  emits: [...useDialogPluginComponent.emits],
  components: { FolderSel },
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const user = computed(() => state.user.user)
    const voices = computed(() => state.tts.voices)
    const name = ref('')
    const message = ref('')
    const folder = ref(null)
    const tree = ref([])
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
        return commit('tts/updateRate', v)
      }
    })

    const fnReset = () => {
      name.value = ''
      folder.value = null
      message.value = ''
    }

    const fnTTSPreview = async () => {
      if (!voice.value) {
        return notifyError({
          message: '음성을 선택해주세요',
          caption:
            'TTS(Text to Speech) 음성 합성을 위해서 음성(언어)을 선택해주세요'
        })
      }
      if (!message.value) {
        return notifyError({
          message: '메시지를 입력해주세요',
          cation:
            'TTS(Text to Speech) 음성 합성할 메시지를 입력해주세요'
        })
      }

      const r = await api.post('/api/tts/preview', {
        name: name.value,
        voice: voice.value,
        rate: rate.value,
        message: message.value
      })
      dispatch('preview/openPreview', r.data)
    }

    const fnFilter = (node, filter) => {
      return node.type === filter
    }

    const fnFolderSel = () => {
      $q.dialog({
        component: dlFolderSel
      }).onOk(async (rt) => {
        console.log(rt)
        folder.value = rt
      })
    }

    const fnOnSave = async () => {
      if (!name.value) {
        return notifyError({
          message: '이름을 입력해주세요',
          caption: '파일 저장을 위해서 이름을 입력해주세요'
        })
      }
      if (!voice.value) {
        return notifyError({
          message: '음성을 선택해주세요',
          caption:
            'TTS(Text to Speech) 음성 합성을 위해서 음성(언어)을 선택해주세요'
        })
      }
      if (!message.value) {
        return notifyError({
          message: '메시지를 입력해주세요',
          cation:
            'TTS(Text to Speech) 음성 합성할 메시지를 입력해주세요'
        })
      }

      if (!folder.value) {
        return notifyError({
          message: '파일을 저장할 폴더를 선택해주세요',
          caption:
            'TTS(Text to Speech) 음성 합성 파일을 저장할 위치를 선택해주세요'
        })
      }
    }

    onMounted(async () => {
      $q.loading.show()
      try {
        const filetree = await api.get('/api/files/getTree')
        tree.value = [filetree.data]
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
      message,
      folder,
      tree,
      fnReset,
      fnTTSPreview,
      fnFilter,
      fnFolderSel,
      fnOnSave,
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
