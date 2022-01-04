<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dialog-plugin"
      style="width: 800px; max-width: 1200px; border-radius: 0.5rem"
    >
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
        <q-table
          flat
          :columns="[
            {
              name: 'type',
              align: 'center',
              label: 'Type',
              field: 'type',
              sortable: true
            },
            {
              name: 'name',
              align: 'center',
              label: 'Name',
              field: 'name',
              sortable: true
            },
            {
              name: 'size',
              align: 'center',
              label: 'Size',
              field: 'size',
              sortable: true
            },
            { name: 'actions', align: 'center', label: 'Actions' }
          ]"
          :selection="selection"
          v-model:selected="selected"
          :rows="files"
          row-key="index"
        >
          <template v-slot:header-selection> </template>
          <template #body="props">
            <q-tr
              :props="props"
              :class="
                props.row.type === 'directory' ? 'directory' : ''
              "
              @click="fnClickItem(props.row)"
            >
              <q-td>
                <q-checkbox
                  :disable="props.row.type === 'directory'"
                  v-model="props.selected"
                />
              </q-td>

              <q-td :props="props" key="type">
                <div>
                  <q-icon
                    :name="fileIcons(props.row.type).icon"
                    :color="fileIcons(props.row.type).color"
                    size="sm"
                  />
                  <span class="q-ml-xs">{{
                    props.row.type.charAt(0).toUpperCase() +
                    props.row.type.slice(1)
                  }}</span>
                </div>
              </q-td>

              <q-td :props="props" key="name">
                {{ props.row.name }}
              </q-td>

              <q-td :props="props" key="size">
                <div v-if="props.row.size">
                  {{ humanStorageSize(props.row.size) }}
                </div>
              </q-td>

              <q-td :props="props" key="actions">
                <div>
                  <q-btn
                    v-if="props.row.type !== 'directory'"
                    round
                    flat
                    icon="svguse:icons.svg#save"
                    size="sm"
                    color="grey"
                    @click.prevent.stop="fnDownload(props.row)"
                  />
                  <q-btn
                    v-if="
                      props.row.type === 'audio' ||
                      props.row.type === 'video'
                    "
                    round
                    flat
                    icon="svguse:icons.svg#play"
                    size="sm"
                    color="green"
                    @click.prevent.stop="fnPreview(props.row)"
                  />
                </div>
              </q-td>
            </q-tr>
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
            @click="onOKClick(selected)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useQuasar, format, useDialogPluginComponent } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { api } from '@/boot/axios'
import fileIcons from '@/api/fileIcons'

export default {
  props: {
    selection: String
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, dispatch } = useStore()
    const $q = useQuasar()
    const { humanStorageSize } = format
    const user = computed(() => state.user.user)
    const files = ref([])
    const folders = ref(['media'])
    const selected = ref([])

    async function fnMoveFolder(idx) {
      if (idx === 0) {
        folders.value = []
      } else {
        folders.value = folders.value.slice(0, idx)
      }
      selected.value = []
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
      }
    }

    const fnDbClickItem = async (item) => {
      if (item.type === 'directory') {
        folders.value.push(item.name)
        await fnUpdateFolder()
      } else {
        selected.value = item
        onDialogOK(item)
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
      humanStorageSize,
      fileIcons,
      fnUpdateFolder,
      fnMoveFolder,
      fnPreview,
      fnClickItem,
      fnDbClickItem,
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
