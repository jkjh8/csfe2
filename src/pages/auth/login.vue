<template>
  <div class="row items-center">
    <div style="margin: 10% auto">
      <Login />
      <div style="text-align: center; margin-top: 4rem">
        <router-link to="/register">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Login from '@/components/auth/loginForm'

export default {
  components: { Login }
}
</script>
