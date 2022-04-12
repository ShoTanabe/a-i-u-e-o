<template>
  <div
  @click="closeSuccessModal()"
  class="display">
    <div class="modal">
      正解だよ
    </div>
  </div>
</template>
<script>
export default {
  name: 'SuccessModal',
  methods: {
    closeSuccessModal() {
      this.$emit('closeSuccessModal');
    }
  }
}
</script>
<style scoped lang="scss">
  .display {
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    overflow: auto;
    background-color: rgba(0,0,0,0.7);

    .modal {
      width: 50%;
      height: 80%;
      margin: 0 auto;
      background-color: #fff;
    }

  }
</style>
