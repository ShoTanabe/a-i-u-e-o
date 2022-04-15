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
  },
  getters: {
		currentQuiz: state => state.currentQuiz,
  },
  mutations: {
		updateCurrentQuiz(state, currentQuiz) {
			state.currentQuiz = currentQuiz
		},
  }


});