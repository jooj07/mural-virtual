<template>
  <div class="text-center">
    <v-overlay :value="loading" absolute z-index="800000000">
      <div v-if="loading" class="dots"></div>
    </v-overlay>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['loading'])
  }
}
</script>

<style>
.dots {
  width: 13.4px;
  height: 13.4px;
  border-radius: 50%;
  background: #004b1d;
  color: #004b1d;
  box-shadow: 0 0 0 3.4px;
  position: relative;
  animation: dots-39rdyvmd 2s infinite linear;
}

.dots:before,
.dots:after {
  content: "";
  position: absolute;
  border-radius: 50%;
  inset: 0;
  background: #004b1d;
  transform: rotate(0deg) translate(20.2px);
  animation: dots-c774cgmd 1s infinite;
}

.dots:after {
  animation-delay: -0.5s;
}

@keyframes dots-39rdyvmd {
  100% {
    transform: rotate(1turn);
  }
}

@keyframes dots-c774cgmd {
  100% {
    transform: rotate(1turn) translate(22.4px);
  }
}
</style>
