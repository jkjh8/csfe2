<template>
  <q-card
    class="shadow-15"
    style="width: 30rem; border-radius: 0.5rem"
  >
    <q-card-section>
      <div class="row justify-between items-center">
        <div class="row items-end q-px-md q-gutter-x-sm">
          <q-icon
            name="svguse:icons.svg#mic-fill"
            size="sm"
            color="primary"
          />
          <div class="name" style="font-size: 1.2rem">파일선택</div>
        </div>

        <div>
          <q-btn
            rounded
            flat
            label="프리셋"
            color="grey"
            @click="fnPreset"
          />
          <q-btn
            rounded
            flat
            label="초기화"
            color="primary"
            @click="fnReset"
          />
        </div>
      </div>
    </q-card-section>

    <!-- 방송 -->
    <q-card-section class="q-pt-xs">
      <div class="q-px-md q-gutter-y-sm">
        <!-- 이름 -->
        <div>
          <q-input v-model="name" dense filled label="이름" />
        </div>

        <q-separator />

        <!-- 방송 구간 선책 -->
        <div class="q-gutter-y-sm" style="position: relative">
          <ZoneSel
            class="cursor-pointer"
            :nodes="nodes"
            :selected="selected"
            :height="160"
            @click="fnZoneSel"
          />
          <q-icon
            class="right-top cursor-pointer"
            name="svguse:icons.svg#plus-circle"
            color="primary"
            size="sm"
            @click="fnZoneSel"
          />
        </div>

        <q-separator />

        <!-- 방송모드 선택 -->
        <div>
          <q-select
            v-model="mode"
            filled
            dense
            label="방송모드"
            :options="['Media', 'TTS']"
          />
        </div>

        <q-separator />

        <!-- 미디어 선택 -->
        <div class="q-gutter-y-sm" style="position: relative">
          <FileSel
            class="cursor-pointer"
            :file="file"
            @click="mode === 'Media' ? fnFileSel() : fnTTSCreate()"
          />
          <q-icon
            class="right-top cursor-pointer"
            name="svguse:icons.svg#plus-circle"
            color="primary"
            size="sm"
            @click="mode === 'Media' ? fnFileSel() : fnTTSCreate()"
          >
          </q-icon>
        </div>

        <q-separator />

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

        <q-separator />

        <!-- 챠임 -->
        <div class="row justify-end">
          <q-checkbox
            v-model="startChime"
            dense
            label="챠임"
            left-label
          />
        </div>

        <q-separator />

        <!-- 방송시작 -->
        <div>
          <q-btn
            class="full-width"
            rounded
            unelevated
            color="primary"
            label="방송시작"
            @click="fnOnair"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>

  <q-dialog v-model="dlOnAir" maximized>
    <q-card style="background: rgba(50, 50, 50, 0.5)">
      <q-bar>
        <q-space />
        <q-btn dense flat icon="close" v-close-popup>
          <q-tooltip class="bg-white text-primary">Close</q-tooltip>
        </q-btn>
      </q-bar>

      <q-card-section>
        <div class="row justify-center items-center">
          <div class="view">
            <div
              v-for="(msg, index) in message"
              :key="index"
              style="font-size: 2rem; color: #bbb"
            >
              <div v-if="message.length - (index + 3) < 0">
                {{ msg }}
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div
          class="
            row
            justify-center
            items-center
            q-gutter-x-sm
            text-white
          "
          style="font-size: 2rem"
        >
          <span>방송시간:</span>
          <span>{{ hms(sec) }}</span>
        </div>
      </q-card-section>

      <q-card-section>
        <div
          class="row justify-center items-center"
          style="height: 300px"
        >
          <q-spinner-dots color="primary" size="20em" />
        </div>
      </q-card-section>

      <q-card-section>
        <div class="row justify-center items-center">
          <q-btn
            style="border-radius: 0.5rem"
            icon="svguse:icons.svg#ban"
            size="3rem"
            label="방송정지"
            color="red-10"
            @click="fnStop"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { reactive, toRefs, ref, onMounted, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'

import notify from '@/api/notify'
import { socket } from '@/api/socketio'
import { hms } from '@/api/time'

import ZoneSel from '@/components/broadcast/zoneSel'
import FileSel from '@/components/files/fileSel'
import dlZoneSel from '@/components/dialog/broadcast/zoneSel'
import dlFileSel from '@/components/dialog/files/fileSel'
import dlTTS from '@/components/dialog/broadcast/ttsCreate'
import dlPreset from '@/components/dialog/broadcast/pagePreset'

export default {
  components: { ZoneSel, FileSel },
  setup() {
    const $q = useQuasar()
    const { notifyError } = notify()
    const dlOnAir = ref(false)
    const sec = ref(1)
    const timer = ref(null)
    const message = ref([])
    const { state, commit } = useStore()

    const user = computed(() => state.user.user)
    const pageId = computed(() => state.page.pageId)
    const live = reactive({
      name: '',
      nodes: [],
      selected: [],
      mode: 'Media',
      file: null,
      volume: 70,
      startChime: false
    })

    const fnPreset = () => {
      $q.dialog({
        component: dlPreset,
        componentProps: {
          preset: { ...live }
        }
      }).onOk(async (rt) => {
        console.log(rt)
      })
    }

    const fnReset = () => {
      ;(live.name = ''),
        (live.nodes = []),
        (live.selected = []),
        (live.file = null),
        (live.mode = 'Media'),
        (live.volume = 70)
      live.startChime = false
    }

    const fnZoneSel = () => {
      $q.dialog({
        component: dlZoneSel,
        componentProps: { zones: live.selected }
      }).onOk(async (rt) => {
        live.nodes = rt.zones
        live.selected = rt.selected
      })
    }

    const fnFileSel = () => {
      $q.dialog({
        component: dlFileSel
      }).onOk(async (rt) => {
        console.log(rt)
        live.file = rt
      })
    }

    const fnTTSCreate = () => {
      $q.dialog({
        component: dlTTS
      }).onOk(async (rt) => {
        live.file = rt.file
      })
    }

    const fnOnair = () => {
      if (!socket.connected) {
        return notifyError({
          message: '통신에 문제가 있습니다.',
          caption:
            '페이지를 새로고침하시거나 잠시후에 다시 시도해주세요.'
        })
      }
      if (!live.name) {
        return notifyError({
          message: '이름을 입력해주세요'
        })
      }

      if (!live.selected.length) {
        return notifyError({ message: '방송구간을 선택해주세요' })
      }

      if (!live.file) {
        return notifyError({ message: '미디어 파일을 선택해주세요' })
      }
      commit('page/updatePageId', uid())
      socket.emit('command', 'check', {
        id: pageId.value,
        ...live,
        user: user.value.email
      })
    }

    const fnStop = () => {
      clearInterval(timer.value)
      sec.value = 1
      dlOnAir.value = false
      message.value = []
      socket.emit('command', 'offair', {
        id: pageId.value,
        ...live,
        user: user.value.email
      })
    }

    onMounted(() => {
      socket.on('page_message', (msg) => {
        message.value.push(msg)
      })
      socket.on('page_checked', (args) => {
        try {
          const { id, dup } = args
          console.log(args)
          if (id === pageId.value) {
            if (dup && dup.length) {
              notifyError({
                message: '방송구간이 중복되었습니다',
                caption: `중복된 구간은 ${dup
                  .map((e) => e.name)
                  .join(',')} 입니다.`
              })
            } else {
              dlOnAir.value = true
              timer.value = setInterval(() => {
                sec.value += 1
              }, 1000)
              socket.emit('command', 'onair', {
                id: pageId.value,
                ...live,
                user: user.value.email
              })
            }
          }
        } catch (e) {
          notifyError({
            message: '방송 상태를 확인할 수 없습니다',
            caption:
              '잠시후에 다시 시도하거나 관리자에게 문의해주세요.'
          })
        }
      })
    })

    return {
      message,
      sec,
      fnPreset,
      fnReset,
      fnZoneSel,
      fnFileSel,
      fnTTSCreate,
      fnOnair,
      dlOnAir,
      fnStop,
      hms,
      ...toRefs(live)
    }
  }
}
</script>

<style scoped>
.view {
  height: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 40px;
  max-height: 300px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.right-top {
  position: absolute;
  top: -5px;
  right: 5px;
}
</style>
