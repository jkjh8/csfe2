<template>
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
    row-key="_id"
    :filter="search"
    v-model:pagination="pagination"
    hide-pagination
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
            v-if="props.row.mode === 'Playlist'"
            class="q-gutter-x-sm"
            style="
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            <span>
              <q-icon
                name="svguse:icons.svg#clipboard-list"
                color="yellow-8"
              />
            </span>
            <span>
              {{ props.row.playlist.name }}
              <q-tooltip style="background: rgba(0, 0, 0, 0.5)">
                {{ props.row.playlist.name }}
              </q-tooltip>
            </span>
          </div>
          <div
            v-else
            class="q-gutter-x-sm"
            style="
              width: 100%;
              overflow: hidden;
              text-overflow: ellipsis;
            "
          >
            <span>
              <q-icon name="svguse:icons.svg#file" color="primary" />
            </span>
            <span>
              {{ props.row.file.name }}
            </span>
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
              color="red-10"
              icon="svguse:icons.svg#trash-fill"
              @click="fnDelete(props.row)"
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
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import notify from '@/api/notify'

import addSchedule from '@/components/dialog/broadcast/addSchedule'
import dlDelete from '@/components/dialog/delete'

export default {
  setup() {
    const { state, dispatch } = useStore()
    const { notifyInfo, notifyError } = notify()
    const $q = useQuasar()

    const schedules = computed(() => state.schedules.schedules)
    const user = computed(() => state.user.user)
    const search = computed(() => state.schedules.search)
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 10
    })

    const pagesNumber = computed(() =>
      Math.ceil(schedules.value.length / pagination.value.rowsPerPage)
    )

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
      if (item.user !== user.value.email && !user.value.admin) {
        return notifyError({
          message: '해당 스케줄에 대한 권한이 없습니다',
          caption: '관라자에게 문의 하세요.'
        })
      }

      $q.dialog({
        component: addSchedule,
        componentProps: { schedule: item }
      }).onOk(async () => {
        dispatch('schedules/updateSchedules')
      })
    }

    const fnDelete = (item) => {
      if (item.user !== user.value.email && !user.value.admin) {
        return notifyError({
          message: '해당 스케줄에 대한 권한이 없습니다',
          caption: '관라자에게 문의 하세요.'
        })
      }

      $q.dialog({
        component: dlDelete,
        componentProps: { message: '현재 스케줄을 삭제하시겠습니까?' }
      }).onOk(async () => {
        if (item && item._id) {
          await api.get(
            `/api/broadcast/schedule/delete?id=${item._id}`
          )
        }
        dispatch('schedules/updateSchedules')
      })
    }

    return {
      pagination,
      pagesNumber,
      schedules,
      user,
      search,
      fnActive,
      fnEdit,
      fnDelete
    }
  }
}
</script>
