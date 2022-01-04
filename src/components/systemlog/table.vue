<template>
  <div
    class="shadow-15"
    style="border-radius: 0.5rem; overflow: hidden"
  >
    <q-table
      :columns="[
        {
          name: 'timestamp',
          align: 'center',
          label: '시간',
          field: 'timestamp'
        },
        {
          name: 'level',
          align: 'center',
          label: '중요도',
          field: 'level'
        },
        {
          name: 'message',
          align: 'center',
          label: '메세지',
          field: 'message'
        }
      ]"
      :rows="systemlog.docs"
      :pagination="{ rowsPerPage: 0 }"
      hide-pagination
    >
      <template #header="props">
        <q-tr :props="props" class="gradient-green text-grey-10">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            style="font-family: 나눔고딕; font-weight: 700"
            >{{ col.label }}</q-th
          >
        </q-tr>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          :class="props.row.level === 'error' ? 'text-red' : ''"
        >
          <q-td key="timestamp" :props="props">
            <div>
              {{ fnDateFormat(props.value) }}
            </div>
          </q-td>

          <q-td key="level" :props="props">
            <div
              v-if="props.row.level === 'info'"
              class="text-primary"
            >
              {{
                props.row.level.charAt(0).toUpperCase() +
                props.row.level.slice(1)
              }}
            </div>

            <div
              v-else-if="props.row.level === 'warn'"
              class="text-yellow"
            >
              {{
                props.row.level.charAt(0).toUpperCase() +
                props.row.level.slice(1)
              }}
            </div>

            <div v-else class="text-red">
              {{
                props.row.level.charAt(0).toUpperCase() +
                props.row.level.slice(1)
              }}
            </div>
          </q-td>

          <q-td key="message" :props="props" style="max-width: 500px">
            <div class="hiddenText">
              {{ props.row.message }}
            </div>
            <q-popup-proxy
              style="
                background: rgba(10, 20, 10, 0.8);
                color: white;
                word-break: break-all;
              "
            >
              <div class="q-pa-md">
                {{ props.row.message }}
              </div>
            </q-popup-proxy>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>

  <div style="margin: 10px 0">
    <q-pagination
      class="pagination"
      ref="pagination"
      v-model="page"
      :max="systemlog.totalPages"
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

    const systemlog = computed(() => state.systemlog.log)
    const pagination = ref(null)
    const page = computed({
      get() {
        return state.systemlog.log.page
      },
      set(value) {
        return commit('systemlog/page', value)
      }
    })

    const rowsPerPage = computed({
      get() {
        return state.systemlog.log.limit
      },
      set(value) {
        commit('systemlog/rowsPerPage', value)
        return dispatch('systemlog/getSystemlogs')
      }
    })

    const users = computed(() => state.users.users)

    function fnDateFormat(date) {
      return moment(date).format('YYYY-MM-DD hh:mm:ss')
    }

    async function fnPageChange() {
      $q.loading.show()
      try {
        await dispatch('systemlog/getSystemlogs')
      } catch (e) {
        console.error(e)
      }
      $q.loading.hide()
    }

    return {
      systemlog,
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
.hiddenText {
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1rem;
  max-height: 2rem;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
