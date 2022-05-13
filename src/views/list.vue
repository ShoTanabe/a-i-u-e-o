<template>
  <div class="container">
    <div class="menuArea clelarfix">
      <div class="userName">
        <div class="dotLine">
          <p class="name">{{ currentUserName }}</p>
          <p class="mrmiss">さん</p>
        </div>
      </div>
      <div class="menuBtn">
        <div
        v-if="this.currentUser.name === ''"
        @click="openLoginModal()"
        class="btn">ログイン</div>
        <div
        v-if="this.currentUser.name === ''"
        @click="openSignupModal()"
        class="btn">新規登録</div>
        <div
        v-if="this.currentUser.name !== ''"
        @click="logout()"
        class="btn">ログアウト</div>
        <div
        v-if="this.currentUser.name !== ''"
        @click="openMakingQuizModal()"
        class="btn">クイズ追加</div>
        <div
        @click="goToHome()"
        class="btn">もどる</div>
      </div>
    </div>
    <div class="scrollArea">
      <div class="quizListArea">


        <div class="listTitleBlock">
          <p class="listTitle">クイズリスト</p>
          <p class="supplement">（カスタムセット）</p>
        </div>
        <div
        v-if="this.currentUser.name === ''"
        class="messageForGuestBlock">
          <p class="messageForGuest">
            ログインするとオリジナルクイズを追加できます
          </p>
          <div class="menuBtn">
            <div
            @click="openLoginModal()"
            class="btn">ログイン</div>
            <div
            @click="openSignupModal()"
            class="btn">新規登録</div>
          </div>
        </div>
        <div
        v-if="this.currentUser.name !== '' && this.customQuizDataList.length === 0"
        class="messageForGuestBlock">
          <p class="messageForGuest">
            オリジナルのクイズを追加しましょう
          </p>
          <div class="menuBtn">
            <div
            @click="openMakingQuizModal()"
            class="btn">クイズ追加</div>
          </div>
        </div>
        <div
        v-if="this.currentUser.name !== '' && this.customQuizDataList.length !== 0"
        class="quizList">
          <div
          v-for="(quiz, i) in customQuizDataList"
          :key="quiz.name + i"
          :class="{quiz, leftEnd: (i + 1)%4 === 1}"
          @mouseover="openCustomMenu(quiz)"
          @mouseleave="closeCustomMenu(quiz)">

            <div
            v-if="quiz.customMenu"
            class="customMenu">
              <div class="customMenuBtn">
                <p
                @click="displayEditAnswer(quiz)"
                class="customBtn">読み方を変更</p>
                <p
                @click="deleteQuiz(quiz)"
                class="customBtn">削除</p>
              </div>
            </div>

            <p v-if="!quiz.editAnswer" class="answer">{{ quiz.name }}</p>
            <div v-if="quiz.editAnswer" class="editBlock">
              <p class="answer">
                <input
                type="text"
                v-model="edittedAnswer">
              </p>
              <div
              @click="reflectEdit(quiz)"
              class="editBtn">OK</div>
            </div>
            <div class="imgBlock">
              <img :src="quiz.url" alt="">
            </div>
          </div>

        </div>

        <div class="listTitleBlock">
          <p class="listTitle">クイズリスト</p>
          <p class="supplement">（きほんセット）</p>
        </div>
        <div class="quizList">
          <div
          v-for="(quiz, i) in quizDataList"
          :key="quiz.name + i"
          :class="{quiz, leftEnd: (i + 1)%4 === 1}">
            <p class="answer">{{ quiz.name }}</p>
            <div class="imgBlock">
              <img :src="quiz.url" alt="">
            </div>
          </div>
        </div>


      </div>
    </div>

    <div v-if="this.signupModal" v-cloak>
      <SignupModal
      @closeSignupModal="closeSignupModal">
      </SignupModal>
    </div>
    <div v-if="this.loginModal" v-cloak>
      <LoginModal
      @closeLoginModal="closeLoginModal"
      @completeLogin="completeLogin">
      </LoginModal>
    </div>
    <div v-if="this.makingQuizModal" v-cloak>
      <MakingQuizModal
      @closeMakingQuizModal="closeMakingQuizModal"
      @addNewQuiz="addNewQuiz">
      </MakingQuizModal>
    </div>

  </div>

</template>

<script>
import SignupModal from '@/components/signup.vue'
import LoginModal from '@/components/login.vue'
import MakingQuizModal from '@/components/making_quiz.vue'

import {
  collection,
  getFirestore,
  getDocs,
  doc,
  deleteDoc,
  setDoc,
  } from "firebase/firestore";

export default {
  components: {
    SignupModal,
    LoginModal,
    MakingQuizModal
  },
  data() {
    return {
      quizDataList: [],
      customQuizDataList: [],
      signupModal: false,
      loginModal: false,
      makingQuizModal: false,
      quizCustomMenu: false,
      edittedAnswer: ''
    }
  },
  computed: {
    currentUser() {
      return this.$store.getters.currentUser;
    },
    currentUserName() {
      if(this.currentUser.name === '') {
        return 'ゲスト';
      }
      else {
        return this.currentUser.name;
      }
    },
    edittedLetters() {
      const str = this.edittedAnswer
      .replace(/が/g, 'か゛')
      .replace(/ぎ/g, 'き゛')
      .replace(/ぐ/g, 'く゛')
      .replace(/げ/g, 'け゛')
      .replace(/ご/g, 'こ゛')
      .replace(/ざ/g, 'さ゛')
      .replace(/じ/g, 'し゛')
      .replace(/ず/g, 'す゛')
      .replace(/ぜ/g, 'そ゛')
      .replace(/だ/g, 'た゛')
      .replace(/ぢ/g, 'ち゛')
      .replace(/づ/g, 'つ゛')
      .replace(/で/g, 'て゛')
      .replace(/ど/g, 'と゛')
      .replace(/ば/g, 'は゛')
      .replace(/び/g, 'ひ゛')
      .replace(/ぶ/g, 'ふ゛')
      .replace(/べ/g, 'へ゛')
      .replace(/ぼ/g, 'ほ゛')
      .replace(/ぱ/g, 'は゜')
      .replace(/ぴ/g, 'ひ゜')
      .replace(/ぷ/g, 'ふ゜')
      .replace(/ぺ/g, 'へ゜')
      .replace(/ぽ/g, 'ほ゜');

      let arrayLetters = str.split('');

      return arrayLetters;
    }
  },
  methods: {
    openSignupModal() {
      this.signupModal = true;
    },
    closeSignupModal() {
      this.signupModal = false;
    },
    openLoginModal() {
      this.loginModal = true;
    },
    closeLoginModal() {
      this.loginModal = false;
    },
    completeLogin() {

      getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
        .then((querySnapshot) => {
          this.customQuizDataList = [];
          querySnapshot.forEach((doc) => {
            const quizData = {
              id: doc.id,
              name: doc.data().name,
              letters: doc.data().letters,
              wordCount: doc.data().wordcount,
              url: doc.data().path,
              customMenu: false,
              editAnswer: false
            };
            this.customQuizDataList.push(quizData);
            this.loginModal = false;
          });
        })
        .catch(() => {
          console.log('カスタムクイズデータ取得失敗');
        })

    },
    openMakingQuizModal() {
      this.makingQuizModal = true;
    },
    closeMakingQuizModal() {
      this.makingQuizModal = false;
    },
    addNewQuiz() {
      getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
        .then((querySnapshot) => {
          this.customQuizDataList = [];
          querySnapshot.forEach((doc) => {
            const quizData = {
              id: doc.id,
              name: doc.data().name,
              letters: doc.data().letters,
              wordCount: doc.data().wordcount,
              url: doc.data().path,
              customMenu: false,
              editAnswer: false
            };
            this.customQuizDataList.push(quizData);
            this.makingQuizModal = false;
          });
        })
        .catch(() => {
          console.log('カスタムクイズデータ取得失敗');
        })
    },
    deleteQuiz(quiz) {
      deleteDoc(doc(getFirestore(), 'users', this.currentUser.id, 'quiz', quiz.id))
      .then(() => {
        getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
          .then((querySnapshot) => {
            this.customQuizDataList = [];
            querySnapshot.forEach((doc) => {
              const quizData = {
                id: doc.id,
                name: doc.data().name,
                letters: doc.data().letters,
                wordCount: doc.data().wordcount,
                url: doc.data().path,
                customMenu: false,
                editAnswer: false
              };
              this.customQuizDataList.push(quizData);
            });
          })
          .catch(() => {
            console.log('カスタムクイズデータ取得失敗');
          })
      })
      .catch(() => {
        console.log('クイズデータ削除失敗');
      })
    },
    displayEditAnswer(quiz) {
      quiz.customMenu = false;
      quiz.editAnswer = true;
      this.edittedAnswer = '';
    },
    reflectEdit(quiz) {
      setDoc(doc(getFirestore(), 'users', this.currentUser.id, 'quiz', quiz.id), {
        name: this.edittedAnswer,
        letters: this.edittedLetters,
        path: quiz.url,
        wordcount: this.edittedAnswer.length
      })
      .then(() => {

        getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
          .then((querySnapshot) => {
            this.customQuizDataList = [];
            querySnapshot.forEach((doc) => {
              const quizData = {
                id: doc.id,
                name: doc.data().name,
                letters: doc.data().letters,
                wordCount: doc.data().wordcount,
                url: doc.data().path,
                customMenu: false,
                editAnswer: false
              };
              this.customQuizDataList.push(quizData);
              quiz.editAnswer = false;
            });
          })
          .catch(() => {
            console.log('カスタムクイズデータ取得失敗');
          })

      })
      .catch(() => {
        console.log('データ更新失敗');
      })
    },
    goToHome() {
      this.$router.push('/');
    },
    logout() {
      const currentUser = {
        name: '',
        id: ''
      }
      this.$store.commit('updateCurrentUser', currentUser);
      this.customQuizDataList = [];
    },
    openCustomMenu(quiz) {
      if(!quiz.editAnswer){
        quiz.customMenu = true;
      }
      else {
        quiz.customMenu = false;
      }
    },
    closeCustomMenu(quiz) {
      quiz.customMenu = false;
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
      })
      .catch(() => {
        console.log('クイズデータ取得失敗');
      })

    getDocs(collection(getFirestore(), 'users', this.$store.getters.currentUser.id, 'quiz'))
      .then((querySnapshot) => {
        this.customQuizDataList = [];
        querySnapshot.forEach((doc) => {
          const quizData = {
            id: doc.id,
            name: doc.data().name,
            letters: doc.data().letters,
            wordCount: doc.data().wordcount,
            url: doc.data().path,
            customMenu: false,
            editAnswer: false
          };
          this.customQuizDataList.push(quizData);
        });
      })
      .catch(() => {
        console.log('カスタムクイズデータ取得失敗');
      })
      
  }
}
</script>


<style scoped lang="scss">
  .container {
    aspect-ratio: 16 / 9;
    background-image: url(/list-bg.png);
    background-size: contain;
    border: 5px solid #fff;
    width: 100%;
    height: auto;
    margin: 0 auto;
    max-height: 720px;
    position: relative;

    .menuArea {
      background-color: #B3E37D;
      width: 100%;
      height: 20%;
      padding: 1vw 1vw 0 1vw;

      .userName {
        width: 20%;
        height: 100%;
        background-color: #fff;
        transform:rotate(-5deg);
        box-shadow: 5px 3px 8px -7px #777777;
        border-radius: 10px;
        text-align: center;
        padding: 0.5vw;
        float: left;

        .dotLine {
          border: dotted 2px #FA7E7E;
          width: 100%;
          height: 100%;
          padding: 1.5vw 0.5vw;


          .name {
            font-size: 2.3vw;
            font-weight: bold;
          }

          .mrmiss {
            font-size: 1.8vw;
          }

        }

      }

      .menuBtn {
        float: left;
        margin-left: 9vw;
        display: flex;
        padding-top: 1.2vw;

        .btn {
          width: 12vw;
          height: 5vw;
          font-size: 2vw;
          line-height: 4.8vw;
          text-align: center;
          color: #fff;
          font-weight: bold;
          border: solid #fff 0.3vw;
          border-radius: 10px;;
          background-color: #FA7E7E;
          margin-left: 1.5vw;
          cursor: pointer;
        }

      }

    }

    .scrollArea {
      width: 100%;
      height: 80%;
      overflow-y: auto;
      overflow-y: scroll;

      &::-webkit-scrollbar  {
        overflow:hidden;
        width: 5px;
        background:#fafafa;
        border-radius:10px;

        &:horizontal {
            height: 5px;
        }

      }

      &::-webkit-scrollbar-button {
        display:none;
      }

      &::-webkit-scrollbar-piece {
        background:#eee;
        &:start {
          background-color:#eee;
        }
      }

      &::-webkit-scrollbar-thumb {
        background:#b5b5b5;
        border-radius:10px;
      }

      &::-webkit-scrollbar-corner {
        background:#b5b5b5;
        border-radius:10px;
      }


      .quizListArea {

        .listTitleBlock {
          width: 60%;
          background-color: #fff;
          border-radius: 20px;
          margin: 2vw auto;
          padding: 1vw;

          .listTitle {
            text-align: center;
            font-size: 4vw;
            font-weight: bold;
            color: #FA7E7E;
          }

          .supplement {
            text-align: center;
            font-size: 2vw;
            font-weight: bold;
            color: #FA7E7E;
          }

        }

        .quizList {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          padding: 0 2vw;

          .quiz {
            width: 23%;
            background-color: #ab8543;
            border-radius: 10px;
            margin-left: 2vw;
            margin-bottom: 2vw;
            position: relative;

            &:first-child {
              margin-left: 0;
            }

            .answer {
              width: 80%;
              border-radius: 5px;
              color: #fff;
              background-color: #6b532a;
              font-size: 1.5vw;
              text-align: center;
              margin: 1vw auto;
              padding: 0.5vw 0;

              input {
                display: block;
                width: 100%;
              }

            }

            .editBlock {
              width: 100%;
              position: relative;

              .editBtn {
                position: absolute;
                width: 3vw;
                height: 3vw;
                top: 0;
                right: 1vw;
                background-color: #ffff00;
                color: red;
                text-align: center;
                line-height: 3vw;
                border-radius: 50%;
                font-weight: bold;
                cursor: pointer;

                &:hover {
                  background-color: #ffcc00;
                }

              }

            }

            .imgBlock {
              background-color: #fff;
              width: 80%;
              margin: 0 auto 1.5vw auto;
              border-radius: 5px;
              text-align: center;
              padding: 1vw 0;

              img {
                width: 80%;
              }
            }


          }

          .leftEnd {
            margin-left: 0;
          }

          .customMenu {
            width: 100%;
            height: 100%;
            border-radius: 10px;
            background-color: rgba(119, 119, 119, 0.7);
            position: absolute;
            top: 0;
            left: 0;

            .customMenuBtn {
              width: 60%;
              margin: 9vw auto 0 auto;

              .customBtn {
                text-align: center;
                font-size: 1vw;
                color: #fff;
                background-color: #5946ff;
                padding: 0.5vw;
                margin-bottom: 0.5vw;
                border: 2px #fff solid;
                border-radius: 6px;
                cursor: pointer;
              }

            }


          }

        }

        .messageForGuestBlock {
          margin-top: 3vw;

          .messageForGuest {
            text-align: center;
            font-size: 2vw;
          }

          .menuBtn {
            margin: 2vw 0 5vw 0;
            display: flex;
            justify-content: center;

            .btn {
              width: 12vw;
              height: 5vw;
              font-size: 2vw;
              line-height: 4.8vw;
              text-align: center;
              color: #fff;
              font-weight: bold;
              border: solid #fff 0.3vw;
              border-radius: 10px;;
              background-color: #FA7E7E;
              margin-left: 1.5vw;
              cursor: pointer;
            }

          }

        }

      }

    }

  }
</style>