<template>
  <q-card class="shadow-15" style="border-radius: 0.5rem">
    <q-card-section>
      <div>
        <q-list>
          <div v-for="device in devices" :key="device.index">
            <q-expansion-item expand-separator default-opened>
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
                  <q-item-label>
                    {{ device.name }}
                  </q-item-label>
                </q-item-section>
              </template>

              <div>
                <div
                  v-for="item in device.children"
                  :key="item.index"
                >
                  {{ item.name }}
                </div>
              </div>
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
export default {
  setup() {
    const { getters } = useStore()

    const devices = computed(() => getters['devices/parents'])

    return {
      devices
    }
  }
}
</script>
