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

      <q-card-section v-if="error">
        <div class="q-mx-md">
          <div class="error">
            {{ error }}
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-ma-md q-gutter-sm">
          <div>
            <q-input
              v-model="device.index"
              dense
              type="number"
              filled
              label="Index"
            />
          </div>
          <div>
            <q-input
              v-model="device.name"
              dense
              filled
              label="이름"
            />
          </div>
          <div>
            <q-input
              v-model="device.ipaddress"
              disabled
              dense
              filled
              label="Ipaddress"
            />
          </div>

          <div>
            <q-select
              v-model="device.devicetype"
              dense
              filled
              label="Device Type"
              :options="['Q-Sys', 'Barix']"
            />
          </div>
          <q-select
            v-model="device.mode"
            dense
            filled
            label="Device Mode"
            :options="['Master', 'Slave']"
          />

          <q-separator />

          <div v-if="device.mode === 'Master'">
            <div>
              <q-input
                v-model="device.channels"
                dense
                filled
                type="number"
                label="Device Channels"
              />
            </div>
          </div>

          <div v-else>
            <div>
              <q-select
                v-model="device.parent"
                dense
                filled
                clearable
                :options="masters"
                option-value="ipaddress"
                emit-value
                map-options
                label="Parent"
              >
                <!-- seleted -->
                <template #selected-item="scope">
                  <q-item v-if="scope.opt.name" dense>
                    <q-item-section avatar>
                      <q-icon
                        name="svguse:iconsColor.svg#pc"
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
                        name="svguse:iconsColor.svg#pc"
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
            </div>
            <div class="q-mt-sm">
              <q-input
                v-model="device.channel"
                dense
                filled
                type="number"
                label="Channel"
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
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="primary"
            label="확인"
            unelevated
            rounded
            @click="onOKClick(device)"
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
    const masters = computed(() => getters['devices/getMasters'])
    const error = ref('')

    const device = ref({
      index: 1,
      name: '',
      ipaddress: '',
      mode: 'Master',
      devicetype: 'Q-Sys',
      parent: null,
      children: [],
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
        device.value = { ...props.item }
      }
    })

    async function onOKClick(item) {
      $q.loading.show()
      try {
        if (item.mode === 'Master') {
          // item.children.length = item.channels

          if (item.children.length !== item.channels) {
            const childrens = []
            const actives = []
            for (let i = 0; i < item.channels; i++) {
              actives.push(false)
              if (item.children[i]) {
                childrens.push(item.children[i])
              }
            }
            item.children = childrens
            item.active = actives
          }
        } else {
          let master
          let arr = []
          for (let i = 0; i < masters.value.length; i++) {
            if (item.parent === masters.value[i].ipaddress) {
              master = { ...masters.value[i] }
              if (master.channels < item.channel) {
                return (error.value =
                  '방송채널이 존해 하지 않습니다.')
              } else {
                for (let j = 0; j < master.channels; j++) {
                  if (j === item.channel - 1) {
                    arr.push({
                      name: item.name,
                      ipaddress: item.ipaddress,
                      parent: item.parent,
                      channel: item.channel
                    })
                  } else {
                    if (master.children[j]) {
                      console.log(master.children[j])
                      arr.push(master.children[j])
                    }
                  }
                }
                master.children = arr
                await api.put('devices', master)
              }
            }
          }
        }

        if (item._id) {
          await api.put('/devices', item)
        } else {
          await api.post('devices', item)
        }
        $q.loading.hide()
        onDialogOK(item)
      } catch (err) {
        error.value = err.response.data.message
      }
      $q.loading.hide()
    }

    return {
      rules: {
        required: [(value) => !!value || '이름을 입력하세요']
      },
      dialogRef,
      onDialogHide,
      error,
      device,
      masters,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.zones {
  padding: 0.5rem 0.5rem;
  margin: 0.5rem 0 0.5rem 0;
  border-radius: 0.5rem;
  background: #f1f1f1;
}
.pickupColor {
  font-size: 0.5rem;
  height: 100%;
  margin: 5px 5px;
}
.pickBtn:hover {
  background: none;
}
.error {
  background: red;
  color: #fff;
  border-radius: 1rem;
  width: 100%;
  padding: 0.5rem 0.5rem;
  text-align: center;
}
</style>
