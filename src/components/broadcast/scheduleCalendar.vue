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
        @change="onChange"
      >
        <template #day="{ scope: { timestamp } }">
          <template
            v-for="event in events[timestamp.date]"
            :key="event.id"
          >
            <div :style="getStyle(event)" class="my-event">
              <div class="title q-calendar__ellipsis">
                {{ event.name }}
              </div>
            </div>
          </template>
        </template>
      </QCalendarMonth>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  ref,
  reactive,
  computed,
  onMounted
} from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import pickColor from '@/api/pickColor'

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
    const { state, dispatch } = useStore()
    const $q = useQuasar()

    const calendar = ref(null)
    const locale = ref('ko-KR')
    const selectedDate = ref(today())
    const selectedMonth = reactive([])
    const month = ref(new Date().getMonth() + 1)
    const year = ref(new Date().getFullYear())

    const schedules = computed(() => state.schedules.schedules)
    const events = computed(() => {
      const mapSchedule = []
      const map = {}

      selectedMonth.forEach((day) => {
        if (day.month == month.value) {
          map[day.date] = []
          schedules.value.forEach((schedule) => {
            if (schedule.repeat === '매일') {
              mapSchedule.push({
                ...schedule,
                date: day.date
              })
              map[day.date].push(schedule)
            } else if (schedule.repeat === '매주') {
              schedule.week.forEach((week) => {
                if (new Date(day.date).getDay() == week.value) {
                  mapSchedule.push({
                    ...schedule,
                    date: day.date
                  })
                  map[day.date].push(schedule)
                }
              })
            } else if (
              schedule.repeat === '한번' &&
              day.date == schedule.date
            ) {
              mapSchedule.push({
                ...schedule,
                date: day.date
              })
              map[day.date].push(schedule)
            }
          })
        }
      })
      return map
    })

    const onToday = () => {
      calendar.value.moveToToday()
    }
    const onPrev = () => {
      calendar.value.prev()
    }
    const onNext = () => {
      calendar.value.next()
    }

    const onChange = (data) => {
      selectedMonth.splice(0, selectedMonth.length, ...data.days)
      for (let i = 0; i < selectedMonth.length; i++) {
        if (selectedMonth[i].day == 1) {
          year.value = selectedMonth[i].year
          month.value = selectedMonth[i].month
          break
        }
      }
    }

    const getStyle = (event) => {
      if (event.active) {
        return {
          background: event.color,
          color: pickColor(event.color)
        }
      } else {
        return {
          background: '#eee',
          color: '#aaa'
        }
      }
    }

    onMounted(async () => {
      $q.loading.show()
      try {
        await dispatch('schedules/updateSchedules')
      } catch (e) {
        console.error(e.message)
      }
      $q.loading.hide()
    })

    return {
      calendar,
      locale,
      selectedDate,
      selectedMonth,
      month,
      year,
      events,
      onChange,
      onToday,
      onPrev,
      onNext,
      getStyle
    }
  }
})
</script>

<style>
.q-calendar-month__day.q-current-day .q-calendar__button {
  border: none;
}
.my-event {
  position: relative;
  font-size: 10px;
  width: 100%;
  margin: 1px 0 0 0;
  justify-content: center;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;
}

.title {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.popup-card {
  min-width: 250px;
  border-radius: 0.5rem;
  font-size: 0.8rem;
}
.rounded-border {
  border-radius: 2px;
}
</style>
