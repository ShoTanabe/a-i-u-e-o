import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({

  state: {
		currentQuiz: {
      id: '',
      name: '',
      letters: [],
      wordCount: '',
      url: ''
    },
    trialTime: 0
  },
  getters: {
		currentQuiz: state => state.currentQuiz,
		trialTime: state => state.trialTime,
  },
  mutations: {
		updateCurrentQuiz(state, currentQuiz) {
			state.currentQuiz = currentQuiz
		},
		updateTrialTime(state, trialTime) {
			state.trialTime = trialTime
		},
  }


});