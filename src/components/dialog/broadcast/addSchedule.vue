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
          </div>

          <div class="col-6 q-pl-md">우</div>
        </div>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            style="width: 5rem"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="negative"
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
import { reactive, toRefs, computed } from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent, useQuasar, uid } from 'quasar'
import moment from 'moment'
import { api } from '@/boot/axios'
import notify from '@/api/notify'

export default {
  props: {
    schedule: Object
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const user = computed(() => state.user.user)
    const current = reactive({
      id: uid(),
      name: '',
      repeat: '한번',
      time: moment().format('hh:mm'),
      date: moment().format('yyyy-MM-DD'),
      week: null,
      mode: 'Media',
      file: null,
      ttsText: '',
      ttsRate: 200,
      ttsVoice: null,
      selected: [],
      active: true,
      color: user.value.color,
      dateValue: null,
      description: '',
      startChime: false,
      endChime: false,
      volume: 70
    })
    const onOKClick = async () => {
      onDialogOK()
    }
    return {
      ...toRefs(current),
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
</style>
