<template>
  <div class="q-gutter-y-md q-mt-md">
    <div>
      <navigation-bar
        :selected-date="selectedDate"
        @today="onToday"
        @prev="onPrev"
        @next="onNext"
      />
    </div>
    <div>
      <QCalendarMonth
        ref="calendar"
        class="shadow-15"
        style="border-radius: 0.5rem"
        v-model="selectedDate"
        :day-min-height="80"
        :locale="locale"
        :weekdays="[1, 2, 3, 4, 5, 6, 0]"
        animated
        bordered
        month-label-size="xs"
        no-outside-days
      ></QCalendarMonth>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue'

import {
  QCalendarMonth,
  today
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'

import NavigationBar from './navigationBar.vue'

export default defineComponent({
  components: { NavigationBar, QCalendarMonth },
  setup() {
    const calendar = ref(null)
    const locale = ref('ko-KR')
    const selectedDate = ref(today())
    const selectedMonth = reactive([])
    const month = ref(new Date().getMonth() + 1)
    const year = ref(new Date().getFullYear())

    const onToday = () => {
      calendar.value.moveToToday()
    }
    const onPrev = () => {
      calendar.value.prev()
    }
    const onNext = () => {
      calendar.value.next()
    }

    return {
      calendar,
      locale,
      selectedDate,
      selectedMonth,
      month,
      year,
      onToday,
      onPrev,
      onNext
    }
  }
})
</script>
