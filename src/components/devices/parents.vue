<template>
  <q-card
    class="shadow-15"
    style="width: 40%; min-width: 350px; border-radius: 0.5rem"
  >
    <q-card-section class="q-pa-none gradient-red">
      <div class="q-pa-md text-white">
        <div class="row items-center">
          <q-icon name="svguse:icons.svg#server-fill" size="sm" />
          <div class="q-ml-sm name" style="font-size: 1rem">
            지역 설정
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 50vh">
        <q-list>
          <q-item
            class="q-px-lg"
            v-for="device in parents"
            :key="device.index"
            v-ripple
            clickable
            :active="device === selected"
            active-class="active-link"
            @click="fnClickItem(device)"
          >
            <q-item-section avatar>
              <q-avatar size="1.7rem" color="grey-1">
                {{ device.index }}
                <q-badge
                  v-if="!device.status"
                  color="red"
                  rounded
                  floating
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="name">{{ device.name }}</span>
                <span
                  class="q-mx-sm"
                  :class="
                    device.devicetype === 'Q-Sys' ? 'qsys' : 'barix'
                  "
                  style="font-size: 0.5rem"
                >
                  {{ device.devicetype }}
                </span>
              </q-item-label>
              <q-item-label caption>
                {{ device.ipaddress }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div>
                <q-btn
                  flat
                  round
                  color="grey-8"
                  size="sm"
                  icon="svguse:icons.svg#view-list"
                  @click.prevent.stop="fnEditChannel(device)"
                >
                  <q-tooltip
                    style="background: rgba(0, 0, 0, 0.4)"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    채널 수정
                  </q-tooltip>
                </q-btn>

                <q-btn
                  flat
                  round
                  color="green-10"
                  size="sm"
                  icon="svguse:icons.svg#pencil-fill"
                  @click.prevent.stop="fnEdit(device)"
                >
                  <q-tooltip
                    style="background: rgba(0, 0, 0, 0.4)"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    수정
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  round
                  color="red-10"
                  size="sm"
                  icon="svguse:icons.svg#trash-fill"
                  @click.prevent.stop="fnDelete(device)"
                >
                  <q-tooltip
                    style="background: rgba(0, 0, 0, 0.4)"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    삭제
                  </q-tooltip>
                </q-btn>
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

import Channels from '@/components/dialog/devices/channels'
import Edit from '@/components/dialog/devices/add'
import Delete from '@/components/dialog/delete'

export default {
  setup() {
    const { state, getters, commit } = useStore()
    const $q = useQuasar()
    const parents = computed(() => getters['devices/parents'])
    const selected = computed(() => state.devices.selected)

    const fnClickItem = (item) => {
      if (selected.value === item) {
        commit('devices/selected', null)
      } else {
        commit('devices/selected', item)
      }
    }

    const fnEditChannel = (item) => {
      $q.dialog({
        component: Channels,
        componentProps: { item: item }
      }).onOk(async () => {
        dispatch('devices/getDevices')
      })
    }

    const fnEdit = (item) => {
      $q.dialog({
        component: Edit,
        componentProps: { item: item }
      }).onOk(async () => {
        dispatch('devices/getDevices')
      })
    }

    const fnDelete = (item) => {
      $q.dialog({
        component: Delete,
        componentProps: { item: item }
      }).onOk(async (rt) => {
        $q.loading.show()
        try {
          await api.get(`/api/devices/delete?id=${rt._id}`)
          await dispatch('devices/getDevices')
        } catch (e) {
          console.error(e)
          notifyError({
            message: '장비를 삭제 할 수 없습니다'
          })
        }
        $q.loading.hide()
      })
    }

    return {
      parents,
      selected,
      fnClickItem,
      fnEditChannel,
      fnEdit,
      fnDelete
    }
  }
}
</script>

<style scoped>
.active-link {
  background: #eaeaea;
  color: black;
}
</style>
