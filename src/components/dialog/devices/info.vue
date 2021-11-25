<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-sm">
          <q-avatar text-color="primary" size="2.5">
            <q-icon
              name="svguse:icons.svg#info-circle-fill"
              color="red"
              size="1.5rem"
            />
          </q-avatar>
          <div>
            <div class="name" style="font-size: 1rem">상세 정보</div>
            <div class="caption" style="font-size: 0.5rem">
              해당 디바이스의 상세 정보를 표시합니다
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-scroll-area style="height: 400px">
          <q-list dense class="q-mx-md q-mt-lg">
            <q-item
              v-for="(value, key) in item.detail"
              :key="key"
              dense
            >
              <q-item-section>
                <q-item-label>{{ key }}</q-item-label>
                <q-item-label
                  v-if="
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean'
                  "
                  caption
                  >{{ value }}</q-item-label
                >
              </q-item-section>
              <q-item-section v-if="typeof value === 'object'">
                <q-item v-for="(v, k) in value" :key="k" dense>
                  <q-item-section>
                    <q-item-label>{{ k }}</q-item-label>
                    <q-item-label caption>{{ v }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-item-section>
            </q-item>

            <q-separator class="q-my-sm" />

            <q-item dense>
              <q-item-section>
                <q-item-label>등록시간</q-item-label>
                <q-item-label caption>
                  {{ dateFormat(item.createdAt) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item dense>
              <q-item-section>
                <q-item-label>갱신시간</q-item-label>
                <q-item-label caption>
                  {{ dateFormat(item.updatedAt) }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions class="bg-grey-1" align="right">
        <q-btn
          color="primary"
          label="확인"
          style="width: 5rem"
          unelevated
          rounded
          @click="onDialogHide"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'
import { dateFormat } from '@/api/time'

export default {
  props: {
    item: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogCancel } =
      useDialogPluginComponent()

    return {
      dateFormat,
      dialogRef,
      onDialogHide,
      onCancelClick: onDialogCancel
    }
  }
}
</script>
