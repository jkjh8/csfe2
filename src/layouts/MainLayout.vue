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
import Links from '@/components/layout/link'
import UserState from '@/components/layout/userState'
import Preview from '@/components/dialog/preview'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  components: { Links, UserState, Preview },
  setup() {
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
