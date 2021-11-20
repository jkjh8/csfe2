<template>
  <div
    class="shadow-10"
    style="border-radius: 0.5rem; overflow: hidden"
  >
    <q-table
      :columns="[
        {
          name: 'createdAt',
          align: 'center',
          label: '시간',
          field: 'createdAt'
        },
        {
          name: 'category',
          align: 'center',
          label: '중요도',
          field: 'category'
        },
        {
          name: 'zones',
          align: 'center',
          label: '지역',
          field: 'zones'
        },
        {
          name: 'message',
          align: 'center',
          label: '메세지',
          field: 'message'
        }
      ]"
      :rows="eventlog.docs"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
    >
      <template #header="props">
        <q-tr :props="props" class="gradient-red text-white">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="font-family: 나눔고딕; font-weight: bold"
            >{{ col.label }}</q-th
          >
        </q-tr>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          <div>
            {{ fnDateFormat(props.value) }}
          </div>
        </q-td>
      </template>
    </q-table>
  </div>

  <div style="margin: 10px 0">
    <q-pagination
      class="pagination"
      ref="pagination"
      v-model="page"
      :max="eventlog.totalPages"
      direction-links
      :max-pages="$q.screen.gt.md ? 7 : 3"
      @update:model-value="fnPageChange"
    />

    <div class="page-select row items-center">
      <q-select
        v-model="rowsPerPage"
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
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
// import { api } from '@/boot/axios'
import moment from 'moment'

export default {
  setup() {
    const { state, commit, dispatch } = useStore()
    const $q = useQuasar()

    const eventlog = computed(() => state.eventlog.eventlog)
    const pagination = ref(null)
    const page = computed({
      get() {
        return state.eventlog.eventlog.page
      },
      set(value) {
        return commit('eventlog/page', value)
      }
    })

    const rowsPerPage = computed({
      get() {
        return state.eventlog.eventlog.limit
      },
      set(value) {
        commit('eventlog/rowsPerPage', value)
        return dispatch('eventlog/getEventlogs')
      }
    })

    const users = computed(() => state.users.users)

    function fnDateFormat(date) {
      return moment(date).format('YYYY-MM-DD hh:mm:ss')
    }

    async function fnPageChange() {
      $q.loading.show()
      try {
        await dispatch('eventlog/getEventlogs')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
    }

    return {
      eventlog,
      pagination,
      page,
      rowsPerPage,
      users,
      fnDateFormat,
      fnPageChange
    }
  }
}
</script>

<style scoped>
.pagination {
  position: absolute;
  margin-top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}
.page-select {
  position: absolute;
  right: 10%;
  margin-top: 0.7rem;
}
</style>
