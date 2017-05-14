import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import App from './App.vue'
import JanusService from './JanusService'

Vue.use(Vuetify);
Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    callReady: false,
    incomingCalls: [],
    activeCall: {
      enabled : false,
      username: null,
      localVideo: "local1",
      remoteVideo: "remote1"
    }
  },
  mutations: {
  	setActive: (state,data) => {
      state.activeCall.username = data.username;
      state.activeCall.enabled = true;
    },
    clearActive: (state) => {
      state.activeCall.username = null;
      state.activeCall.enabled = false;
    },
    addIncoming: (state,data) => {
      state.incomingCalls.push(data);
    },
    clearIncoming: (state) => {
      state.incomingCalls = [];
    },
    setCallReady: (state) => state.callReady=true,
    unsetCallReady: (state) => state.callReady=false
  },
  getters: {
    getIncoming: state => {
      return JSON.parse(JSON.stringify(state.incomingCalls));
    },
    getActive: state => {
      return JSON.parse(JSON.stringify(state.activeCall));
    },
    getCallReady : state => state.callReady
  },
  actions: {
    initOutgoing(ctx,data) {
      JanusService.call(data.username);
      ctx.commit("setActive",data);
    },
    initIncoming(ctx,data) {
      ctx.commit("addIncoming",data);
    },
    answer(ctx,data) {
      JanusService.answer(data.username);
      ctx.commit("clearIncoming");
      ctx.commit("setActive",data);
    },
    hangup(ctx) {
      JanusService.hangup();
      ctx.commit("clearActive");
    },
    remoteHangup(ctx) {
      ctx.commit("clearActive");
    }
  }
})

JanusService.init(store);

new Vue({
  el: '#app',
  store: store,
  render: h => h(App)
})
