<template>
  <div>
      <transition
        name="fade-transform"
        mode="out-in"
      >
        <router-view />
      </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Empty'
})
export default class extends Vue {}
</script>
