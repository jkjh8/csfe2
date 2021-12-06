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
          <div class="name" style="font-size: 1.2rem">
            실시간 방송
          </div>
        </div>

        <div>
          <q-btn rounded flat label="초기화" color="primary" />
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
          />
          <q-btn
            v-else
            class="full-width"
            rounded
            color="primary"
            unelevated
            label="TTS생성"
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
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, reactive, toRefs } from 'vue'
import ZoneSel from '@/components/broadcast/zoneSel'
import FileSel from '@/components/broadcast/fileSel'

export default {
  components: { ZoneSel, FileSel },
  setup() {
    const error = ref('')
    const live = reactive({
      name: '',
      nodes: [],
      selected: [],
      mode: 'Media',
      file: null,
      volume: 70,
      startChime: false
    })

    return {
      error,
      ...toRefs(live)
    }
  }
}
</script>
