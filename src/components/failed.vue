<template>
  <div
  @click="closeSuccessModal()"
  class="display">
    <div class="modal">
      <div class="message">
        ちがうよ
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FailedModal',
  methods: {
    closeSuccessModal() {
      this.$emit('closeFailedModal');
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
    background-color: rgba(255,255,255,0.4);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal {
      width: 50%;
      background-color: #fff;
      border-radius: 20%;
      border: solid 5px #334bff;
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 10 / 9;

      .message {
        text-align: center;
        font-weight: bold;
        font-size: 4vw;
      }

    }

  }
</style>
