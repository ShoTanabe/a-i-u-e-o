<template>
  <div class="container">
    <div class="container-left">
      <div class="animation-area">
        <div class="message">おなまえ<br>わかるかな？</div>
        <div class="quiz-image"><img :src="currentQuiz.url" alt=""></div>
      </div>
      <div class="menu-area">
        <div class="menuBtn"
        @click="displayHint()">ひんと</div>
        <div class="menuBtn"
        @click="openTrialModal()">とらい</div>
        <div
        @click="changeNoutoreModo()"
        :class="{menuBtn: true, active: noutore}">ばらばら</div>
        <div
        @click="backToHome()"
        class="menuBtn">おわる</div>
      </div>
    </div>
    <div class="container-right">
      <div class="answer-area">
        <div
        v-if="displayInput"
        class="inputted-letter">
          {{ displayedLetters }}
        </div>
        <div
        v-if="displayHintLetters"
        class="hint-letter">
          <span
          v-for="(letter, i) in arrayHintLetters"
          :key="letter + i"
          :class="[(i === arrayHintLetters.length - 1) ? 'new-hint-letter' : '']">
            {{ letter }}
          </span>
        </div>
      </div>
      <div class="input-area">

        <ul
        v-if="!noutore"
        class="list-syllabary-ja">

          <li
          v-for="letter in japaneseSyllabary"
          :key="letter"
          @click="inputLetter(letter)"
          :class="{nextEmpty: (letter === 'や' || letter === 'ゆ'), noevent: noEvent}">
            <div class="letter">{{ letter }}</div>
          </li>
          <li
          @click="inputVoicedSoundMark"><div class="letter">゛</div></li>
          <li
          @click="inputSemiVoicedSoundMark"><div class="letter">゜</div></li>

        </ul>

        <ul
        v-if="noutore"
        class="list-syllabary-ja">

          <li
          v-for="letter in noutoreSyllabary"
          :key="letter"
          @click="inputLetter(letter)"
          :class="{noevent: noEvent}">
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
    <div v-if="this.trialModal" v-cloak>
      <TrialModal
      @closeTrialModal="closeTrialModal"
      @startTrialMode="startTrialMode">
      </TrialModal>
    </div>
    <div v-if="this.resultModal" v-cloak>
      <ResultModal
      @closeResultModal="closeResultModal">
      </ResultModal>
    </div>
  </div>
</template>

<script>

import SuccessModal from '@/components/success.vue'
import FailedModal from '@/components/failed.vue'
import TrialModal from '@/components/trial.vue'
import ResultModal from '@/components/result.vue'

import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  components: {
    SuccessModal,
    FailedModal,
    TrialModal,
    ResultModal
  },
  data() {
    return {
      inputtedLetters: [],
      japaneseSyllabary: ['あ','い','う','え','お','か','き','く','け','こ','さ','し','す','せ','そ','た','ち','つ','て','と','な','に','ぬ','ね','の','は','ひ','ふ','へ','ほ','ま','み','む','め','も','や','ゆ','よ','ら','り','る','れ','ろ','わ','を','ん'],
      noutoreSyllabary: [],
      quizDataList: [],
      quizNumber: 0,
      successModal: false,
      failedModal: false,
      errorCount: 0,
      displayHintLetters: false,
      displayInput: true,
      arrayHintLetters: [],
      noEvent: false,
      noutore: false,
      trialModal: false,
      trialMode: false,
      resultModal: false,
      trialTime: 0
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
      this.displayHintLetters = false;
      this.displayInput = true;

      this.inputtedLetters.push(letter);
      this.noEvent = true;

      const sleep = (ms) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, ms)
        })
      }

      sleep(500)
      .then(() => {
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
          this.noEvent = false;

      })


    },
    inputVoicedSoundMark() {
      this.displayHintLetters = false;
      this.displayInput = true;

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
      this.displayHintLetters = false;
      this.displayInput = true;

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

      if(this.trialMode === true && this.quizNumber === 9) {

        this.successModal = false;
        this.inputtedLetters = [];
        this.$store.commit('updateTrialTime', this.trialTime);
        this.trialMode = false;
        this.resultModal = true;
        this.trialTime = 0;

      }
      else {

        if(this.quizNumber === this.quizDataList.length - 1) {

          const shuffle = ([...array]) => {
            for (let i = array.length - 1; i >= 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }

          this.quizDataList = shuffle(this.quizDataList);

          this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
          this.quizNumber = 0;
        }
        else if(this.quizNumber !== this.quizDataList.length - 1) {
          this.quizNumber++;
          this.$store.commit('updateCurrentQuiz', this.quizDataList[this.quizNumber]);
        }
        this.successModal = false;
        this.inputtedLetters = [];

      }
    },
    openFailedModal() {
      this.failedModal = true;
    },
    closeFailedModal() {
      this.inputtedLetters.splice(-1,1);
      this.failedModal = false;
    },
    displayHint() {

      if(this.displayHintLetters === false) {

        let answerLetters = this.currentQuiz.name;

        let hintLetters = answerLetters.slice(0, this.displayedLetters.length + 1);
        this.arrayHintLetters = hintLetters.split('');

        this.displayHintLetters = true;
        this.displayInput = false;
      }
      else {
        this.displayHintLetters = false;
        this.displayInput = true;
      }
    },
    changeNoutoreModo() {

      if(this.noutore === true) {
        this.noutore = false;
      } else if(this.noutore === false) {
        const shuffle = ([...array]) => {
          for (let i = array.length - 1; i >= 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
          }
          return array;
        }

        this.noutoreSyllabary = shuffle(this.japaneseSyllabary);
        this.noutore = true;
      }
    },
    openTrialModal() {
      this.trialModal = true;
      this.trialMode = false;
    },
    closeTrialModal() {
      this.trialModal = false;
    },
    startTrialMode() {
      this.trialModal = false;

      this.trialMode = true;
      this.trialTime = 0;

      const shuffle = ([...array]) => {
        for (let i = array.length - 1; i >= 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }

      this.quizDataList = shuffle(this.quizDataList);

      this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
      this.quizNumber = 0;

      const intervalId = setInterval(() => {
        this.trialTime++;
        if(this.trialMode === false) {
          clearInterval(intervalId);
        }
      },1000)

    },
    closeResultModal() {
      this.resultModal = false;
    },
    backToHome() {
      this.trialMode = false;
      this.$router.push('/');
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

        if(this.$store.getters.currentUser.id !== ''){
          getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
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

              const shuffle = ([...array]) => {
                for (let i = array.length - 1; i >= 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
              }

              this.quizDataList = shuffle(this.quizDataList);
              this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
              
            });
          })
          .catch(() => {
            console.log('カスタムクイズデータ取得失敗');
          })
        }
        else {
          const shuffle = ([...array]) => {
            for (let i = array.length - 1; i >= 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
          }

          this.quizDataList = shuffle(this.quizDataList);


          this.$store.commit('updateCurrentQuiz', this.quizDataList[0]);
          }

      })
      .catch(() => {
        console.log('きほんクイズデータ取得失敗');
      })

  }
}
</script>

<style scoped lang="scss">
  .container {
    background-color: #beeffd;
    border: 5px solid #fff;
    margin: 0 auto;
    aspect-ratio: 16 / 9;
    width: auto;
    height: auto;
    max-height: 720px;

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

        .menuBtn {
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

        .active {
          color: #fa7e7e;
          background-color: yellow;
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

        .hint-letter {
          padding: 2vw;
          font-size: 6.5vw;
          line-height: 8.5vw;
          text-align: center;
          font-weight: bold;

          .new-hint-letter {
            color: #cccccc;
          }

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

            .noevent {
              pointer-events: none;
            }

          }

          li.nextEmpty {
            margin-bottom: 12%;
          }

        }

      }

    }

  }

.noevent {
  pointer-events: none;
}


</style>
