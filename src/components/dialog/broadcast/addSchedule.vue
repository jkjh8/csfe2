<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide" persistent>
    <q-card
      class="q-dialog-plugin"
      style="width: 800px; max-width: 1200px"
    >
      <q-card-section class="bg-grey-2">
        <div class="row no-wrap justify-between items-center">
          <div class="row items-center q-pl-md q-gutter-x-md">
            <q-icon
              name="svguse:icons.svg#file"
              color="blue"
              size="1.5rem"
            />
            <div>
              <div class="name" style="font-size: 1rem">스케줄</div>
              <div class="caption" style="font-size: 0.5rem">
                스케줄을 추가하거나 수정합니다
              </div>
            </div>
          </div>
          <div>
            <q-btn
              round
              flat
              :color="active ? 'green' : 'red-10'"
              :icon="
                active
                  ? 'svguse:icons.svg#check-circle'
                  : 'svguse:icons.svg#ban'
              "
              size="sm"
              @click="active = !active"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
                :offset="[10, 10]"
              >
                동작상태
              </q-tooltip>
            </q-btn>

            <q-btn
              round
              flat
              color="red-10"
              icon="svguse:icons.svg#trash-fill"
              size="sm"
              :disabled="disabled"
              @click="fnDelete"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
                :offset="[10, 10]"
              >
                스케줄삭제
              </q-tooltip>
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg row no-wrap">
          <div class="col-6 q-pr-md q-gutter-y-sm">
            <!-- 이름 -->
            <q-input v-model="name" filled dense label="이름" />

            <!-- 색상 -->
            <q-input v-model="color" filled dense label="색상선택">
              <template #append>
                <q-icon
                  class="cursor-pointer"
                  name="colorize"
                  :style="`color: ${color};`"
                >
                  <q-popup-proxy
                    cover
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-color
                      v-model="color"
                      flat
                      style="width: 300px"
                    />
                    <q-btn
                      class="floating shadow-15"
                      round
                      icon="close"
                      size="sm"
                      color="yellow"
                      v-close-popup
                    />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- 반복 -->
            <q-select
              v-model="repeat"
              filled
              dense
              label="반복"
              :options="['한번', '매일', '매주']"
            />
            <!-- 반복 - 한번 -->
            <q-input
              v-if="repeat === '한번'"
              v-model="date"
              dense
              filled
              label="날짜선택"
            >
              <template #append>
                <q-icon class="cursor-pointer" name="event">
                  <q-popup-proxy
                    ref="qDateProxy"
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-date v-model="date" mask="YYYY-MM-DD">
                      <q-btn
                        class="floating shadow-15"
                        round
                        icon="close"
                        size="sm"
                        color="yellow"
                        v-close-popup
                      />
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>

            <!-- 반복 매주 -->
            <q-select
              v-if="repeat === '매주'"
              v-model="week"
              filled
              dense
              multiple
              label="요일선택"
              :options="[
                { label: '월요일', value: 1 },
                { label: '화요일', value: 2 },
                { label: '수요일', value: 3 },
                { label: '목요일', value: 4 },
                { label: '금요일', value: 5 },
                { label: '토요일', value: 6 },
                { label: '일요일', value: 0 }
              ]"
            />

            <!-- 매일 공통 시간선택 -->
            <q-input
              v-model="time"
              filled
              dense
              mask="time"
              label="시간선택"
            >
              <template #append>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy
                    transition-show="scale"
                    transition-hide="scale"
                  >
                    <q-time v-model="time">
                      <q-btn
                        class="floating shadow-15"
                        round
                        icon="close"
                        size="sm"
                        color="yellow"
                        v-close-popup
                      />
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <q-separator />
            <div style="position: relative">
              <ZoneSel
                class="cursor-pointer"
                :nodes="nodes"
                :selected="selected"
                :height="80"
                @click="fnAddZones"
              />
              <q-icon
                class="right-top cursor-pointer"
                style="top: 5px"
                name="svguse:icons.svg#plus-circle"
                color="primary"
                size="sm"
                @click="fnAddZones"
              />
            </div>
          </div>

          <div class="col-6 q-pl-md q-gutter-y-sm">
            <q-select
              v-model="mode"
              filled
              dense
              label="방송모드"
              :options="['Media', 'TTS', 'Playlist']"
            />
            <div class="q-gutter-y-sm" style="position: relative">
              <FileSel
                v-if="mode === 'Media' || mode === 'TTS'"
                class="cursor-pointer"
                :file="file"
                @click="selMedia(mode)"
              />
              <PlaylistSel
                v-if="mode === 'Playlist'"
                :playlist="playlist"
                class="cursor-pointer"
                @click="selMedia(mode)"
              />
              <q-icon
                class="right-top cursor-pointer"
                name="svguse:icons.svg#plus-circle"
                color="primary"
                size="sm"
                @click="selMedia(mode)"
              />
            </div>
            <!-- 볼륨 -->
            <div
              class="bg-grey-2"
              style="border-radius: 0.5rem; padding: 0.1rem 1rem"
            >
              <div class="fit row justify-between items-center">
                <div class="listname">볼륨</div>
                <div style="width: 80%; min-width: 200px">
                  <q-slider v-model="volume" label />
                </div>
              </div>
            </div>

            <!-- chime -->
            <div class="row justify-end">
              <q-checkbox
                v-model="startChime"
                label="시작차임"
                left-label
                dense
              />
            </div>

            <q-separator />

            <!-- 상세 설명 -->
            <div>
              <q-input
                v-model="description"
                type="textarea"
                filled
                dense
                label="상세설명"
              />
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-x-sm">
          <q-btn
            label="취소"
            style="width: 5rem"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="primary"
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
import { reactive, toRefs, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent, useQuasar, uid } from 'quasar'
import { api } from '@/boot/axios'

import moment from 'moment'
import notify from '@/api/notify'

import ZoneSel from '@/components/broadcast/zoneSel'
import FileSel from '@/components/files/fileSel'
import PlaylistSel from '@/components/playlist/playlistSel'
import dlDelete from '@/components/dialog/delete/'
import dlZoneSel from '@/components/dialog/broadcast/zoneSel'
import dlFileSel from '@/components/dialog/files/fileSel'
import dlTTS from '@/components/dialog/broadcast/ttsCreate'
import dlPlaylistSel from '@/components/dialog/playlist/selPlaylist'

export default {
  components: { ZoneSel, FileSel, PlaylistSel },
  props: {
    schedule: Object
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, getters } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const parents = computed(() => getters['devices/parents'])

    const user = computed(() => state.user.user)
    const current = reactive({
      id: uid(),
      user: user.value.email,
      name: '',
      repeat: '한번',
      time: moment().format('hh:mm'),
      date: moment().format('yyyy-MM-DD'),
      week: null,
      mode: 'Media',
      file: null,
      playlist: null,
      ttsText: '',
      ttsRate: 200,
      ttsVoice: null,
      nodes: [],
      selected: [],
      active: true,
      color: user.value.color,
      dateValue: null,
      description: '',
      startChime: false,
      endChime: false,
      volume: 70
    })

    const disabled = computed(() => {
      if (current && current._id) {
        return false
      } else {
        return true
      }
    })

    const fnDelete = () => {
      $q.dialog({
        component: dlDelete,
        componentProps: { message: '현재 스케줄을 삭제하시겠습니까?' }
      }).onOk(async () => {
        if (current && current._id) {
          await api.get(
            `/api/broadcast/schedule/delete?id=${current._id}`
          )
        }
        onDialogOK()
      })
    }

    const fnAddZones = () => {
      $q.dialog({
        component: dlZoneSel,
        componentProps: { zones: current.selected }
      }).onOk((rt) => {
        current.nodes = rt.zones
        current.selected = rt.selected
      })
    }

    const fnFileSel = () => {
      $q.dialog({
        component: dlFileSel
      }).onOk(async (rt) => {
        console.log(rt)
        current.file = rt
      })
    }

    const fnTTSCreate = () => {
      $q.dialog({
        component: dlTTS
      }).onOk(async (rt) => {
        current.file = rt.file
      })
    }

    const fnPlaylistSel = () => {
      $q.dialog({
        component: dlPlaylistSel
      }).onOk((rt) => {
        current.playlist = rt
      })
    }

    const selMedia = (mode) => {
      switch (mode) {
        case 'Media':
          fnFileSel()
          break
        case 'TTS':
          fnTTSCreate()
          break
        case 'Playlist':
          fnPlaylistSel()
          break
      }
    }

    const onOKClick = async () => {
      if (!current.name) {
        return notifyError({
          message: '이름을 입력하세요'
        })
      }
      if (!current.selected.length) {
        return notifyError({
          message: '방송구간을 선택 해주세요'
        })
      }
      if (!current.file) {
        return notifyError({
          message: '방송 미디어를 선택 해주세요'
        })
      }
      try {
        if (current._id) {
          await api.put('/api/broadcast/schedule', current)
        } else {
          await api.post('/api/broadcast/schedule', current)
        }
        onDialogOK()
      } catch (e) {
        console.error(e.response)
        notifyError({
          message: e.response.data.message,
          caption: e.response.data.caption
        })
      }
    }

    onMounted(() => {
      if (props.schedule) {
        for (const [key, value] of Object.entries(props.schedule)) {
          current[key] = value
        }
      }
    })

    return {
      ...toRefs(current),
      parents,
      disabled,
      fnAddZones,
      fnFileSel,
      fnTTSCreate,
      fnDelete,
      fnPlaylistSel,
      selMedia,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.floating {
  position: absolute;
  top: 5px;
  right: 5px;
}
.right-top {
  position: absolute;
  top: -5px;
  right: 5px;
}
</style>
