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
        name: 'start',
        label: '시작시간',
        field: 'start',
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
        name: 'mode',
        label: '모드',
        field: 'mode',
        sortable: true,
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
  ></q-table>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const { state } = useStore()

    const schedules = computed(() => state.schedules.schedules)

    return {
      schedules
    }
  }
}
</script>
