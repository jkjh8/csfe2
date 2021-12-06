<template>
  <q-card class="shadow-15" style="border-radius: 0.5rem">
    <q-card-section>
      <div>
        <q-list>
          <div v-for="device in devices" :key="device.index">
            <q-expansion-item
              expand-separator
              default-opened
              :header-class="
                device.active.includes(true)
                  ? 'bg-yellow-2'
                  : 'bg-grey-2'
              "
            >
              <!--  헤더 -->
              <template #header>
                <q-item-section avatar>
                  <q-avatar>
                    <q-icon
                      :name="
                        device.status
                          ? 'svguse:color.svg#map1'
                          : 'svguse:color.svg#map1-grey'
                      "
                    />
                    <q-badge
                      v-show="!device.status"
                      rounded
                      floating
                      color="red"
                    />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label
                    class="name"
                    style="font-size: 1.2rem"
                  >
                    {{ device.name }}
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <div>
                    <q-btn
                      round
                      flat
                      icon="svguse:icons.svg#refresh"
                      @click.prevent.stop="fnRefresh(device)"
                    />
                  </div>
                </q-item-section>
              </template>

              <q-list>
                <q-item
                  v-for="item in device.children"
                  :key="item.channel"
                  :class="
                    device.active[item.channel - 1]
                      ? 'bg-yellow-2'
                      : ''
                  "
                >
                  <q-item-section avatar>
                    <q-avatar>
                      <q-icon
                        name="svguse:icons.svg#server-fill"
                        :color="item.status ? 'blue-8' : 'grey'"
                      />
                      <q-badge
                        v-show="!item.status"
                        rounded
                        floating
                        color="red"
                      />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{ item.name }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      {{
                        device.active[item.channel - 1]
                          ? '방송중'
                          : ''
                      }}
                    </q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <div class="row items-center q-gutter-md">
                      <div class="cursor-pointer">
                        <q-btn
                          rounded
                          flat
                          no-caps
                          no-wrap
                          @click.prevent.stop="fnVolume(device, item)"
                        >
                          <div class="row justify-start items-center">
                            <q-icon
                              name="svguse:icons.svg#volume-tri"
                              size="md"
                              color="blue-4"
                            />
                            <div>
                              {{ device.gain[item.channel - 1] }}
                            </div>
                            <div>dB</div>
                          </div>
                        </q-btn>
                      </div>
                      <div>
                        <q-btn
                          round
                          flat
                          :icon="
                            device.mute[item.channel - 1]
                              ? 'svguse:icons.svg#volume-off'
                              : 'svguse:icons.svg#volume-up'
                          "
                          :color="
                            device.mute[item.channel - 1]
                              ? 'red'
                              : 'green-8'
                          "
                          @click.prevent.stop="fnMute(device, item)"
                        />
                      </div>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-expansion-item>
          </div>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import notify from '@/api/notify'

import Volume from '@/components/dialog/broadcast/volume'

export default {
  setup() {
    const { getters, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()

    const devices = computed(() => getters['devices/parents'])

    const fnRefresh = async (device) => {
      $q.loading.show()
      try {
        await api.get(
          `/api/devices/refreshPa?ipaddress=${device.ipaddress}`
        )
        await dispatch('devices/getDevices')
      } catch (e) {
        $q.loading.hide()
        console.error(e.message)
        notifyError({
          message: '상태를 갱신할 수 없습니다',
          caption: '잠시후에 다시 시도해 주세요'
        })
      }
      $q.loading.hide()
    }

    const fnVolume = async (device, item) => {
      $q.loading.show()
      $q.dialog({
        component: Volume,
        componentProps: { device: device, item: item }
      }).onOk(async (rt) => {
        $q.loading.show()
        try {
          const r = await api.put('/api/devices/volume', rt)
          if (r.data.status) {
            await api.get(
              `/api/devices/refreshPa?ipaddress=${r.data.device.ipaddress}`
            )
            await dispatch('devices/getDevices')
          }
        } catch (e) {
          $q.loading.hide()
          console.error(e.message)
          notifyError({
            message: '상태를 변경할 수 없습니다',
            caption: '잠시후에 다시 시도해 주세요'
          })
        }
      })
      $q.loading.hide()
    }

    const fnMute = async (device, item) => {
      $q.loading.show()
      try {
        const r = await api.put('/api/devices/volume', {
          device: device,
          volume: null,
          mute: !device.mute[item.channel - 1],
          channel: item.channel
        })
        if (r.data.status) {
          await api.get(
            `/api/devices/refreshPa?ipaddress=${r.data.device.ipaddress}`
          )
          await dispatch('devices/getDevices')
        }
      } catch (e) {
        $q.loading.hide()
        console.error(e.message)
        notifyError({
          message: '상태를 변경할 수 없습니다',
          caption: '잠시후에 다시 시도해 주세요'
        })
      }
      $q.loading.hide()
    }

    return {
      devices,
      fnRefresh,
      fnVolume,
      fnMute
    }
  }
}
</script>
