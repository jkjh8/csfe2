<template>
  <q-card class="shadow-10" style="border-radius: 0.8rem">
    <q-card-section class="q-pa-none gradient-red">
      <div class="q-pa-md row justify-between items-center text-white">
        <div class="q-gutter-sm row items-center">
          <div>
            <q-icon
              name="svguse:icons.svg#folder-fill"
              color="yellow"
              size="md"
            />
          </div>
          <div class="name q-ml-sm" style="font-size: 1.2rem">Folder</div>
        </div>
        <div class="q-ml-md row items-center q-gutter-sm">
          <span>/</span>
          <q-breadcrumbs class="q-mr-md" gutter="xs" active-color="white">
            <q-breadcrumbs-el
              class="folder"
              v-for="(folder, index) in folders"
              :key="index"
              :label="folder.toUpperCase()"
              @click="fnMoveFolder(index + 1)"
            />
          </q-breadcrumbs>

          <div>
            <q-btn flat round size="sm" @click="fnCreateFolder">
              <q-icon name="svguse:icons.svg#plus-circle-fill" />
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
          :pagination="{ rowsPerPage: 0 }"
        >
          <template #body="props">
            <q-tr
              :props="props"
              :class="props.row.type === 'directory' ? 'directory' : ''"
              @click="fnClickFolder(props.row)"
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
                    v-if="
                      props.row.type === 'audio' || props.row.type === 'video'
                    "
                    round
                    flat
                    icon="svguse:icons.svg#play"
                    size="sm"
                    color="blue"
                  />
                  <q-btn
                    round
                    flat
                    icon="svguse:icons.svg#trash-fill"
                    size="sm"
                    color="red"
                  />
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, format } from 'quasar'
import { api } from '@/boot/axios'
import fileIcons from '@/api/fileIcons'

import addFolder from '@/components/dialog/files/addFolder'

export default {
  setup() {
    const $q = useQuasar()
    const { humanStorageSize } = format
    const user = computed(() => state.user.user)
    const files = ref([])
    const folders = ref(['media'])

    async function fnMoveFolder(idx) {
      console.log(idx)
      if (idx === 0) {
        folders.value = []
      } else {
        folders.value = folders.value.slice(0, idx)
      }
      await fnUpdateFolder()
    }

    async function fnClickFolder(row) {
      folders.value.push(row.name)
      await fnUpdateFolder()
    }

    function fnCreateFolder() {
      $q.dialog({
        component: addFolder,
        componentProps: { folders: folders.value }
      })
    }

    async function fnUpdateFolder() {
      const r = await api.post('/api/files/get', { folder: folders.value })
      files.value = r.data.files.sort(function (a, b) {
        if (a.type === 'directory') {
          return -1
        }
      })
    }

    onMounted(async () => {
      await fnUpdateFolder()
    })

    return {
      fileIcons,
      user,
      fnMoveFolder,
      fnClickFolder,
      fnCreateFolder,
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
