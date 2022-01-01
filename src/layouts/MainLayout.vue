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
import { useStore } from 'vuex'
import { socket } from '@/api/socketio'

import Links from '@/layouts/link'
import UserState from '@/layouts/userState'
import Preview from '@/components/dialog/preview'

export default defineComponent({
  name: 'MainLayout',
  components: { Links, UserState, Preview },
  setup() {
    const { dispatch } = useStore()

    onMounted(() => {
      socket.on('connection', (msg) => {
        console.log('connected', msg)
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
