<template>
  <q-card class="shadow-10" style="border-radius: 0.8rem">
    <q-card-section class="q-pa-none gradient-red">
      <div
        class="
          q-px-md q-py-sm
          row
          justify-between
          items-center
          text-white
        "
      >
        <div class="q-gutter-sm row items-center">
          <div>
            <q-icon
              name="svguse:icons.svg#folder-fill"
              color="yellow"
              size="md"
            />
          </div>
          <div class="name q-ml-sm" style="font-size: 1.2rem">
            폴더 선택
          </div>
        </div>
        <div class="q-ml-md row items-center q-gutter-x-xs">
          <span>/</span>
          <q-breadcrumbs
            class="q-mr-md"
            gutter="xs"
            active-color="white"
          >
            <q-breadcrumbs-el
              class="folder"
              v-for="(folder, index) in folders"
              :key="index"
              :label="folder"
              @click="fnMoveFolder(index + 1)"
            />
          </q-breadcrumbs>

          <q-separator
            vertical
            class="q-mx-md"
            style="width: 2px"
            color="grey"
          />

          <div class="row items-center">
            <q-btn
              flat
              round
              size=".7rem"
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
              class="q-mx-sm"
              flat
              round
              size=".6rem"
              icon="svguse:icons.svg#arrow-up"
              @click="fnFileUpload"
            >
              <q-tooltip
                anchor="top middle"
                self="bottom middle"
                :offset="[10, 10]"
                >파일업로드</q-tooltip
              >
            </q-btn>
          </div>
        </div>
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div>
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
          :rows="files"
          row-key="index"
          v-model:pagination="pagination"
          hide-pagination
        >
          <template #body="props">
            <q-tr
              :props="props"
              :class="
                props.row.type === 'directory' ? 'directory' : ''
              "
              @click="fnClickItem(props.row)"
            >
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
                  <q-btn
                    round
                    flat
                    icon="svguse:icons.svg#trash-fill"
                    size="sm"
                    color="red-10"
                    @click.prevent.stop="fnDelete(props.row)"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
  <div class="relative-position q-mt-md">
    <div class="row justify-center">
      <q-pagination
        v-model="pagination.page"
        :max="pagesNumber"
        direction-links
        boundary-links
      />
    </div>
    <div class="absolute-right">
      <q-select
        v-model="pagination.rowsPerPage"
        style="width: 100px"
        filled
        dense
        label="RowsPerPage"
        :options="[5, 10, 15, 20, 25, 30, 40, 50]"
      />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useQuasar, format } from 'quasar'
import { api } from '@/boot/axios'
import fileIcons from '@/api/fileIcons'

import Delete from '@/components/dialog/delete'
import addFolder from '@/components/dialog/files/addFolder'
import addFile from '@/components/dialog/files/addFile'

export default {
  setup() {
    const { dispatch } = useStore()
    const $q = useQuasar()
    const { humanStorageSize } = format
    const user = computed(() => state.user.user)
    const files = ref([])
    const folders = ref(['Media'])

    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    })

    const pagesNumber = computed(() =>
      Math.ceil(files.value.length / pagination.value.rowsPerPage)
    )

    async function fnMoveFolder(idx) {
      if (idx === 0) {
        folders.value = []
      } else {
        folders.value = folders.value.slice(0, idx)
      }
      await fnUpdateFolder()
    }

    async function fnClickItem(item) {
      if (item.type === 'directory') {
        folders.value.push(item.name)
        await fnUpdateFolder()
      }
    }

    function fnCreateFolder() {
      $q.dialog({
        component: addFolder,
        componentProps: { folders: folders.value }
      }).onOk(async () => {
        await fnUpdateFolder()
      })
    }

    function fnFileUpload() {
      $q.dialog({
        component: addFile,
        componentProps: { folders: folders.value }
      }).onOk(async () => {
        await fnUpdateFolder()
        $q.loading.hide()
      })
    }

    const fnDownload = async (file) => {
      $q.loading.show()
      api
        .post('/api/files/download', file, { responseType: 'blob' })
        .then((response) => {
          const fileURL = window.URL.createObjectURL(
            new Blob([response.data])
          )
          const fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', file.name)
          document.body.appendChild(fileLink)
          fileLink.click()
        })
        .catch((err) => {
          $q.loading.hide()
          console.error(err.response)
        })
      $q.loading.hide()
    }

    function fnDelete(item) {
      $q.dialog({
        component: Delete,
        componentProps: { file: item }
      }).onOk(async (rt) => {
        await api.post('/api/files/delete', rt)
        await fnUpdateFolder()
      })
    }

    async function fnUpdateFolder() {
      const r = await api.post('/api/files/get', {
        folder: folders.value
      })
      files.value = r.data.files.sort(function (a, b) {
        if (a.type === 'directory') {
          return -1
        }
      })
    }

    const fnPreview = (file) => {
      dispatch('preview/openPreview', file)
    }

    onMounted(async () => {
      await fnUpdateFolder()
    })

    return {
      fileIcons,
      pagination,
      pagesNumber,
      user,
      fnPreview,
      fnMoveFolder,
      fnClickItem,
      fnCreateFolder,
      fnFileUpload,
      fnDelete,
      fnDownload,
      folders,
      files,
      humanStorageSize
    }
  }
}
</script>

<style scoped>
.foler {
  background: transparent;
  color: #fff;
}
.folder:hover {
  color: yellow;
  cursor: pointer;
}
.directory:hover {
  cursor: pointer;
}
</style>
