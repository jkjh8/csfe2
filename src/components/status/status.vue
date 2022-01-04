<template>
  <q-card class="shadow-15" style="border-radius: 0.5rem">
    <q-card-section class="q-pa-none gradient-green">
      <div
        class="
          q-px-md q-py-sm
          row
          no-wrap
          justify-between
          items-center
        "
      >
        <div
          class="q-ml-sm q-my-xs text-black name"
          style="font-size: 1rem"
        >
          <span>
            <q-icon name="svguse:icons.svg#server-fill"></q-icon>
          </span>
          <span> 서버 상태 </span>
        </div>
        <div>
          <q-btn
            round
            flat
            icon="svguse:icons.svg#refresh"
            size="sm"
            @click="refresh"
          >
            <q-tooltip>상태갱신</q-tooltip>
          </q-btn>
        </div>
      </div>
    </q-card-section>

    <q-card-section>
      <div class="q-mx-sm">
        <q-list>
          <q-item>
            <q-item-section>
              <q-item-label>
                현제 동작 시간은 {{ dhms(status.uptime) }} 입니다.
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 메모리 사용량</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{
                  humanStorageSize(status.totalmem - status.freemem)
                }}
                /
                {{ humanStorageSize(Number(status.totalmem)) }}
              </q-item-label>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section>
              <q-item-label> 디스크 사용량</q-item-label>
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{
                  humanStorageSize(status.totaldisk - status.freedisk)
                }}
                /
                {{ humanStorageSize(Number(status.totaldisk)) }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-btn
                round
                flat
                size="sm"
                icon="svguse:icons.svg#trash-fill"
                color="red"
                @click="fnTempDelete"
              >
                <q-tooltip> 임시파일삭제 </q-tooltip>
              </q-btn>
            </q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { reactive, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useQuasar, format } from 'quasar'
import { api } from '@/boot/axios'
import { dhms } from '@/api/time'

import dlDelete from '@/components/dialog/delete'

export default {
  setup() {
    const { state } = useStore()
    const { humanStorageSize } = format
    const $q = useQuasar()
    const user = computed(() => state.user.user)
    const status = reactive({})

    const fnTempDelete = () => {
      $q.dialog({
        component: dlDelete,
        componentProps: { message: '임시 파일을 삭제 하시겠습니까?' }
      }).onOk(async () => {
        await api.get('/api/files/deleteTempFolder')
        await refresh()
      })
    }

    const refresh = async () => {
      const r = await api.get('/api/status')
      Object.assign(status, r.data)
      console.log(status)
    }

    onBeforeMount(async () => {
      await refresh()
    })

    return {
      user,
      dhms,
      status,
      refresh,
      fnTempDelete,
      humanStorageSize
    }
  }
}
</script>
