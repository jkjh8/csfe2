<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="row items-center q-gutter-sm">
            <q-avatar text-color="red" size="2.5">
              <q-icon
                name="svguse:icons.svg#volume-up"
                color="primary"
                size="1.5rem"
              />
            </q-avatar>
            <div>
              <div class="name" style="font-size: 1rem">
                채널 조정
              </div>
              <div class="caption" style="font-size: 0.5rem">
                다음 채널의 볼륨과 뮤트를 설정합니다
              </div>
            </div>
          </div>

          <div>
            <q-btn
              rounded
              flat
              color="primary"
              label="초기화"
              @click=";(volume = 0), (mute = false)"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div>지역: {{ device.name }}</div>
          <div>채널: {{ item.channel }} - 이름: {{ item.name }}</div>
        </div>

        <div>
          <q-item>
            <q-item-section avatar>
              <q-btn
                round
                flat
                :icon="
                  mute
                    ? 'svguse:icons.svg#volume-off'
                    : 'svguse:icons.svg#volume-up'
                "
                :color="mute ? 'red' : 'primary'"
                @click="mute = !mute"
              >
                <q-tooltip
                  style="background: rgba(0, 0, 0, 0.4)"
                  anchor="top middle"
                  self="bottom middle"
                  :offset="[10, 10]"
                >
                  Mute
                </q-tooltip>
              </q-btn>
            </q-item-section>
            <q-item-section>
              <q-slider
                v-model="volume"
                :min="-100"
                :max="20"
                :step="1"
                label-always
                color="primary"
              />
            </q-item-section>
          </q-item>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            style="width: 5em"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="primary"
            label="확인"
            style="width: 5rem"
            unelevated
            rounded
            @click="onOKClick(item ? item : file)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, onMounted, toRefs } from 'vue'
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    item: Object,
    device: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { device, item } = toRefs(props)
    const volume = ref(0)
    const mute = ref(false)

    onMounted(() => {
      volume.value = device.value.gain[item.value.channel - 1]
      console.log(volume.value)
    })

    return {
      volume,
      mute,
      dialogRef,
      onDialogHide,
      onOKClick() {
        onDialogOK({
          volume: volume.value,
          mute: mute.value,
          device: {
            devicetype: device.value.devicetype,
            ipaddress: device.value.ipaddress,
            id: device.value._id
          },
          channel: item.value.channel
        })
      },

      onCancelClick: onDialogCancel
    }
  }
}
</script>
