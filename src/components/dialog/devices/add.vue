<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="row items-center q-gutter-md">
            <q-avatar size="2.5rem">
              <q-icon
                name="svguse:icons.svg#device-tablet"
                color="blue"
                size="1.5rem"
              />
            </q-avatar>
            <div>
              <div class="name" style="font-size: 1rem">
                장치 추가 및 수정
              </div>
              <div class="caption" style="font-size: 0.5rem">
                새로운 장치를 추가 하거나 수정합니다
              </div>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="error" class="q-pb-none q-pt-md">
        <div class="q-mx-md">
          <div class="error">
            {{ error }}
          </div>
        </div>
      </q-card-section>

      <q-form @submit="onOKClick(device)">
        <q-card-section>
          <div class="q-mx-md">
            <div>
              <q-input
                v-model="device.index"
                dense
                type="number"
                filled
                label="Index"
                :rules="rules.required"
                lazy-rules
              />

              <q-input
                v-model="device.name"
                dense
                filled
                label="이름"
                :rules="rules.required"
                lazy-rules
              />

              <q-input
                v-model="device.ipaddress"
                disabled
                dense
                filled
                label="Ipaddress"
                :rules="rules.ipaddress"
                lazy-rules
              />

              <q-select
                v-model="device.devicetype"
                dense
                filled
                label="Device Type"
                :options="['Q-Sys', 'Barix']"
              />

              <q-select
                v-model="device.mode"
                class="q-mt-md q-mb-sm"
                dense
                filled
                label="Device Mode"
                :options="['Master', 'Slave']"
              />

              <q-separator class="q-mb-sm" />

              <div v-if="device.mode === 'Master'">
                <q-input
                  v-model="device.channels"
                  dense
                  filled
                  type="number"
                  label="Device Channels"
                  :rules="rules.required"
                  lazy-rules
                />
              </div>

              <div v-else>
                <q-select
                  v-model="device.parent"
                  dense
                  filled
                  clearable
                  :options="parents"
                  option-value="_id"
                  emit-value
                  map-options
                  label="Parent"
                  :rules="rules.required"
                  lazy-rules
                >
                  <!-- seleted -->
                  <template #selected-item="scope">
                    <q-item v-if="scope.opt.name" dense>
                      <q-item-section avatar>
                        <q-icon
                          name="svguse:color.svg#pc"
                          size="xs"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label
                          >{{ scope.opt.name }} -
                          {{ scope.opt.ipaddress }}</q-item-label
                        >
                      </q-item-section>
                      <q-item-section side>
                        <span
                          :class="
                            scope.opt.type === 'Q-Sys'
                              ? 'qsys'
                              : 'barix'
                          "
                        >
                          {{ scope.opt.type }}
                        </span>
                      </q-item-section>
                    </q-item>
                  </template>
                  <!-- options -->
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon
                          name="svguse:color.svg#pc"
                          size="xs"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{
                          scope.opt.name
                        }}</q-item-label>
                        <q-item-label caption>
                          {{ scope.opt.ipaddress }}
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <span
                          :class="
                            scope.opt.type === 'Q-Sys'
                              ? 'qsys'
                              : 'barix'
                          "
                        >
                          {{ scope.opt.type }}
                        </span>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input
                  v-model="device.channel"
                  dense
                  filled
                  type="number"
                  label="Channel"
                  :rules="rules.required"
                  lazy-rules
                />
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- buttons example -->
        <q-card-actions align="right" class="bg-grey-1">
          <div class="q-mx-sm q-gutter-sm">
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
              type="submit"
            />
          </div>
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api } from '@/boot/axios'

export default {
  props: {
    item: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const $q = useQuasar()
    const { state, getters } = useStore()

    const devices = computed(() => state.devices.devices)

    const indexArr = devices.value.map((device) => device.index)
    const parents = computed(() => getters['devices/parents'])
    const error = ref('')

    const device = ref({
      index: 1,
      name: '',
      ipaddress: '',
      mode: 'Master',
      devicetype: 'Q-Sys',
      parent: null,
      channel: null,
      channels: 16,
      status: false
    })

    function getIndex() {
      let index = 1
      if (indexArr && indexArr.length > 0) {
        for (let i = 1; i <= indexArr.length + 1; i++) {
          if (!indexArr.includes(i)) {
            index = i
            break
          }
        }
      }
      return index
    }

    onMounted(async () => {
      device.value.index = getIndex()
      if (props.item) {
        device.value = { ...device.value, ...props.item }
      }
    })

    async function onOKClick(item) {
      let r
      $q.loading.show()
      try {
        if (item.mode === 'Slave') {
          r = await api.get(
            `/api/devices/checkChannel?parent=${item.parent._id}&child=${item._id}&channel=${item.channel}`
          )
          if (r.data) {
            $q.loading.hide()
            return (error.value = '채널이 중복 되었습니다')
          }
        }

        if (item._id) {
          r = await api.put('/api/devices', item)
        } else {
          r = await api.post('/api/devices', item)
        }

        if (r.data.mode === 'Slave') {
          console.log('update master')
          await api.get(
            `/api/devices/addChild?parent=${r.data.parent}&child=${r.data._id}`
          )
        }
        $q.loading.hide()
        onDialogOK(item)
        console.log(r)
      } catch (err) {
        error.value = err.response.data.message
      }
      $q.loading.hide()
    }

    return {
      rules: {
        required: [(value) => !!value || '필수 항목 입니다'],
        ipaddress: [
          (value) => !!value || '이메일을 입력하세요',
          (value) =>
            /^(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)(?:\.(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]\d|\d)){3}$/gm.test(
              value
            ) || 'IPv4 형식이 아닙니다'
        ]
      },
      dialogRef,
      onDialogHide,
      error,
      device,
      parents,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.error {
  background: red;
  color: #fff;
  border-radius: 1rem;
  width: 100%;
  padding: 0.5rem 0.5rem;
  text-align: center;
}
</style>
