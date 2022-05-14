<template>
  <div
  class="display">
    <div class="modal">
      <div class="form">
        <p class="title">ログイン</p>
        <div class="formContents" v-if="question1">
          <p class="question">ユーザー名を入力してください </p>
          <p v-if="unregisteredName" class="errorMessage">このユーザー名は登録されていません</p>
          <p v-if="emptyUserName" class="errorMessage">ユーザー名が入力されていません</p>
          <div>
            <input type="text" name="userName" value="" class="textbox" maxlength="6"
            v-model="inputtedUserName"
            @focus="hideError">
          </div>
          <div class="btnBlock">
            <div
            @click="closeLoginModal()"
            class="btn">◀やめる</div>
            <div
            @click="inputUserName()"
            class="btn">つぎへ▶</div>
          </div>
        </div>
        <div class="formContents" v-if="question2">
          <p class="question">パスワードを入力してください</p>
          <p v-if="emptyPassword" class="errorMessage">パスワードが入力されていません</p>
          <p v-if="wrongPassword" class="errorMessage">パスワードがちがいます</p>
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
            class="btn">ログイン▶</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import {
  collection,
  getFirestore,
  getDocs
  } from "firebase/firestore";

export default {
  name: 'LoginModal',
  data() {
    return {
      unregisteredName: false,
      emptyUserName: false,
      emptyPassword: false,
      wrongPassword: false,
      inputtedUserName: '',
      inputtedPassword: '',
      question1: true,
      question2: false,
      usersData: [],
      selectedUser: '',
    }
  },
  methods: {
    closeLoginModal() {
      this.$emit('closeLoginModal');
    },
    hideError() {
      this.unregisteredName = false;
      this.emptyUserName = false;
      this.emptyPassword = false;
      this.wrongPassword = false;
    },
    inputUserName() {
      if(this.inputtedUserName === '') {
        this.emptyUserName = true;
      }
      else {
        if(this.usersData.some(userData => userData.name === this.inputtedUserName)) {
          this.selectedUser = this.usersData.find(userData => userData.name === this.inputtedUserName);
          this.question1 = false;
          this.question2 = true;
        }
        else {
          this.unregisteredName = true;
        }
      }
    },
    inputPassword() {
      if(this.inputtedPassword === '') {
        this.emptyPassword = true;
      }
      else {

        if(this.inputtedPassword === this.selectedUser.password) {
          const currentUser = {
            name: this.selectedUser.name,
            id: this.selectedUser.id
          }
          this.$store.commit('updateCurrentUser', currentUser);

          this.$emit('completeLogin');
        }
        else {
          this.wrongPassword = true;
        }
      }
    },
    backToQuestion1() {
      this.question2 = false;
      this.question1 = true;
    },
  },
  created() {
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
    })
    .catch(() => {
      console.log('データ取得失敗');
    })
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
