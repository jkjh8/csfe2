<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="bg-grey-2">
        <div class="row items-center q-gutter-sm">
          <q-avatar text-color="red" size="2.5">
            <q-icon
              name="svguse:icons.svg#trash"
              color="red"
              size="1.5rem"
            />
          </q-avatar>
          <div>
            <div class="name" style="font-size: 1rem">삭제</div>
            <div class="caption" style="font-size: 0.5rem">
              다음 사항을 삭제 합니다
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <div class="q-mx-md q-mt-lg">
          <div v-if="user">
            <div v-if="user.email">
              사용자: <strong>{{ user.email }}</strong>
            </div>
            <div>해당 사용자를 삭제합니다.</div>
          </div>
          <div v-if="item">
            <div>다음 내용을 삭제 하시겠습니까?</div>
            <br />
            <div v-if="item.index">
              인덱스: <strong>{{ item.index }}</strong>
            </div>
            <div v-if="item.id">ID: {{ item.id }}</div>
            <div v-if="item.name">
              이름: <strong>{{ item.name }}</strong>
            </div>
            <div v-if="item.email">
              이메일: <strong>{{ item.email }}</strong>
            </div>
            <div v-if="item.ipaddress">
              아이피: <strong>{{ item.ipaddress }}</strong>
            </div>
            <!-- schedule -->
            <div v-if="item.repeat">
              <div>
                반복: <strong>{{ item.repeat }}</strong>
              </div>
              <div>
                <div v-if="item.repeat === '한번'">
                  시간: <strong>{{ item.date }}</strong>
                </div>
                <div v-else>
                  <div>
                    시간:<strong>{{ item.time }}</strong>
                  </div>
                  <div v-if="item.repeat === 'week'">
                    요일: {{ item.week.join(',') }}
                  </div>
                </div>
              </div>
              <div>
                삭제 후에는 복구가 불가능 합니다. 다시 한번 확인
                해주세요.
              </div>
            </div>
          </div>
          <!-- message -->
          <div v-if="message" class="text-center">
            <strong>{{ message }}</strong>
          </div>
          <!-- file -->
          <div v-if="file">
            <q-item>
              <q-item-section avatar>
                <div v-if="file.type === 'directory'">
                  <q-icon
                    name="svguse:icons.svg#folder-fill"
                    color="yellow"
                    size="md"
                  />
                </div>
                <div v-else-if="file.type === 'audio'">
                  <q-icon
                    name="svguse:icons.svg#music-note-fill"
                    color="grey"
                    size="sm"
                  />
                </div>
                <div v-else-if="file.type === 'video'">
                  <q-icon
                    name="svguse:icons.svg#video-camera-fill"
                    color="blue-grey"
                    size="sm"
                  />
                </div>
              </q-item-section>
              <q-item-section>
                <q-item-label>
                  {{ file.name }}
                </q-item-label>
                <q-item-label caption>
                  {{ file.type.toUpperCase() }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </div>
          <div v-else />
        </div>
      </q-card-section>

      <!-- buttons example -->
      <q-card-actions class="bg-grey-1" align="right">
        <div class="q-mx-sm q-gutter-sm">
          <q-btn
            label="취소"
            style="width: 5em"
            rounded
            unelevated
            @click="onCancelClick"
          />
          <q-btn
            color="negative"
            label="확인"
            style="width: 5rem"
            unelevated
            rounded
            @click="onOKClick(item ? item : file)"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { useDialogPluginComponent } from 'quasar'

export default {
  props: {
    item: Object,
    message: String,
    file: Object,
    user: Object
  },

  emits: [...useDialogPluginComponent.emits],

  setup() {
    const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
      useDialogPluginComponent()

    return {
      dialogRef,
      onDialogHide,

      onOKClick(item) {
        onDialogOK(item)
      },

      onCancelClick: onDialogCancel
    }
  }
}
</script>
