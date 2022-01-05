<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="global-background">
      <div class="row items-center q-pa-md relative-position">
        <router-link class="logo link text-black" to="/"
          >Media Server</router-link
        >
        <div class="absolute-center">
          <Links />
        </div>
        <div class="absolute-right q-mt-md q-mr-xl">
          <UserState />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
    <Preview />
  </q-layout>
</template>

<script>
import { defineComponent, onMounted } from 'vue'
import { socket } from '@/api/socketio'
import notify from '@/api/notify'

import Links from '@/layouts/link'
import UserState from '@/layouts/userState'
import Preview from '@/components/dialog/preview'

export default defineComponent({
  name: 'MainLayout',
  components: { Links, UserState, Preview },
  setup() {
    const { notifyInfo, notifyWarn } = notify()
    onMounted(() => {
      socket.on('connection', (msg) => {
        console.log('connected', msg)
      })
      socket.on('page_start', (args) => {
        notifyInfo({
          message: `${args.source}가 방송을 시작했습니다`,
          caption: `${args.zones
            .map((e) => e.name)
            .join(',')} 지역에 방송을 시작했습니다.`
        })
      })
      socket.on('page_end', (args) => {
        notifyWarn({
          message: `${args.source}가 방송을 종료했습니다`,
          caption: `${args.zones
            .map((e) => e.name)
            .join(',')} 지역에 방송을 종료했습니다.`
        })
      })
    })

    return {
      //
    }
  }
})
</script>

<style scoped>
.link {
  padding: 0 1rem;
  text-decoration: none;
  font-size: 1.5rem;
}
</style>
