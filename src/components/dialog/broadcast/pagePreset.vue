<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-center">
            <q-icon
              name="svguse:icons.svg#book-fill"
              color="primary"
              size="sm"
            />
            <div>
              <div class="name" style="font-size: 1rem">프리셋</div>
              <div class="caption text-red" style="font-size: 0.5rem">
                프리셋은 재생 파일 정보를 포함하지 않습니다
              </div>
            </div>
          </div>
          <div>
            <q-btn
              rounded
              flat
              color="primary"
              label="등록"
              @click="fnAdd"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <!-- 내용 -->
        <div class="q-pt-md">
          <q-list dense>
            <q-item
              v-for="item in presets"
              :key="item._id"
              dense
              clickable
              v-ripple
              :active="selected === item"
              @click="fnClickItem(item)"
              @dblclick="fnDbClickItem(item)"
              active-class="active-class"
            >
              <q-item-section avatar>
                <q-icon name="svguse:icons.svg#clipboard-list" />
              </q-item-section>
              <q-item-section>
                {{ item.name }}
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions align="right">
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
            @click="onOKClick"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { ref, computed, onMounted, toRefs } from 'vue'
import { useStore } from 'vuex'
import notify from '@/api/notify'
import { api } from '@/boot/axios'

import dlName from '@/components/dialog/broadcast/presetName'

export default {
  emits: [...useDialogPluginComponent.emits],
  props: { preset: Object },
  setup(props) {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()
    const { preset } = toRefs(props)

    const user = computed(() => state.user.user)
    const presets = ref([])
    const selected = ref(null)

    const onOKClick = () => {
      onDialogOK(selected.value)
    }

    const fnClickItem = (item) => {
      if (selected.value === item) {
        selected.value = null
      } else {
        selected.value = item
      }
    }

    const fnDbClickItem = (item) => {
      onDialogOK(item)
    }

    const fnAdd = () => {
      if (preset.value && !preset.value.nodes.length) {
        return notifyError({
          message: '방송구간을 먼저 선택 해주세요',
          caption:
            '라이브방송 메뉴에서 방송구간을 먼저 선택 해주세요.'
        })
      }
      $q.dialog({
        component: dlName,
        componentProps: { name: preset.value.name }
      }).onOk(async (rt) => {
        console.log(rt)
        await api.post('/api/broadcast/pagePreset', {
          user: user.value.email,
          name: rt,
          nodes: preset.value.nodes,
          selected: preset.value.selected,
          mode: preset.value.mode,
          volume: preset.value.volume,
          startChime: preset.value.startChime,
          file: preset.value.file
        })
        await fnLoadPreset()
      })
    }

    const fnLoadPreset = async () => {
      try {
        const r = await api.get(
          `/api/broadcast/pagePreset?user=${user.value.email}`
        )
        presets.value = r.data
      } catch (e) {
        console.error(e)
      }
    }

    onMounted(async () => {
      $q.loading.show()
      await fnLoadPreset()
      $q.loading.hide()
    })

    return {
      user,
      presets,
      selected,
      fnAdd,
      fnClickItem,
      fnDbClickItem,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.active-class {
  background: #eee;
  color: #000;
  border-radius: 0.5rem;
}
</style>
