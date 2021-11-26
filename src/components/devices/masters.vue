<template>
  <q-card
    class="shadow-15"
    style="width: 24rem; border-radius: 0.5rem"
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
            v-for="device in masters"
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

export default {
  setup() {
    const { state, getters, commit } = useStore()
    const masters = computed(() => getters['devices/getMasters'])
    const selected = computed(() => state.devices.selected)

    const fnClickItem = (item) => {
      if (selected.value === item) {
        commit('devices/selected', null)
      } else {
        commit('devices/selected', item)
      }
    }

    return {
      masters,
      selected,
      fnClickItem
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
