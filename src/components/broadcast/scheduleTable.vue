<template>
  <div class="row justify-end q-mb-sm">
    <q-input v-model="search" dense filled label="검색">
      <template #append> <q-icon name="search" /> </template>
    </q-input>
  </div>
  <q-table
    style="border-radius: 0.5rem"
    class="shadow-15"
    :columns="[
      {
        name: 'repeat',
        label: '반복',
        field: 'repeat',
        sortable: true,
        align: 'center'
      },
      {
        name: 'time',
        label: '시간',
        field: 'time',
        sortable: true,
        align: 'center'
      },
      {
        name: 'name',
        label: '예약명',
        field: 'name',
        sortable: true,
        align: 'center'
      },
      {
        name: 'user',
        label: '사용자',
        field: 'user',
        align: 'center'
      },
      {
        name: 'file',
        label: '재생파일',
        field: 'file',
        align: 'center'
      },
      {
        name: 'active',
        label: '동작',
        field: 'active',
        sortable: true,
        align: 'center'
      },
      { name: 'actions', label: '기능', align: 'center' }
    ]"
    :rows="schedules"
    :filter="search"
  >
    <template #body="props">
      <q-tr :props="props">
        <!-- 반복 -->
        <q-td key="repeat" :props="props">
          {{ props.row.repeat }}
        </q-td>

        <!-- 시작시간 -->
        <q-td key="time" :props="props">
          <div v-if="props.row.repeat === '매일'">
            {{ props.row.time }}
          </div>
          <div v-else-if="props.row.repeat === '한번'">
            <div>
              {{ props.row.date }}
            </div>
            <div>
              {{ props.row.time }}
            </div>
          </div>
          <div v-else-if="props.row.repeat === '매주'">
            <div>
              {{ props.row.week.map((e) => e.label).join(',') }}
            </div>
            <div>
              {{ props.row.time }}
            </div>
          </div>
        </q-td>

        <!-- 이름 -->
        <q-td key="name" :props="props">
          <div>
            {{ props.row.name }}
            <q-tooltip style="background: rgba(0, 0, 0, 0.5)">
              {{
                props.row.description
                  ? props.row.description
                  : props.row.name
              }}
            </q-tooltip>
          </div>
        </q-td>

        <q-td key="user" :props="props">
          <div>
            {{ props.row.user }}
          </div>
        </q-td>

        <!-- 파일 -->
        <q-td key="file" :props="props" style="max-width: 200px">
          <div
            style="
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            {{ props.row.file.name }}
            <q-tooltip style="background: rgba(0, 0, 0, 0.5)">
              {{ props.row.file.name }}
            </q-tooltip>
          </div>
        </q-td>

        <!-- 동작상태 -->
        <q-td key="active" :props="props">
          <div>
            <q-btn
              flat
              round
              size="sm"
              :color="props.row.active ? 'green' : 'red'"
              :icon="
                props.row.active
                  ? 'svguse:icons.svg#check-circle'
                  : 'svguse:icons.svg#ban'
              "
              @click="fnActive(props.row)"
            >
              <q-tooltip
                style="background: rgba(0, 0, 0, 0.5)"
                anchor="top middle"
                self="center middle"
              >
                동작상태
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>

        <!-- function -->
        <q-td key="actions" :props="props">
          <div class="q-gutter-x-sm">
            <q-btn
              round
              flat
              size="sm"
              color="green"
              icon="svguse:icons.svg#pencil-fill"
              @click="fnEdit(props.row)"
            >
              <q-tooltip
                style="background: rgba(50, 50, 50, 0.5)"
                anchor="top middle"
                self="center middle"
              >
                수정
              </q-tooltip>
            </q-btn>
            <q-btn
              round
              flat
              size="sm"
              color="red"
              icon="svguse:icons.svg#trash-fill"
            >
              <q-tooltip
                style="background: rgb(50, 50, 50, 0.5)"
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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import addSchedule from '@/components/dialog/broadcast/addSchedule'

export default {
  setup() {
    const { state, dispatch } = useStore()
    const { notifyInfo, notifyError } = notify()
    const $q = useQuasar()

    const pagenation = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    })

    const schedules = computed(() => state.schedules.schedules)
    const user = computed(() => state.user.user)

    const search = ref('')

    const fnActive = async (item) => {
      if (item.user !== user.value.email && !user.value.admin) {
        return notifyError({
          message: '해당 스케줄에 대한 권한이 없습니다',
          caption: '관라자에게 문의 하세요.'
        })
      }
      await dispatch('schedules/changeActive', item)
      notifyInfo({
        message: '해당 스케줄의 동작 상태가 변경되었습니다'
      })
    }

    const fnEdit = async (item) => {
      $q.dialog({
        component: addSchedule,
        componentProps: { schedule: item }
      }).onOk(async (rt) => {
        dispatch('schedules/updateSchedules')
      })
    }

    return {
      schedules,
      user,
      search,
      fnActive,
      fnEdit
    }
  }
}
</script>
