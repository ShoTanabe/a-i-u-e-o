<template>
  <div class="container">
    <div class="container-left">
      <div class="animation-area">
        <div class="message">ぼくのなまえ<br>わかるかな？</div>
        <div class="quiz-image"><img :src="currentQuiz.url" alt=""></div>
      </div>
      <div class="menu-area">
        <div class="menu-btn"
        @click="openSuccessModal">ひんと</div>
        <div class="menu-btn"
        @click="clickAnswerBtn">こたえ</div>
        <div class="menu-btn"
        @click="openFailedModal">せってい</div>
        <div class="menu-btn">おわる</div>
      </div>
    </div>
    <div class="container-right">
      <div class="answer-area">
        <div class="inputted-letter">
          {{ displayedLetters }}
        </div>
      </div>
      <div class="input-area">

        <ul class="list-syllabary-ja">

          <li
          v-for="letter in japaneseSyllabary"
          :key="letter"
          @click="inputLetter(letter)"
          :class="[(letter === 'や' || letter === 'ゆ') ? 'next-empty' : '']">
            <div class="letter">{{ letter }}</div>
          </li>
          <li
          @click="inputVoicedSoundMark"><div class="letter">゛</div></li>
          <li
          @click="inputSemiVoicedSoundMark"><div class="letter">゜</div></li>

        </ul>

      </div>
    </div>

    <div v-if="this.successModal" v-cloak>
      <SuccessModal
      @closeSuccessModal="closeSuccessModal">
      </SuccessModal>
    </div>
    <div v-if="this.failedModal" v-cloak>
      <FailedModal
      @closeFailedModal="closeFailedModal">
      </FailedModal>
    </div>
  </div>
</template>

<script>

import SuccessModal from '@/components/success.vue'
import FailedModal from '@/components/failed.vue'

import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  components: {
    SuccessModal,
    FailedModal
  },
  data() {
    return {
      inputtedLetters: [],
      japaneseSyllabary: ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'],
      quizDataList: [],
      quizNumber: 0,
      successModal: false,
      failedModal: false,
      errorCount: 0
    }
  },
  computed: {
    displayedLetters() {
      let preparedLetters = [];

      this.inputtedLetters.forEach((letter) => {
        if(letter === '゛') {
          if(preparedLetters[preparedLetters.length - 1] === 'か') {
            preparedLetters[preparedLetters.length - 1] = 'が';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'き') {
            preparedLetters[preparedLetters.length - 1] = 'ぎ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'く') {
            preparedLetters[preparedLetters.length - 1] = 'ぐ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'け') {
            preparedLetters[preparedLetters.length - 1] = 'げ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'こ') {
            preparedLetters[preparedLetters.length - 1] = 'ご';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'さ') {
            preparedLetters[preparedLetters.length - 1] = 'ざ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'し') {
            preparedLetters[preparedLetters.length - 1] = 'じ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'す') {
            preparedLetters[preparedLetters.length - 1] = 'ず';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'せ') {
            preparedLetters[preparedLetters.length - 1] = 'ぜ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'そ') {
            preparedLetters[preparedLetters.length - 1] = 'ぞ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'た') {
            preparedLetters[preparedLetters.length - 1] = 'だ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ち') {
            preparedLetters[preparedLetters.length - 1] = 'ぢ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'つ') {
            preparedLetters[preparedLetters.length - 1] = 'づ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'て') {
            preparedLetters[preparedLetters.length - 1] = 'で';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'と') {
            preparedLetters[preparedLetters.length - 1] = 'ど';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'は') {
            preparedLetters[preparedLetters.length - 1] = 'ば';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ひ') {
            preparedLetters[preparedLetters.length - 1] = 'び';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ふ') {
            preparedLetters[preparedLetters.length - 1] = 'ぶ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'へ') {
            preparedLetters[preparedLetters.length - 1] = 'べ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ほ') {
            preparedLetters[preparedLetters.length - 1] = 'ぼ';
          }
        }
        else if(letter === '゜') {
          if(preparedLetters[preparedLetters.length - 1] === 'は') {
            preparedLetters[preparedLetters.length - 1] = 'ぱ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ひ') {
            preparedLetters[preparedLetters.length - 1] = 'ぴ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ふ') {
            preparedLetters[preparedLetters.length - 1] = 'ぷ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'へ') {
            preparedLetters[preparedLetters.length - 1] = 'ぺ';
          }
          else if(preparedLetters[preparedLetters.length - 1] === 'ほ') {
            preparedLetters[preparedLetters.length - 1] = 'ぽ';
          }
        }
        else {
          preparedLetters.push(letter);
        }
      })

      let displayedLetters = '';
      preparedLetters.forEach((letter) => {
        displayedLetters = displayedLetters + letter;
      })

      return displayedLetters;
    },
    currentQuiz() {
      return this.$store.getters.currentQuiz;
    }
  },
  methods: {
    inputLetter(letter) {
      this.inputtedLetters.push(letter);

      let answer = '';
      this.inputtedLetters.forEach((inputtedLetter) => {
        answer = answer + inputtedLetter;
      });
      let correctAnswer = '';
      this.currentQuiz.letters.forEach((correctLetter) => {
        correctAnswer = correctAnswer + correctLetter;
      });

      if(answer === correctAnswer) {
        this.successModal = true;
      }
      else {
        this.inputtedLetters.forEach((inputtedLetter, i) => {
          if(inputtedLetter !== this.currentQuiz.letters[i]) {
            this.failedModal = true;
          }
          else {
            this.errorCount ++;
          }
        })
      }

    },
    inputVoicedSoundMark() {
      this.inputtedLetters.push('゛');

      let answer = '';
      this.inputtedLetters.forEach((inputtedLetter) => {
        answer = answer + inputtedLetter;
      });
      let correctAnswer = '';
      this.currentQuiz.letters.forEach((correctLetter) => {
        correctAnswer = correctAnswer + correctLetter;
      });

      if(answer === correctAnswer) {
        this.successModal = true;
      }
      else {
        this.inputtedLetters.forEach((inputtedLetter, i) => {
          if(inputtedLetter !== this.currentQuiz.letters[i]) {
            this.failedModal = true;
          }
          else {
            this.errorCount ++;
          }
        })
      }
      
    },
    inputSemiVoicedSoundMark() {
      this.inputtedLetters.push('゜');

      let answer = '';
      this.inputtedLetters.forEach((inputtedLetter) => {
        answer = answer + inputtedLetter;
      });
      let correctAnswer = '';
      this.currentQuiz.letters.forEach((correctLetter) => {
        correctAnswer = correctAnswer + correctLetter;
      });

      if(answer === correctAnswer) {
        this.successModal = true;
      }
      else {
        this.inputtedLetters.forEach((inputtedLetter, i) => {
          if(inputtedLetter !== this.currentQuiz.letters[i]) {
            this.failedModal = true;
          }
          else {
            this.errorCount ++;
          }
        })
      }
      
    },
    clickAnswerBtn() {
      this.inputtedLetters = [];
    },
    openSuccessModal() {
      this.successModal = true;
    },
    closeSuccessModal() {
      if(this.quizNumber === this.quizDataList.length - 1) {
        this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
        this.quizNumber = 0;
      }
      else if(this.quizNumber !== this.quizDataList.length - 1) {
        this.quizNumber++;
        this.$store.commit('updateCurrentQuiz', this.quizDataList[this.quizNumber]);
      }
      this.successModal = false;
      this.inputtedLetters = [];
    },
    openFailedModal() {
      this.failedModal = true;
    },
    closeFailedModal() {
      this.inputtedLetters.splice(-1,1);
      this.failedModal = false;
    }
  },
  created() {
    getDocs(collection(getFirestore(), 'quiz-data'))
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const quizData = {
            id: doc.id,
            name: doc.data().name,
            letters: doc.data().letters,
            wordCount: doc.data().wordcount,
            url: doc.data().path
          };
          this.quizDataList.push(quizData);
        });
        this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
      })
      .catch(() => {
        console.log('クイズデータ取得失敗');
      })
  }
}
</script>

<style scoped lang="scss">
  .container {
    background-color: #beeffd;
    border: 5px solid #fff;
    width: 100%;
    margin: 0 auto;
    max-height: 720px;
    aspect-ratio: 16 / 9;

    .container-left {
      width: 25%;
      height: 100%;
      float: left;

      .animation-area {
        background-color: #999999;
        width: 100%;
        height: 70%;
        background-image: url(/farm.png);
        background-size: contain;
        position: relative;

        .message {
          width: 60%;
          text-align: center;
          font-size: 1.5vw;
          font-weight: bold;
          color: #59240f;
          margin: 0 auto;
          padding-top: 7.5vw;
          letter-spacing: 0.2vw;
        }

        .quiz-image {
          width: 90%;
          position: absolute;
          top: 13vw;
          left: 1vw;

          img {
            width: 100%;
          }

        }

      }

      .menu-area {
        background-color: #c0ff91;
        width: 100%;
        height: 30%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;

        .menu-btn {
          width: 40%;
          height: 35%;
          background-color: #fa7e7e;
          border-radius: 10%;
          text-align: center;
          color: #fff;
          font-size: 1.8vw;
          font-weight: bold;
          line-height: 5.2vw;
          cursor: pointer;
        }

      }

    }

    .container-right {
      width: 75%;
      height: 100%;
      float: left;

      .answer-area {
        width: 100%;
        height: 25%;
        background-image: url(/answer-area.png);
        // background-color: #FFF3A8;
        background-size: contain;

        .inputted-letter {
          padding: 2vw;
          font-size: 6.5vw;
          line-height: 8.5vw;
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
            background: linear-gradient(150deg, rgba(255,255,255,1) 0%, rgba(224,224,224,1) 65%, rgba(196,196,196,1) 100%);
            margin: 1% 0;
            cursor: pointer;
            border-radius: 10%;
            box-shadow: 2px 2px 15px -5px #777777;

            .letter {
              margin: 0 auto;
              font-weight: bold;
              font-size: 3vw;
              line-height: 6vw;
              text-align: center;
              color: #333333;
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
