<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card
      class="q-dailog-plugin"
      style="width: 600px; max-width: 800px"
    >
      <q-card-section class="bg-grey-2">
        <div class="row justify-between items-center">
          <div class="row">
            <q-avatar size="md">
              <q-icon
                name="svguse:icons.svg#check-circle"
                color="green"
                size="1.5rem"
              />
            </q-avatar>
            <div class="name" style="font-size: 1.2rem">
              방송구간선택
            </div>
          </div>

          <div>
            <q-input v-model="search" dense filled label="검색">
              <template #append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>
      </q-card-section>

      <!-- table -->
      <q-card-section>
        <q-table
          v-model:selected="selected"
          selection="single"
          row-key="_id"
          :rows="childrens"
          :columns="[
            {
              name: 'index',
              label: 'Index',
              field: 'index',
              sortable: true,
              align: 'center'
            },
            {
              name: 'name',
              label: '이름',
              field: 'name',
              sortable: true,
              align: 'center'
            },
            {
              name: 'devicetype',
              label: 'Type',
              field: 'devicetype',
              sortable: true,
              align: 'center'
            },
            {
              name: 'ipaddress',
              label: 'IP주소',
              field: 'ipaddress',
              sortable: true,
              align: 'center'
            }
          ]"
        >
          <template #body-selection="scope">
            <div style="width: 20px">
              <q-checkbox v-model="scope.selected" />
            </div>
          </template>
        </q-table>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            style="width: 5rem"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            :disabled="selected.length === 0"
            color="primary"
            label="확인"
            style="width: 5rem"
            unelevated
            rounded
            @click="onOKClick"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useDialogPluginComponent } from 'quasar'
export default {
  props: {
    //
  },
  emits: [...useDialogPluginComponent.emits],
  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    const { getters } = useStore()
    const childrens = computed(() => getters['devices/childrens'])

    const search = ref('')
    const selected = ref([])
    const onOKClick = () => {
      onDialogOK(selected.value[0]._id)
    }
    return {
      search,
      selected,
      childrens,
      dialogRef,
      onDialogHide,
      onOKClick,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
