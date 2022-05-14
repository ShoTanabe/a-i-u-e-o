<template>
  <div
  @click="closeResultModal()"
  class="display">
    <div class="modal">
      <div class="message">
        <p>おしまい<br>よくがんばったね！</p>
        <p class="result"><span class="resulttime">{{ trialTime }}</span>びょう</p>
        <p>だったよ</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ResultModal',
  methods: {
    closeResultModal() {
      this.$emit('closeResultModal');
    }
  },
  computed: {
    trialTime() {
      return this.$store.getters.trialTime;
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
      border: solid 5px #ff763b;
      display: flex;
      justify-content: center;
      align-items: center;
      aspect-ratio: 10 / 9;

      .message {
        text-align: center;
        font-weight: bold;
        font-size: 4vw;

        img {
          width: 40%;
        }

        .result {
          margin: 1vw 0;
        }

        .resulttime {
          font-size: 10vw;
        }

      }

    }

  }
</style>
