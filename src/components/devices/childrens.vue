<template>
  <q-card
    class="shadow-15"
    style="width: 24rem; border-radius: 0.5rem"
  >
    <q-card-section class="q-pa-none gradient-blue">
      <div class="q-pa-md text-white">
        <div class="row items-center">
          <q-icon name="svguse:icons.svg#device-tablet" size="sm" />
          <div class="q-ml-sm name" style="font-size: 1rem">
            방송 구간 설정
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 50vh">
        <q-list>
          <q-item
            class="q-px-lg"
            v-for="device in childrens"
            :key="device.index"
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
                {{ device.parent.name }} channel:
                {{ device.channel }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div>
                <q-btn
                  flat
                  round
                  color="green-10"
                  size="sm"
                  icon="svguse:icons.svg#pencil-fill"
                  @click="fnEdit(device)"
                />
                <q-btn
                  flat
                  round
                  color="red-10"
                  size="sm"
                  icon="svguse:icons.svg#trash-fill"
                  @click="fnDelete(device)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

import Edit from '@/components/dialog/devices/add'
import Delete from '@/components/dialog/delete'

export default {
  setup() {
    const { getters, dispatch } = useStore()
    const $q = useQuasar()
    const childrens = computed(() => getters['devices/childrens'])

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
      childrens,
      fnEdit,
      fnDelete
    }
  }
}
</script>
