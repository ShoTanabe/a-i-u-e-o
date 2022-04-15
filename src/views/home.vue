<template>
  <div class="container">
    <div class="menuBtn">
      <div
      @click="goToQuiz()"
      class="btn">くいず</div>
      <div
      @click="goToFree()"
      class="btn">じゆう</div>
    </div>
  </div>
</template>

<script>

export default {
  methods: {
    goToQuiz() {
      this.$router.push('/quiz');
    },
    goToFree() {
      this.$router.push('/free');
    }
  }
}
</script>


<style scoped lang="scss">
  .container {
    background-image: url(/home.png);
    background-size: contain;
    border: 5px solid #fff;
    width: 100%;
    margin: 0 auto;
    max-height: 720px;
    aspect-ratio: 16 / 9;
    position: relative;

    .menuBtn {
      width: 100%;
      height: 25%;
      position: absolute;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;

      .btn {
        width: 22%;
        font-size: 3vw;
        text-align: center;
        background-color: #fa7e7e;
        color: #fff;
        border-radius: 3vw;
        line-height: 8vw;
        font-weight: bold;
        letter-spacing: 0.6vw;
        border: solid 0.5vw #fff;
        cursor: pointer;

        &:last-child {
          margin-left: 4vw;
        }

      }

    }

  }
</style>