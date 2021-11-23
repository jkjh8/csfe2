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
              icon="svguse:icons.svg#clipboard-list"
              size="sm"
              color="grey"
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
import moment from 'moment'

export default {
  setup() {
    const { state } = useStore()
    const devices = computed(() => state.devices.devices)
    const search = computed(() => state.devices.search)

    const dateFormat = (date) => {
      return moment(date).format('YYYY-MM-DD hh:mm:ss')
    }

    return {
      devices,
      search,
      dateFormat
    }
  }
}
</script>
