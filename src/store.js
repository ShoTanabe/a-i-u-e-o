import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
	plugins: [createPersistedState({
		key: 'vuexapp',
		paths: [
			'currentUser'
		],
		storage: window.sessionStorage
	})],

  state: {
		currentQuiz: {
      id: '',
      name: '',
      letters: [],
      wordCount: '',
      url: ''
    },
    currentUser: {
      id: '',
      name: ''
    },
    trialTime: 0
  },
  getters: {
		currentQuiz: state => state.currentQuiz,
		currentUser: state => state.currentUser,
		trialTime: state => state.trialTime,
  },
  mutations: {
		updateCurrentQuiz(state, currentQuiz) {
			state.currentQuiz = currentQuiz
		},
		updateCurrentUser(state, currentUser) {
			state.currentUser = currentUser
		},
		updateTrialTime(state, trialTime) {
			state.trialTime = trialTime
		},
  }


});