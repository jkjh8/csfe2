<template>
  <div class="row items-center">
    <div style="margin: 5% auto">
      <UserInfo />
      <div style="text-align: center; margin-top: 4rem">
        <router-link to="/">홈으로</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import UserInfo from '@/components/users/userInfo'
export default {
  components: { UserInfo },
  setup() {}
}
</script>
