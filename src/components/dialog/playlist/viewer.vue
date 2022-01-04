<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="border-radius: 0.5rem">
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="q-gutter-x-sm q-px-md row items-end">
            <q-icon
              name="svguse:icons.svg#clipboard-list"
              color="primary"
              size="sm"
            />
            <div class="name" style="font-size: 1.2rem">
              {{ item.name }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 320px">
          <q-list class="q-py-md">
            <q-item v-for="(file, idx) in item.list" :key="idx" dense>
              <q-item-section avatar>
                <q-icon
                  name="svguse:icons.svg#clipboard-list"
                  color="yellow-8"
                />
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ file.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  v-if="file.type !== 'directory'"
                  round
                  flat
                  icon="svguse:icons.svg#play"
                  color="green-7"
                  size="sm"
                  @click.prevent.stop="fnPreview(file)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            color="primary"
            label="확인"
            unelevated
            rounded
            @click="onOKClick(selected)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { computed } from 'vue'
import { useStore } from 'vuex'

export default {
  props: {
    item: Object
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()
    const { state, dispatch } = useStore()

    const user = computed(() => state.user.user)

    const fnPreview = (file) => {
      dispatch('preview/openPreview', file)
    }
    return {
      user,
      fnPreview,
      dialogRef,
      onDialogHide,
      onOKClick(file) {
        onDialogOK(file)
      },
      onCancelClick: onDialogCancel
    }
  }
}
</script>

<style scoped>
.selected {
  background: #eee;
  color: black;
}
</style>
