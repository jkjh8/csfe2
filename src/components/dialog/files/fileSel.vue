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
            <div class="name" style="font-size: 1.2rem">파일선택</div>
          </div>

          <div class="q-ml-md row items-center q-gutter-x-xs">
            <span>/</span>
            <q-breadcrumbs
              class="q-mr-md cursor-pointer"
              gutter="xs"
              active-color="blue"
            >
              <q-breadcrumbs-el
                class="cursor-pointer text-blue-10"
                v-for="(folder, index) in folders"
                :key="index"
                :label="folder.toUpperCase()"
                @click="fnMoveFolder(index + 1)"
              />
            </q-breadcrumbs>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 320px">
          <q-list class="q-py-md">
            <q-item
              v-for="file in files"
              :key="file.idx"
              dense
              clickable
              v-ripple
              :active="selected === file"
              @click="fnClickItem(file)"
              active-class="selected"
            >
              <q-item-section avatar>
                <q-icon
                  v-if="file.type === 'directory'"
                  name="svguse:icons.svg#folder-fill"
                  color="yellow"
                />
                <q-icon
                  v-else-if="file.type === 'video'"
                  name="svguse:icons.svg#video-camera-fill"
                  color="primary"
                />
                <q-icon
                  v-else-if="file.type === 'audio'"
                  name="svguse:icons.svg#music-note-fill"
                  color="teal"
                />
                <q-icon
                  v-else
                  name="svguse:icons.svg#file"
                  color="grey"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ file.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  v-if="file.type !== 'directory'"
                  round
                  flat
                  icon="svguse:icons.svg#play"
                  color="green-7"
                  size="sm"
                  @click.prevent.stop="fnPreview(file)"
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
import { api } from '@/boot/axios'

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
    const files = ref([])
    const folders = ref(['media'])
    const selected = ref(null)

    async function fnMoveFolder(idx) {
      if (idx === 0) {
        folders.value = []
      } else {
        folders.value = folders.value.slice(0, idx)
      }
      await fnUpdateFolder()
    }

    async function fnUpdateFolder() {
      $q.loading.show()
      try {
        const r = await api.post('/api/files/get', {
          folder: folders.value
        })
        files.value = r.data.files.sort(function (a, b) {
          if (a.type === 'directory') {
            return -1
          }
        })
      } catch (e) {
        $q.loading.hide()
        console.error(e.message)
      }
      $q.loading.hide()
    }

    async function fnClickItem(item) {
      if (item.type === 'directory') {
        folders.value.push(item.name)
        await fnUpdateFolder()
      } else {
        selected.value = item
      }
    }

    const fnPreview = (file) => {
      dispatch('preview/openPreview', file)
    }

    onMounted(async () => {
      await fnUpdateFolder()
    })

    return {
      user,
      files,
      folders,
      selected,
      fnUpdateFolder,
      fnMoveFolder,
      fnPreview,
      fnClickItem,
      dialogRef,
      onDialogHide,
      onOKClick(file) {
        onDialogOK(file)
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
