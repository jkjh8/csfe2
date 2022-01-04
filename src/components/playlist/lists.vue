<template>
  <q-card
    class="shadow-15"
    style="width: 40%; min-width: 350px; border-radius: 0.5rem"
  >
    <q-card-section class="q-pa-none gradient-blue">
      <div
        class="q-px-md q-py-sm text-white row no-wrap justify-between"
      >
        <div class="row items-center">
          <q-icon name="svguse:icons.svg#server-fill" size="sm" />
          <div class="q-ml-sm name" style="font-size: 1rem">
            플레이 리스트
          </div>
        </div>
        <div>
          <q-btn
            round
            flat
            icon="svguse:icons.svg#plus-circle-fill"
            @click="fnAdd()"
          >
            <q-tooltip> 추가 </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 50vh">
        <q-list v-if="selected">
          <q-item
            class="q-px-lg"
            v-for="(item, index) in selected.list"
            :key="index"
          >
            <q-item-section avatar>
              <q-avatar size="1.7rem" color="grey-1">
                <q-icon
                  :name="fileIcons(item.type).icon"
                  :color="fileIcons(item.type).color"
                  size="xs"
                />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="name">{{ item.name }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <div>
                <q-btn
                  v-if="
                    item.type === 'audio' || item.type === 'video'
                  "
                  round
                  flat
                  icon="svguse:icons.svg#play"
                  size="sm"
                  color="green"
                  @click="fnPreview(item)"
                />
                <q-btn
                  flat
                  round
                  color="red-10"
                  size="sm"
                  icon="svguse:icons.svg#trash-fill"
                  @click="fnDelete(item, index)"
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
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import notify from '@/api/notify'

import Delete from '@/components/dialog/delete'
import Add from '@/components/dialog/files/addFileTable'

import fileIcons from '@/api/fileIcons'

export default {
  setup() {
    const { state, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()
    const user = computed(() => state.user.user)
    const playlist = computed(() => state.playlist.playlist)
    const selected = computed(() => state.playlist.selected)

    const fnAdd = () => {
      if (
        !user.value.admin &&
        selected.value.user !== user.value.email
      ) {
        return notifyError({
          message: '스케줄을 변경할 권한이 없습니다',
          caption: '관리자에게 문의 하세요'
        })
      }

      $q.dialog({
        component: Add,
        componentProps: { selection: 'multiple' }
      }).onOk(async (rt) => {
        try {
          $q.loading.show()
          await api.post('/api/playlist/addListItem', {
            id: selected.value._id,
            list: rt
          })
          dispatch('playlist/updatePlaylist')
          $q.loading.hide()
        } catch (e) {
          console.error(e)
          $q.loading.hide()
        }
      })
    }

    const fnDelete = (item, index) => {
      if (
        !user.value.admin &&
        selected.value.user !== user.value.email
      ) {
        return notifyError({
          message: '스케줄을 변경할 권한이 없습니다',
          caption: '관리자에게 문의 하세요'
        })
      }

      $q.dialog({
        component: Delete,
        componentProps: { item: item }
      }).onOk(async (rt) => {
        try {
          $q.loading.show()
          await api.get(
            `/api/playlist/removeListItem?id=${selected.value._id}&index=${index}`
          )
          await dispatch('playlist/updatePlaylist')
          $q.loading.hide()
        } catch (e) {
          $q.loading.hide()
          console.error(e)
        }
      })
    }

    const fnPreview = (file) => {
      dispatch('preview/openPreview', file)
    }

    return {
      playlist,
      selected,
      fileIcons,
      fnAdd,
      fnDelete,
      fnPreview
    }
  }
}
</script>
