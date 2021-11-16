<template>
  <div class="shadow-10" style="border-radius: 0.5rem; overflow: hidden">
    <q-table
      :columns="[
        { name: 'email', align: 'center', label: '이메일', field: 'email' },
        {
          name: 'name',
          align: 'center',
          label: '사용자이름',
          field: 'userName'
        },
        {
          name: 'userLevel',
          align: 'center',
          label: '사용자등급',
          field: 'userLevel'
        },
        { name: 'admin', align: 'center', label: '관리자', field: 'admin' },
        { name: 'auth', align: 'center', label: ' 지역권한', field: 'auth' },
        {
          name: 'nomberOfLogin',
          align: 'center',
          label: '로그인횟수',
          field: 'numberOfLogin'
        },
        {
          name: 'createdAt',
          align: 'center',
          label: '가입일',
          field: 'createdAt'
        },
        {
          name: 'updatedAt',
          align: 'center',
          label: '수정일',
          field: 'updatedAt'
        },
        {
          name: 'loginAt',
          align: 'center',
          label: '최종로그인',
          field: 'loginAt'
        },
        {
          name: 'actions',
          align: 'center',
          label: 'Actions',
          field: 'actions'
        }
      ]"
      :rows="users"
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

      <template #body-cell-userLevel="props">
        <q-td :props="props">
          <div>
            <q-btn
              round
              flat
              :label="props.value"
              @click="fnEditLevel(props.row)"
            />
          </div>
        </q-td>
      </template>
      <template #body-cell-admin="props">
        <q-td :props="props">
          <div>
            <q-btn
              :icon="
                props.value
                  ? 'svguse:icons.svg#check-circle'
                  : 'svguse:icons.svg#ban'
              "
              size="sm"
              :color="props.value ? 'green-8' : 'red'"
              round
              flat
              @click="fnEditAdmin(props.row)"
            />
          </div>
        </q-td>
      </template>

      <template #body-cell-createdAt="props">
        <q-td :props="props">
          <div>
            {{ fnDateFormat(props.value).date }}
          </div>
          <div>
            {{ fnDateFormat(props.value).time }}
          </div>
        </q-td>
      </template>

      <template #body-cell-updatedAt="props">
        <q-td :props="props">
          <div>
            {{ fnDateFormat(props.value).date }}
          </div>
          <div>
            {{ fnDateFormat(props.value).time }}
          </div>
        </q-td>
      </template>

      <template #body-cell-loginAt="props">
        <q-td :props="props">
          <div>
            {{ fnDateFormat(props.value).date }}
          </div>
          <div>
            {{ fnDateFormat(props.value).time }}
          </div>
        </q-td>
      </template>

      <template #body-cell-actions="props">
        <q-td :props="props">
          <q-btn
            flat
            round
            icon="svguse:icons.svg#trash-fill"
            size="sm"
            color="red"
            @click="fnDeleteUser(props.row)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useQuasar } from 'quasar'
import { api } from '@/boot/axios'
import moment from 'moment'

import deleteUser from '@/components/dialog/delete'
import adminUser from '@/components/dialog/users/admin'
import userLevel from '@/components/dialog/users/level'

export default {
  setup() {
    const { state, dispatch } = useStore()
    const $q = useQuasar()

    const users = computed(() => state.users.users)

    function fnDateFormat(date) {
      return {
        date: moment(date).format('YYYY-MM-DD'),
        time: moment(date).format('hh:mm:ss')
      }
    }

    async function fnDeleteUser(user) {
      $q.loading.show()
      try {
        $q.dialog({
          component: deleteUser,
          componentProps: {
            user: user
          }
        }).onOk(async () => {
          await api.get(`/api/users/delete?id=${user._id}`)
          await dispatch('users/updateUsers')
          $q.loading.hide()
        })
      } catch (err) {
        console.error(err)
      }
      $q.loading.hide()
    }

    async function fnEditAdmin(user) {
      try {
        $q.dialog({
          component: adminUser,
          componentProps: { user: user }
        }).onOk(async (rt) => {
          await api.get(`/api/users/admin?id=${rt._id}&value=${!rt.admin}`)
          await dispatch('users/updateUsers')
        })
      } catch (err) {
        console.error(err)
      }
    }

    async function fnEditLevel(user) {
      try {
        $q.dialog({
          component: userLevel,
          componentProps: { user: user }
        }).onOk(async (rt) => {
          await api.get(`/api/users/level?id=${user._id}&value=${rt.value}`)
          await dispatch('users/updateUsers')
        })
      } catch (err) {
        console.error(err)
      }
    }

    return {
      users,
      fnDateFormat,
      fnDeleteUser,
      fnEditAdmin,
      fnEditLevel
    }
  }
}
</script>
