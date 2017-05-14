<template>
  <div id="app">
  {{msg}}
  <call :localvideo="activeCall.localVideo" :remotevideo="activeCall.remoteVideo"></call>
  <incomingcall v-for="call in incomingCalls" :caller="call.username" :key="call.username"></incomingcall>

  <v-btn :primary="callReady" :disabled="!callReady" v-on:click.native="call()">Call</v-btn>

  </div>
</template>

<script>
import Call from './Call.vue'
import IncomingCall from './IncomingCall.vue'

export default {
  name: 'app',
  components: {
      "call": Call,
      "incomingcall": IncomingCall
   },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      activeCalls : [{active:false}]
    }
  },
  methods: {
    call() {
      this.$store.dispatch("initOutgoing",{
        username:"doctor@h1"
      });
    },

  },
  computed: {
    incomingCalls : function() {
      return this.$store.getters.getIncoming;
    },
    callReady : function() {
      return this.$store.getters.getCallReady;
    },
    activeCall : function() {
      return this.$store.getters.getActive;
    }
  },
}
</script>

<style>

h1, h2 {
  font-weight: normal;
}

</style>
