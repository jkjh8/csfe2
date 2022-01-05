<template>
  <div class="q-gutter-x-md">
    <button>
      방송

      <q-menu
        class="bg-black"
        style="border-radius: 2rem"
        :offset="[115, 5]"
      >
        <div class="q-pa-sm">
          <router-link class="link" to="/broadcast/status"
            >방송상태</router-link
          >
          <router-link class="link" to="/broadcast/live"
            >실시간방송</router-link
          >
          <router-link class="link" to="/broadcast/schedules"
            >예약방송</router-link
          >
        </div>
      </q-menu>
    </button>

    <button>
      방송구간

      <q-menu
        class="bg-black"
        style="border-radius: 2rem"
        :offset="[85, 5]"
      >
        <div class="q-pa-sm">
          <router-link class="link" to="/devices/zones"
            >방송구간설정</router-link
          >
          <router-link class="link" to="/devices/devices"
            >방송장비설정</router-link
          >
        </div>
      </q-menu>
    </button>

    <button>
      서버관리

      <q-menu
        class="bg-black"
        style="border-radius: 2rem"
        :offset="[125, 5]"
      >
        <div class="q-pa-sm">
          <router-link class="link" to="/management/files">
            파일관리
          </router-link>
          <router-link class="link" to="/management/playlist">
            플레이리스트관리
          </router-link>
          <router-link class="link" to="/management/eventlog"
            >이벤트로그</router-link
          >
        </div>
      </q-menu>
    </button>

    <button v-if="user && user.admin">
      관리자

      <q-menu
        class="bg-black"
        style="border-radius: 2rem"
        :offset="[150, 5]"
      >
        <div class="q-pa-sm">
          <router-link class="link" to="/admin/status"
            >서버관리</router-link
          >
          <router-link class="link" to="/admin/users"
            >사용자관리</router-link
          >
          <router-link class="link" to="/admin/files"
            >파일관리</router-link
          >
          <router-link class="link" to="/admin/systemlog"
            >시스템로그</router-link
          >
        </div>
      </q-menu>
    </button>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  setup() {
    const { state } = useStore()
    const user = computed(() => state.user.user)

    return {
      user
    }
  }
}
</script>

<style scoped>
button {
  text-decoration: none;
  border: none;
  color: #676767;
  background: transparent;
  font-family: 나눔고딕;
  font-weight: 700;
  font-size: 1rem;
}

button:hover {
  color: #111;
  cursor: pointer;
}

.link {
  text-decoration: none;
  font-family: 나눔고딕;
  font-weight: 400;
  font-size: 0.8rem;
  padding: 0.2rem 1rem;
  color: #fbfbfb;
}
</style>
