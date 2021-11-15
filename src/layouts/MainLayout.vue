<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="global-background">
      <div class="row items-center q-pa-md">
        <router-link class="col-3 logo link" to="/">Media Server</router-link>
        <div class="col-7">
          <Links />
        </div>
        <div class="col-2 row justify-center">
          <UserState />
        </div>
      </div>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import Links from '@/components/layout/link'
import UserState from '@/components/layout/userState'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'MainLayout',
  components: { Links, UserState },
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
