<template>
  <div>
    <q-card
      class="shadow-15"
      style="
        height: 20rem;
        width: 25rem;
        max-width: 26rem;
        border-radius: 1rem;
      "
    >
      <q-card-section class="gradient-red q-pa-none">
        <div class="q-pa-md q-mx-md text-white" style="height: 6rem">
          <div class="vertical-middle">
            <q-icon
              name="svguse:icons.svg#exclamation"
              size="1.7rem"
            />
            <span
              class="q-ml-sm"
              style="font-family: 나눔고딕; font-size: 1.2rem"
            >
              사용을 위해서 먼저 로그인 해주세요
            </span>
          </div>
        </div>
      </q-card-section>
      <q-card-section style="height: 10rem">
        <div
          class="fit row justify-center items-center"
          style="font-family: 나눔고딕; font-size: 1rem"
        >
          아이디가 없으면 먼저&nbsp;
          <router-link to="/register">회원가입</router-link>을
          해주세요
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-px-md row justify-end">
          <router-link to="/login">로그인 바로가기</router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>
