<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-sm">
          <q-avatar text-color="primary" size="2.5">
            <q-icon
              name="svguse:icons.svg#pencil-fill"
              color="green-10"
              size="1.5rem"
            />
          </q-avatar>
          <div>
            <div class="name" style="font-size: 1rem">
              방송 채널 수정
            </div>
            <div class="caption" style="font-size: 0.5rem">
              해당 디바이스의 방송 채널 라우팅 확인 및 수정
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section v-if="error" class="q-pb-none">
        <div
          class="q-px-md q-py-sm text-white"
          style="
            background: red;
            border-radius: 1rem;
            text-align: center;
          "
        >
          {{ error }}
        </div>
      </q-card-section>

      <q-form @submit="onOKClick()">
        <q-card-section>
          <q-scroll-area style="height: 400px">
            <div class="q-mx-md q-mt-md">
              <div v-for="(item, index) in channels" :key="index">
                <q-select
                  v-model="channels[index]"
                  dense
                  filled
                  clearable
                  :options="childrens"
                  option-value="_id"
                  emit-value
                  map-options
                  :label="`channel ${index + 1}`"
                  :rules="rules.duplicate"
                  lazy-rules
                >
                  <!-- seleted -->
                  <template #selected-item="scope">
                    <q-item v-if="scope.opt.name" dense>
                      <q-item-section avatar>
                        <q-icon
                          name="svguse:icons.svg#device-tablet"
                          size="xs"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label
                          >{{ scope.opt.name }} -
                          {{ scope.opt.ipaddress }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>

                  <!-- append -->
                  <template #append>
                    <q-icon
                      class="icon-btn"
                      name="search"
                      @click.prevent.stop="fnSelect(index)"
                    />
                  </template>

                  <!-- options -->
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section avatar>
                        <q-icon
                          name="svguse:icons.svg#device-tablet"
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
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>
          </q-scroll-area>
        </q-card-section>

        <!-- buttons example -->
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
              color="primary"
              label="확인"
              style="width: 5rem"
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
import { ref, computed, onBeforeMount, toRefs } from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import Select from '@/components/dialog/devices/selectChild'

export default {
  props: {
    item: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup(props) {
    const $q = useQuasar()
    const { item } = toRefs(props)
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { getters } = useStore()
    const childrens = computed(() => getters['devices/childrens'])
    const channels = ref([])
    const error = ref('')

    const fnSelect = (idx) => {
      $q.dialog({
        component: Select
      }).onOk(async (rt) => {
        console.log(idx, rt)
        channels.value[idx] = rt
      })
    }

    onBeforeMount(() => {
      for (let i = 0; i < item.value.channels; i++) {
        channels.value.push(null)
      }
      item.value.children.forEach((child) => {
        channels.value[child.channel - 1] = child._id
      })
    })

    const fnCheckLocal = (v) => {
      if (!v) return true
      const r = []
      channels.value.forEach((child) => {
        if (child) {
          if (child === v) {
            r.push(child)
          }
        }
      })
      if (r.length > 1) {
        return false
      } else {
        return true
      }
    }

    const onOKClick = async () => {
      const filterdChannel = channels.value.filter((e) => e != null)
      const r = await api.post('/api/devices/checkChild', {
        parent: item.value._id,
        channels: filterdChannel
      })
      if (r.data) {
        return (error.value = `타지역에 중복된 채널이 있습니다 - ${r.data}`)
      }

      await api.put('/api/devices/updateMasterChannel', {
        id: item.value._id,
        channels: filterdChannel
      })
      for (let i = 0; i < channels.value.length; i++) {
        if (channels.value[i]) {
          await api.put('/api/devices/updateChildChannel', {
            id: channels.value[i],
            channel: i + 1,
            parent: item.value._id
          })
        }
      }
      onDialogOK()
    }

    return {
      error,
      rules: {
        duplicate: [
          (v) => fnCheckLocal(v) || '동일지역에서 중복 되었습니다'
        ]
      },
      fnSelect,
      onOKClick,
      childrens,
      channels,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.icon-btn:hover {
  color: rgb(36, 163, 89);
}
</style>
