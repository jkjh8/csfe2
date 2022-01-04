<template>
  <q-card
    class="shadow-15"
    style="width: 40%; min-width: 350px; border-radius: 0.5rem"
  >
    <q-card-section class="q-pa-none gradient-red">
      <div
        class="q-px-md q-py-sm text-white row no-wrap justify-between"
      >
        <div class="row items-center">
          <q-icon name="svguse:icons.svg#server-fill" size="sm" />
          <div class="q-ml-sm name" style="font-size: 1rem">
            플레이 리스트 선택
          </div>
        </div>
        <div>
          <q-btn
            round
            flat
            icon="svguse:icons.svg#plus-circle-fill"
            @click="fnAdd()"
          >
            <q-tooltip> 플레이리스트 생성 </q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pa-none">
      <q-scroll-area style="height: 50vh">
        <q-list>
          <div
            class="q-mt-lg row justify-center"
            v-if="!playlist.length"
          >
            리스트가 없습니다
          </div>
          <q-item
            class="q-px-lg"
            v-for="item in playlist"
            :key="item.name"
            v-ripple
            clickable
            :active="item === selected"
            active-class="active-link"
            @click="fnClickItem(item)"
          >
            <q-item-section avatar>
              <q-icon
                name="svguse:icons.svg#clipboard-list"
                size="xs"
                color="primary"
              />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                <span class="name">{{ item.name }}</span>
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
                  @click.prevent.stop="fnAdd(item)"
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
                  @click.prevent.stop="fnDelete(item)"
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

import Add from '@/components/dialog/playlist/add'
import Delete from '@/components/dialog/delete'

export default {
  setup() {
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()
    const { notifyError } = notify()
    const user = computed(() => state.user.user)
    const playlist = computed(() => state.playlist.playlist)
    const selected = computed(() => state.playlist.selected)

    const fnClickItem = (item) => {
      if (selected.value === item) {
        commit('playlist/updateSelected', null)
      } else {
        commit('playlist/updateSelected', item)
      }
    }

    const fnAdd = async (item) => {
      try {
        if (item && item._id) {
          if (user.value.admin || item.user === user.value.email) {
            $q.dialog({
              component: Add,
              componentProps: { item: item }
            }).onOk(async (rt) => {
              $q.loading.show()
              await api.put('/api/playlist', rt)
              await dispatch('playlist/updatePlaylist')
              $q.loading.hide()
            })
          } else {
            notifyError({
              message: '스케줄을 변경할 권한이 없습니다',
              caption: '관리자에게 문의 하세요'
            })
          }
        } else {
          $q.dialog({
            component: Add
          }).onOk(async (rt) => {
            $q.loading.show()
            await api.post('/api/playlist', {
              name: rt.name,
              user: user.value.email,
              list: rt.list
            })
            await dispatch('playlist/updatePlaylist')
            $q.loading.hide()
          })
        }
      } catch (e) {
        console.error(e)
        $q.loading.hide()
      }
    }

    const fnDelete = (item) => {
      if (!user.value.admin && item.user !== user.value.email) {
        return notifyError({
          message: '스케줄을 변경할 권한이 없습니다',
          caption: '관리자에게 문의 하세요'
        })
      }
      $q.dialog({
        component: Delete,
        componentProps: { item: item }
      }).onOk(async (rt) => {
        console.log(rt)
        $q.loading.show()
        try {
          await api.get(`/api/playlist/delete?id=${rt._id}`)
          await dispatch('playlist/updatePlaylist')
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
      user,
      playlist,
      selected,
      fnClickItem,
      fnAdd,
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
