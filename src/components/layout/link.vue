<template>
  <div class="row justify-center items-center q-gutter-md">
    <button>
      방송

      <q-menu class="bg-black" style="border-radius: 2rem" :offset="[130, 5]">
        <div class="q-pa-md">
          <router-link class="link" to="">방송상태</router-link>
          <router-link class="link" to="">실시간방송</router-link>
          <router-link class="link" to="">예약방송</router-link>
        </div>
      </q-menu>
    </button>

    <button>
      방송구간

      <q-menu class="bg-black" style="border-radius: 2rem" :offset="[100, 5]">
        <div class="q-pa-md">
          <router-link class="link" to="">방송구간설정</router-link>
          <router-link class="link" to="">방송장비설정</router-link>
        </div>
      </q-menu>
    </button>

    <button>
      서버관리

      <q-menu class="bg-black" style="border-radius: 2rem" :offset="[70, 5]">
        <div class="q-pa-md">
          <router-link class="link" to="">파일관리</router-link>
          <router-link class="link" to="">이벤트로그</router-link>
        </div>
      </q-menu>
    </button>

    <button>
      관리자

      <q-menu class="bg-black" style="border-radius: 2rem" :offset="[130, 5]">
        <div class="q-pa-md">
          <router-link class="link" to="">서버관리</router-link>
          <router-link class="link" to="">사용자관리</router-link>
          <router-link class="link" to="">파일관리</router-link>
        </div>
      </q-menu>
    </button>
  </div>
</template>

<script>
import { computed } from "vue"
import { useStore } from "vuex"

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
  font-size: 1rem;
  padding: 0.5rem 1rem;
  color: #fbfbfb;
}
</style>
