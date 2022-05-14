<template>
  <div
  class="display">
    <div class="modal">
      <div class="form">
        <p class="title">新規登録</p>
        <div class="formContents" v-if="question1">
          <p class="question">ユーザー名を決めてください </p>
          <p class="note">※6文字以内で入力してください</p>
          <p v-if="usedUserName" class="errorMessage">この名前はすでに利用されているので使えません</p>
          <p v-if="emptyUserName" class="errorMessage">ユーザー名が入力されていません</p>
          <div>
            <input type="text" name="userName" value="" class="textbox" maxlength="6"
            v-model="inputtedUserName"
            @focus="hideError">
          </div>
          <div class="btnBlock">
            <div
            @click="closeSignupModal()"
            class="btn">◀やめる</div>
            <div
            @click="inputUserName()"
            class="btn">つぎへ▶</div>
          </div>
        </div>
        <div class="formContents" v-if="question2">
          <p class="question">パスワードを設定してください</p>
          <p class="note">※10文字以内で入力してください</p>
          <p v-if="emptyPassword" class="errorMessage">パスワードが入力されていません</p>
          <div>
            <input type="text" name="password" value="" class="textbox" maxlength="10"
            v-model="inputtedPassword"
            @focus="hideError">
          </div>
          <div class="btnBlock">
            <div
            @click="backToQuestion1()"
            class="btn">◀もどる</div>
            <div
            @click="inputPassword()"
            class="btn">つぎへ▶</div>
          </div>
        </div>
        <div class="formContents" v-if="confirmation">
          <p class="question">これでいいですか？</p>
          <div class="confirmation">
            <p>ユーザー名：{{ this.inputtedUserName }}</p>
            <p>パスワード：{{ this.inputtedPassword }}</p>
          </div>
          <div class="btnBlock">
            <div
            @click="backToQuestion2()"
            class="btn">◀もどる</div>
            <div
            @click="registerUser()"
            class="btn">完了▶</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {
  collection,
  addDoc,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  name: 'SignupModal',
  data() {
    return {
      usedUserName: false,
      emptyUserName: false,
      emptyPassword: false,
      inputtedUserName: '',
      inputtedPassword: '',
      question1: true,
      question2: false,
      confirmation: false,
      usersData: []
    }
  },
  methods: {
    closeSignupModal() {
      this.$emit('closeSignupModal');
    },
    hideError() {
      this.usedUserName = false;
      this.emptyUserName = false;
      this.emptyPassword = false;
    },
    inputUserName() {
      if(this.inputtedUserName === '') {
        this.emptyUserName = true;
      }
      else {

        getDocs(collection(getFirestore(), 'users'))
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            const userData = {
              id: doc.id,
              name: doc.data().name,
              password: doc.data().password
            }
            this.usersData.push(userData);
          })

          if(this.usersData.some(userData => userData.name === this.inputtedUserName)) {
            this.inputredUserName = '';
            this.usedUserName = true;
          }
          else {
            this.question1 = false;
            this.question2 = true;
          }

        })
        .catch(() => {
          console.log('データ取得失敗');
        })

      }
    },
    inputPassword() {
      if(this.inputtedPassword === '') {
        this.emptyPassword = true;
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
    registerUser() {
      const userData = {
        name: this.inputtedUserName,
        password: this.inputtedPassword
      };

      addDoc(collection(getFirestore(), 'users'), userData)
      .then((docRef) => {
        const currentUser = {
          name: this.inputtedUserName,
          id: docRef.id
        }
        this.$store.commit('updateCurrentUser', currentUser);
      })
      .catch(() => {
        console.log('データ登録失敗');
      })

      this.$emit('closeSignupModal');
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
      aspect-ratio: 7 / 6;

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
