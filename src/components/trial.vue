<template>
  <div class="display">
    <div class="modal">
      <div
      v-if="explanation"
      class="message">
        <p>いまから10かい<br>せいかいするまでの<br>じかんをはかるよ！</p>
        <div>
          <p
          @click="startTrialMode()"
          class="btn">すたーと</p>
          <p
          @click="closeTrialModal()"
          class="btn">やめる</p>
        </div>
      </div>
      <div
      v-if="countdown"
      class="countdowntimer">
        {{ timer }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'TrialModal',
  data() {
    return {
      explanation: true,
      countdown: false,
      timer: 3
    }
  },
  methods: {
    closeTrialModal() {
      this.$emit('closeTrialModal');
    },
    startTrialMode() {
      this.explanation = false;
      this.countdown = true;

      const intervalId = setInterval(() => {
        this.timer--;
        if(this.timer === 0) {
          clearInterval(intervalId);
          this.$emit('startTrialMode');
        }
      },1000)


    },
  },
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
        font-size: 2.5vw;
        line-height: 3.5vw;
        letter-spacing: 0.3vw;

        .btn {
          width: 80%;
          margin: 2vw auto;
          background-color: #ff763b;
          color: #fff;
          line-height: 2vw;
          letter-spacing: auto;
          padding: 1.5vw;
          border-radius: 1vw;
          cursor: pointer;
        }

        img {
          width: 40%;
        }

      }

      .countdowntimer {
        font-size: 15vw;
        font-weight: bold;
      }

    }

  }
</style>
