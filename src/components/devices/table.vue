<template>
  <q-table
    class="shadow-15"
    style="border-radius: 1rem"
    :columns="[
      {
        name: 'index',
        align: 'center',
        label: '인덱스',
        field: 'index',
        sortable: true
      },
      {
        name: 'name',
        align: 'center',
        label: '이름',
        field: 'name',
        sortable: true
      },
      {
        name: 'ipaddress',
        align: 'center',
        label: 'IP 주소',
        field: 'ipaddress',
        sortable: true
      },
      {
        name: 'type',
        align: 'center',
        label: '장치형태',
        field: 'devicetype',
        sortable: true
      },
      {
        name: 'mode',
        align: 'center',
        label: '동작방식',
        field: 'mode',
        sortable: true
      },
      {
        name: 'createdAt',
        align: 'center',
        label: '등록일',
        field: 'createdAt',
        sortable: true
      },
      {
        name: 'actions',
        align: 'center',
        label: 'Actions',
        field: 'actions'
      }
    ]"
    :rows="devices"
    :filter="search"
    :pagination="{ rowsPerPage: 10 }"
  >
    <template #header="props">
      <q-tr :props="props" class="gradient-red text-white">
        <q-th
          v-for="col in props.cols"
          :key="col.name"
          :props="props"
          style="font-family: 나눔고딕; font-weight: bold"
        >
          {{ col.label }}
        </q-th>
      </q-tr>
    </template>

    <template #body="props">
      <q-tr :props="props">
        <q-td key="index" :props="props">
          <q-avatar size="md">
            <q-badge
              v-if="!props.row.status"
              floating
              rounded
              size="xs"
              color="red"
            />
            {{ props.row.index }}
          </q-avatar>
        </q-td>

        <q-td key="name" :props="props">
          <div>
            {{ props.row.name }}
          </div>
        </q-td>

        <q-td key="ipaddress" :props="props">
          <div>
            <a
              :href="`http://${props.row.ipaddress}`"
              target="_blank"
            >
              {{ props.row.ipaddress }}
            </a>
          </div>
        </q-td>

        <q-td key="type" :props="props">
          <div v-if="props.row.devicetype === 'Q-Sys'" class="qsys">
            {{ props.row.devicetype }}
          </div>
          <div v-if="props.row.devicetype === 'Barix'" class="barix">
            {{ props.row.devicetype }}
          </div>
        </q-td>

        <q-td key="mode" :props="props">
          <div>
            {{ props.row.mode.toUpperCase() }}
          </div>
        </q-td>

        <q-td key="createdAt" :props="props">
          <div>
            {{ dateFormat(props.row.createdAt) }}
          </div>
        </q-td>

        <q-td key="actions" :props="props">
          <div>
            <q-btn
              flat
              round
              icon="svguse:icons.svg#refresh"
              size="sm"
              color="primary"
              @click="refreshDevice(props.row)"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
              >
                새로고침
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="svguse:icons.svg#clipboard-list"
              size="sm"
              color="grey"
              @click="detailInfo(props.row)"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
              >
                상세정보
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="svguse:icons.svg#pencil-fill"
              size="sm"
              color="green"
              @click="editItem(props.row)"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
              >
                수정
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="svguse:icons.svg#trash-fill"
              size="sm"
              color="red-10"
              @click="deleteItem(props.row)"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.6)"
                anchor="top middle"
                self="center middle"
              >
                삭제
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'

import { dateFormat } from '@/api/time'
import noti from '@/api/notify'

import Info from '@/components/dialog/devices/info'
import Add from '@/components/dialog/devices/add'
import Delete from '@/components/dialog/delete'

export default {
  setup() {
    const { state, dispatch } = useStore()
    const { notifyError } = noti()
    const $q = useQuasar()
    const devices = computed(() => state.devices.devices)
    const search = computed(() => state.devices.search)

    const refreshDevice = async (item) => {
      try {
        await api.get(
          `/api/devices/refresh?ipaddress=${item.ipaddress}&devicetype=${item.devicetype}`
        )
        dispatch('devices/getDevices')
      } catch (e) {
        console.error(e)
        notifyError({
          message: '장비 데이터를 갱신할 수 없습니다'
        })
      }
    }

    const detailInfo = (item) => {
      $q.dialog({
        component: Info,
        componentProps: { item: item }
      })
    }

    const editItem = (item) => {
      try {
        $q.dialog({
          component: Add,
          componentProps: {
            item: item
          }
        }).onOk(async () => {
          await dispatch('devices/getDevices')
        })
      } catch (e) {
        console.error(e)
        notifyError({
          message: '장비 데이터를 갱신할 수 없습니다'
        })
      }
    }

    const deleteItem = (item) => {
      $q.dialog({
        component: Delete,
        componentProps: {
          item: item
        }
      }).onOk(async (rt) => {
        $q.loading.show()
        try {
          await api.get(`/api/devices/delete?id=${rt._id}`)
          await dispatch('devices/getDevices')
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
      devices,
      search,
      dateFormat,
      refreshDevice,
      detailInfo,
      editItem,
      deleteItem
    }
  }
}
</script>
