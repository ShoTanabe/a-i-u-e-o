<template>
  <div class="container">
    <div class="container-left">
      <div class="animation-area">

      </div>
    </div>
    <div class="container-right">
      <div class="answer-area">
        <div class="inputted-letter">
          {{ inputtedLetter }}
        </div>
      </div>
      <div class="input-area">

        <ul class="list-syllabary-ja">

          <li
          v-for="letter in japaneseSyllabary"
          :key="letter"
          @click="inputLetter(letter)"
          :class="[(letter === 'や' || letter === 'ゆ' || letter === 'わ' || letter === 'を') ? 'next-empty' : '']">
            <div class="letter">{{ letter }}</div>
          </li>

        </ul>

      </div>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      firstLetter: '',
      secondLetter: '',
      thirdLetter: '',
      fourthLetter: '',
      fifthLetter: '',
      japaneseSyllabary: ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん']
    }
  },
  computed: {
    inputtedLetter() {
      const inputLetter = this.firstLetter + this.secondLetter + this.thirdLetter + this.fourthLetter + this.fifthLetter;
      return inputLetter;
    }
  },
  methods: {
    inputLetter(letter) {
      if(this.firstLetter === '') {
        this.firstLetter = letter;
      } else if(this.secondLetter === '') {
        this.secondLetter = letter;
      } else if(this.thirdLetter === '') {
        this.thirdLetter = letter;
      } else if(this.fourthLetter === '') {
        this.fourthLetter = letter;
      } else if(this.fifthLetter === '') {
        this.fifthLetter = letter;
      } else if(this.fifthLetter !== '') {
        this.firstLetter = '';
        this.secondLetter = '';
        this.thirdLetter = '';
        this.fourthLetter = '';
        this.fifthLetter = '';
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    background-color: #beeffd;
    border: 5px solid #fff;
    width: 95%;
    margin: 15px auto;
    max-height: 700px;  
    aspect-ratio: 16 / 9;

    .container-left {
      width: 25%;
      height: 100%;
      float: left;

      .animation-area {
        background-color: #999999;
        width: 100%;
        height: 100%;
      }

    }

    .container-right {
      width: 75%;
      height: 100%;
      float: left;

      .answer-area {
        background-color: #fff3a8;
        width: 100%;
        height: 25%;

        .inputted-letter {
          padding: 2vw;
          font-size: 7.5vw;
          text-align: center;
          font-weight: bold;
          letter-spacing: 1.3vw;
        }

      }

      .input-area {
        background-color: #fa7e7e;
        width: 100%;
        height: 75%;

        .list-syllabary-ja{
            width: 98%;
            height: 100%;
            margin: 0 auto; 
            display: flex;
            flex-direction: column;
            flex-wrap: wrap-reverse;
            justify-content: center;
            align-items: center;

          li {
            height: 16%;
            width: 9%;
            background-color: #fff;
            margin: 1% 0;
            cursor: pointer;

            .letter {
              margin: 0 auto;
              font-weight: bold;
              font-size: 3vw;
              line-height: 6vw;
              text-align: center;
            }

          }

          li.next-empty {
            margin-bottom: 12%;
          }

        }

      }

    }

  }


</style>
