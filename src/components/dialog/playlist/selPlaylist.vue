<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#clipboard-list"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">
              플레이 리스트 선택
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 320px">
          <q-list class="q-py-md">
            <q-item
              v-for="(item, index) in playlist"
              :key="index"
              dense
              clickable
              v-ripple
              :active="selected === item"
              @click="fnClickItem(item)"
              @dblclick="fnDbClickItem(item)"
              active-class="selected"
            >
              <q-item-section avatar>
                <q-icon
                  name="svguse:icons.svg#clipboard-list"
                  color="primary"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ item.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  round
                  flat
                  icon="svguse:icons.svg#menu"
                  color="green-7"
                  size="sm"
                  @click="fnShowInfo(item)"
                />
              </q-item-section>
            </q-item>
          </q-list>
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
            @click="onOKClick(selected)"
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
import PlaylistView from '@/components/dialog/playlist/viewer'
export default {
  props: {
    zones: Array
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, dispatch } = useStore()
    const $q = useQuasar()

    const user = computed(() => state.user.user)
    const playlist = computed(() => state.playlist.playlist)
    const selected = ref(null)

    const fnClickItem = (item) => {
      selected.value = item
    }

    const fnDbClickItem = (item) => {
      onDialogOK(item)
    }

    const fnShowInfo = (item) => {
      $q.dialog({
        component: PlaylistView,
        componentProps: { item: item }
      })
    }

    onMounted(() => {
      dispatch('playlist/updatePlaylist')
    })

    return {
      user,
      selected,
      playlist,
      fnClickItem,
      fnDbClickItem,
      fnShowInfo,
      dialogRef,
      onDialogHide,
      onOKClick(item) {
        onDialogOK(item)
      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.selected {
  background: #eee;
  color: black;
}
</style>
