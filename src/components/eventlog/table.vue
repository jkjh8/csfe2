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
          name: 'priority',
          align: 'center',
          label: '중요도',
          field: 'priority'
        },
        {
          name: 'source',
          align: 'center',
          label: '출처',
          field: 'source'
        },
        {
          name: 'id',
          align: 'center',
          label: '코드',
          field: 'id'
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
            style="
              max-width: 400px;
              font-family: 나눔고딕;
              font-weight: bold;
            "
          >
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template #body="props">
        <q-tr
          :props="props"
          :class="props.row.priority === 'error' ? 'text-red' : ''"
        >
          <q-td key="createdAt" :props="props">
            <div>
              {{ fnDateFormat(props.row.createdAt) }}
            </div>
          </q-td>

          <q-td key="priority" :props="props">
            <div
              v-if="props.row.priority === 'info'"
              class="text-primary"
            >
              {{
                props.row.priority.charAt(0).toUpperCase() +
                props.row.priority.slice(1)
              }}
            </div>

            <div
              v-else-if="props.row.priority === 'warning'"
              class="text-yellow"
            >
              {{
                props.row.priority.charAt(0).toUpperCase() +
                props.row.priority.slice(1)
              }}
            </div>

            <div v-else class="text-red">
              {{
                props.row.priority.charAt(0).toUpperCase() +
                props.row.priority.slice(1)
              }}
            </div>
          </q-td>

          <q-td key="source" :props="props">
            <div>
              {{ props.row.source }}
            </div>
          </q-td>

          <q-td key="id" :props="props" style="width: 80px">
            <div
              style="
                width: 100%;
                max-width: 200px;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ props.row.id }}
              <q-tooltip
                :delay="1000"
                anchor="center right"
                :offset="[-30, 10]"
                max-width="18rem"
                max-height="16rem"
                style="background: rgba(100, 100, 50, 0.8)"
              >
                {{ props.row.id }}
              </q-tooltip>
            </div>
          </q-td>

          <q-td key="zones" :props="props" style="max-width: 100px">
            <div class="hiddenText">
              {{ props.row.zones.map((e) => e.name).join(', ') }}
              <q-popup-proxy
                style="
                  width: 300px;
                  background: rgba(255, 255, 255, 0.8);
                "
              >
                <q-scroll-area
                  style="
                    height: 200px;
                    min-height: 100px;
                    max-height: 300px;
                  "
                >
                  <q-tree :nodes="props.row.zones" node-key="_id">
                    <template #default-header="props">
                      <div>
                        <q-icon
                          name="svguse:color.svg#map1"
                          size=".8rem"
                        />
                        <span class="q-ml-sm">{{
                          props.node.name
                        }}</span>
                      </div>
                    </template>
                  </q-tree>
                </q-scroll-area>
              </q-popup-proxy>
            </div>
          </q-td>

          <q-td key="message" :props="props" style="max-width: 400px">
            <div
              style="
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
              "
            >
              {{ props.row.message }}
            </div>
            <q-tooltip
              :delay="1000"
              anchor="center right"
              :offset="[-30, 10]"
              max-width="18rem"
              max-height="16rem"
              style="background: rgba(100, 100, 50, 0.8)"
            >
              {{ props.row.message }}
            </q-tooltip>
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
