<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin"
      style="border-radius: 0.5rem; width: 600px; max-width: 800px"
    >
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#map-fill"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">폴더선택</div>
          </div>
          <div class="q-gutter-x-sm">
            <q-btn
              flat
              round
              size="md"
              color="yellow"
              icon="svguse:icons.svg#folder-fill"
              @click="fnCreateFolder"
            >
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
                >폴더생성</q-tooltip
              >
            </q-btn>
            <q-btn
              flat
              round
              size="md"
              color="red"
              icon="svguse:icons.svg#trash-fill"
              @click="fnDeleteFolder"
            >
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
                >폴더삭제</q-tooltip
              >
            </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          dense
          flat
          hide-header
          hide-bottom
          separator="none"
          :columns="[
            {
              name: 'name',
              label: 'Name',
              field: 'name',
              align: 'start',
              sortable: true
            }
          ]"
          :rows="files"
          row-key="name"
          selection="single"
          v-model:selected="selected"
          :pagination="{ rowsPerPage: 0 }"
        >
          <template #top>
            <div
              class="q-ml-md row items-center q-mt-sm q-gutter-x-xs"
            >
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
                  :label="folder"
                  @click="fnMoveFolder(index + 1)"
                />
              </q-breadcrumbs>
            </div>
          </template>

          <template #body-selection="scope">
            <q-checkbox size="xs" v-model="scope.selected" />
          </template>

          <template #body-cell-name="props">
            <q-td :props="props">
              <div>
                <span
                  class="cursor-pointer"
                  @click="fnClickItem(props.row)"
                >
                  <q-icon
                    color="yellow"
                    size="sm"
                    name="svguse:icons.svg#folder-fill"
                  ></q-icon>
                  {{ props.row.name }}
                </span>
              </div>
            </q-td>
          </template>
        </q-table>
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
            @click="onOKClick"
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

import addFolder from '@/components/dialog/files/addFolder'
import Delete from '@/components/dialog/delete'

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
    const folders = ref(['Media'])
    const selected = ref([])
    const prev = ref({
      name: 'Media',
      base: '',
      type: 'directory'
    })

    async function fnMoveFolder(idx) {
      if (idx === 0) {
        folders.value = []
        prev.value = {
          name: 'Media',
          base: '',
          type: 'directory'
        }
      } else {
        folders.value = folders.value.slice(0, idx)
      }
      await fnUpdateFolder()
    }

    const fnUpdateFolder = async () => {
      $q.loading.show()
      try {
        const r = await api.post('/api/files/getFolder', {
          folder: folders.value
        })
        files.value = r.data.files
      } catch (e) {
        $q.loading.hide()
        console.error(e.message)
      }
      $q.loading.hide()
    }

    const fnCreateFolder = () => {
      $q.dialog({
        component: addFolder,
        componentProps: { folders: folders.value }
      }).onOk(async () => {
        await fnUpdateFolder()
      })
    }

    const fnDeleteFolder = () => {
      $q.dialog({
        component: Delete,
        componentProps: { file: selected.value[0] }
      }).onOk(async (rt) => {
        await api.post('/api/files/delete', rt)
        await fnUpdateFolder()
      })
    }

    async function fnClickItem(item) {
      if (item.type === 'directory') {
        folders.value.push(item.name)
        prev.value = item
        await fnUpdateFolder()
      } else {
        selected.value = item
      }
    }

    const fnPreview = (file) => {
      dispatch('preview/openPreview', file)
    }

    const onOKClick = () => {
      console.log(selected.value)
      if (selected.value.length) {
        return onDialogOK(selected.value[0])
      }
      onDialogOK(prev.value)
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
      fnCreateFolder,
      fnDeleteFolder,
      dialogRef,
      onDialogHide,
      onOKClick,
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
