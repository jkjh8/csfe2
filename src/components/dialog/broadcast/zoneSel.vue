<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#map-fill"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">
              방송구간선택
            </div>
          </div>

          <div>
            <q-btn
              rounded
              flat
              color="primary"
              label="초기화"
              @click="fnReset"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="name q-pa-sm">방송구간선택</div>
        <q-scroll-area style="height: 320px">
          <q-tree
            v-model:ticked="ticked"
            :nodes="parents"
            node-key="_id"
            tick-strategy="leaf"
          >
            <template #default-header="props">
              <div>{{ props.node.name }}</div>
            </template>
          </q-tree>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
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
            @click="onOKClick(ticked)"
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

export default {
  props: {
    zones: Array
  },
  emits: [...useDialogPluginComponent.emits],
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, getters } = useStore()

    const user = computed(() => state.user.user)
    const parents = computed(() => getters['devices/parents'])
    const devices = computed(() => state.devices.devices)
    const ticked = ref([])

    const fnReset = () => {
      ticked.value = []
    }

    const fnGetZones = (zones) => {
      const sel = []
      devices.value.forEach((zone) => {
        if (zones.includes(zone._id) && zone.mode === 'Master') {
          sel.push({
            _id: zone._id,
            name: zone.name,
            ipaddress: zone.ipaddress,
            all: true,
            children: [],
            channels: [1]
          })
        } else {
          const children = []
          const channels = []
          zone.children.forEach((child) => {
            if (zones.includes(child._id)) {
              children.push({
                _id: child._id,
                name: child.name,
                ipaddress: child.ipaddress,
                channel: child.channel
              })
              channels.push(child.channel)
            }
          })
          if (children.length) {
            sel.push({
              _id: zone._id,
              name: zone.name,
              ipaddress: zone.ipaddress,
              all: children.length === zone.children.length ?? true,
              children: children.sort(
                (a, b) => a.channel - b.channel
              ),
              channels: channels.sort()
            })
          }
        }
      })
      return sel
    }

    onMounted(() => {
      console.log(props.zones)
      ticked.value = props.zones
    })

    return {
      user,
      parents,
      ticked,
      fnReset,
      dialogRef,
      onDialogHide,
      onOKClick(ticked) {
        onDialogOK({
          selected: ticked,
          zones: fnGetZones(ticked)
        })
      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>
