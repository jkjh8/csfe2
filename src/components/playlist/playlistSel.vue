<template>
  <div
    class="bg-grey-2"
    style="border-radius: 0.5rem; padding: 0.5rem 0.5rem"
  >
    <div class="listname">선택된 플레이 리스트</div>

    <div v-if="playlist">
      <q-item dense>
        <q-item-section avatar>
          <div>
            <q-icon
              name="svguse:icons.svg#clipboard-list"
              color="yellow-8"
              size="sm"
            />
          </div>
        </q-item-section>
        <q-item-section>
          {{ playlist.name }}
        </q-item-section>
        <q-item-section side>
          <q-btn
            flat
            round
            icon="svguse:icons.svg#menu"
            size="xs"
            @click.prevent.stop="fnView(playlist)"
          ></q-btn>
        </q-item-section>
      </q-item>
    </div>
    <div
      v-else
      class="text-grey text-center"
      style="margin: 1rem 1rem"
    >
      선택된 플레이 리스트가 없습니다.
    </div>
  </div>
</template>

<script>
import { useQuasar } from 'quasar'
import PlaylistWiew from '@/components/dialog/playlist/viewer'
export default {
  props: {
    playlist: Object
  },
  setup() {
    const $q = useQuasar()
    const fnView = (lists) => {
      $q.dialog({
        component: PlaylistWiew,
        componentProps: {
          item: lists
        }
      })
    }
    return {
      fnView
    }
  }
}
</script>
