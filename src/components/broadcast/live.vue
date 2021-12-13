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
        <div class="q-gutter-y-sm">
          <ZoneSel
            :nodes="nodes"
            :selected="selected"
            :height="160"
          />
          <q-btn
            color="primary"
            rounded
            unelevated
            class="full-width"
            label="방송구간선택"
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
        <div class="q-gutter-y-sm">
          <FileSel :file="file" />
          <q-btn
            v-if="mode === 'Media'"
            class="full-width"
            rounded
            color="primary"
            unelevated
            label="파일선택"
            @click="fnFileSel"
          />
          <q-btn
            v-else
            class="full-width"
            rounded
            color="primary"
            unelevated
            label="TTS생성"
            @click="fnTTSCreate"
          />
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
            color="yellow-10"
            label="방송시작"
            @click="fnOnair"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { reactive, toRefs } from 'vue'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import ZoneSel from '@/components/broadcast/zoneSel'
import FileSel from '@/components/files/fileSel'
import dlZoneSel from '@/components/dialog/broadcast/zoneSel'
import dlFileSel from '@/components/dialog/files/fileSel'
import dlTTS from '@/components/dialog/broadcast/ttsCreate'

export default {
  components: { ZoneSel, FileSel },
  setup() {
    const $q = useQuasar()
    const { notifyError } = notify()
    const live = reactive({
      name: '',
      nodes: [],
      selected: [],
      mode: 'Media',
      file: null,
      volume: 70,
      startChime: false
    })

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
        live.file = rt
      })
    }

    const fnOnair = () => {
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
    }

    return {
      fnReset,
      fnZoneSel,
      fnFileSel,
      fnTTSCreate,
      fnOnair,
      ...toRefs(live)
    }
  }
}
</script>
