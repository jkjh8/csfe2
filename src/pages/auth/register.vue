<template>
  <div class="row items-center">
    <div style="margin: 20% auto">
      <Register />
      <div style="text-align: center; margin-top: 4rem">
        <router-link to="/">홈으로</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Register from '@/components/auth/registerForm'

export default {
  components: { Register }
}
</script>
