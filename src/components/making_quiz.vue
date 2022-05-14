<template>
  <div
  class="display">
    <div class="modal">
      <div class="form">
        <p class="title">クイズ追加</p>
        <div class="formContents" v-if="question1">
          <p class="question">読み方を入力してください</p>
          <p class="note">※全角ひらがな5文字以内で入力してください</p>
          <p v-if="emptyQuizName" class="errorMessage">読み方が入力されていません</p>
          <p v-if="unusablseLetters" class="errorMessage">ひらがな以外は入力できません</p>
          <div>
            <input type="text" name="quizName" value="" class="textbox" maxlength="5"
            v-model="inputtedQuizName"
            @focus="hideError">
          </div>
          <div class="btnBlock">
            <div
            @click="closeMakingQuizModal()"
            class="btn">◀やめる</div>
            <div
            @click="inputQuizName()"
            class="btn">つぎへ▶</div>
          </div>
        </div>
        <div class="formContents" v-if="question2">
          <p class="question">画像を設定してください</p>
          <p class="note">※4MB以下のファイルを設定してください<br>※.jpg、.gif、.pngいずれかのファイルのみ対応しています</p>
          <p v-if="emptyImg" class="errorMessage">画像が設定されていません</p>
          <p v-if="overSize" class="errorMessage">ファイルの上限サイズ4MBを超えています</p>
          <p v-if="differentExtensions" class="errorMessage">ファイルの形式は.jpg、.gif、.pngいずれかにしてください</p>
          <div class="fileSelectBlock">
            <input type="file" name="quizimg" value="" ref="quizimg"
            @change="selectFile"
            @click="hideError()">
          </div>
          <div class="btnBlock">
            <div
            @click="backToQuestion1()"
            class="btn">◀もどる</div>
            <div
            @click="inputQuizImg()"
            class="btn">つぎへ▶</div>
          </div>
        </div>
        <div class="formContents" v-if="confirmation">
          <p class="question">これでいいですか？</p>
          <div class="confirmation">
            <p>読み方：{{ this.inputtedQuizName }}</p>
            <div class="previewImg"><img :src="this.previewURL" alt=""></div>
          </div>
          <div class="btnBlock">
            <div
            @click="backToQuestion2()"
            class="btn">◀もどる</div>
            <div
            @click="registerQuiz()"
            class="btn">完了▶</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
  } from "firebase/storage";

import {
  collection,
  addDoc,
  getFirestore,
  } from "firebase/firestore";

export default {
  name: 'MakingQuizModal',
  data() {
    return {
      emptyQuizName: false,
      emptyImg: false,
      unusablseLetters: false,
      overSize: false,
      differentExtensions: false,
      inputtedQuizName: '',
      inputtedimg: '',
      previewURL: '',
      question1: true,
      question2: false,
      confirmation: false,
      usersData: [],
    }
  },
  computed: {
    quizLetters() {
      const str = this.inputtedQuizName
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

    },
    currentUser() {
      return this.$store.getters.currentUser;
    },
  },
  methods: {
    closeMakingQuizModal() {
      this.$emit('closeMakingQuizModal');
    },
    hideError() {
      this.unusablseLetters = false;
      this.emptyQuizName = false;
      this.emptyImg = false;
      this.overSize = false;
      this.differentExtensions = false;
    },
    inputQuizName() {
      if(this.inputtedQuizName === '') {
        this.emptyQuizName = true;
      }
      else if(!this.inputtedQuizName.match(/^[ぁ-んー]+$/)) {
        this.unusablseLetters = true;
      }
      else {
        console.log(this.quizLetters);
        this.question1 = false;
        this.question2 = true;

      }
    },
    selectFile(event) {
      this.inputtedimg = event.target.files[0];
      this.previewURL = URL.createObjectURL(this.inputtedimg);
    },
    inputQuizImg() {
      if(this.inputtedimg === '') {
        this.emptyImg = true;
      }
      else if(this.inputtedimg.size > 4000000) {
        this.overSize = true;
      }
      else if(this.inputtedimg.type !== 'image/jpeg' && this.inputtedimg.type !== 'image/gif' && this.inputtedimg.type !== 'image/png') {
        this.differentExtensions = true;
      }
      else {
        this.question2 = false;
        this.confirmation = true;
      }
    },
    backToQuestion1() {
      this.question2 = false;
      this.question1 = true;
    },
    backToQuestion2() {
      this.confirmation = false;
      this.question2 = true;
    },
    registerQuiz() {
      const storage = getStorage();
      const fileName = this.inputtedimg.name;
      const storageRef = ref(storage, 'custom-img/' +  fileName + Date.now());
      const uploadTask = uploadBytesResumable(storageRef, this.inputtedimg);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(fileName);
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              console.log('unauthorized');
              break;
            case 'storage/canceled':
              console.log('canceled');
              break;
            case 'storage/unknown':
              console.log('unknown');
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            const quizData = {
              name: this.inputtedQuizName,
              letters: this.quizLetters,
              path: downloadURL,
              wordcount: this.inputtedQuizName.length
            }

            addDoc(collection(getFirestore(), 'users', this.currentUser.id, 'quiz'), quizData)
            .then(() => {
              this.$emit('addNewQuiz');
            })
            .catch(() => {
              console.log('クイズデータ登録失敗');
            })
          })
        }
      );

    }
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
      width: 40%;
      background-color: #fff;
      border-radius: 20%;
      border: solid 5px #ff763b;
      display: flex;
      justify-content: center;
      aspect-ratio: 7 / 7.5;

      .form {
        text-align: center;
        margin-top: 5.5vw;
        font-weight: bold;
        width: 80%;

        .title {
          font-size: 3vw;
        }

        .formContents {
          width: 100%;

          .question {
            margin-top: 4vw;
            font-size: 2vw;
          }

          .confirmation {
            margin-top: 1.5vw;
            font-size: 1.6vw;

            .previewImg {
              width: 100%;
              margin-top: 0.5vw;
              text-align: center;

              img {
                width: 40%;
              }

            }

          }

          .note {
            margin-top: 0.5vw;
            font-size: 1vw;
          }
          .errorMessage {
            color:#ff763b;
            margin-top: 0.5vw;
            font-size: 1vw;
          }

          .fileSelectBlock {
            text-align: center;
            margin-top: 2vw;
          }

          .textbox {
            font-size: 2vw;
            width: 80%;
            margin-top: 1vw;
            padding: 0.5vw;
            border-radius: 10px;
            border: solid 1px #888888;
          }

          .btnBlock {
            margin-top: 4vw;
            display: flex;
            justify-content: center;
          }

          .btn {
            cursor: pointer;
            font-size: 2vw;
            width: 40%;
          }

        }


      }

    }

  }
</style>
