<template>
  <div
    class="bg-grey-2"
    style="border-radius: 0.5rem; padding: 0.5rem 0.5rem"
  >
    <div class="listname">선택된 폴더는</div>

    <div v-if="folder">
      <q-item>
        <q-item-section avatar>
          <div>
            <q-icon
              name="svguse:icons.svg#folder-fill"
              color="yellow"
              size="md"
            />
          </div>
        </q-item-section>
        <q-item-section>
          {{ folder.base }} / {{ folder.name }}
        </q-item-section>
      </q-item>
    </div>
    <div
      v-else
      class="text-grey text-center"
      style="margin: 1rem 1rem"
    >
      선택된 폴더가 없습니다.
    </div>
  </div>
</template>

<script>
export default {
  props: {
    folder: Object
  }
}
</script>
