<template>

  <v-card class="blue white--text incomingcallcard ">
   <v-card-row height="3em">
     <v-card-title>
      {{caller}}
     </v-card-title>
   </v-card-row>
   <v-card-row actions>
     <v-btn flat dark v-on:click.native="onAnswer()">Answer</v-btn>
     <v-spacer></v-spacer>
     <v-btn flat dark>Decline</v-btn>
   </v-card-row>
 </v-card>

</template>


<script>

export default {
  name: 'incomingcall',
  props: ["caller"],
  computed: {
    count : function() {
      return this.$store.getters.getCount;
    }
  },
  methods : {
    onAnswer : function() {
      this.$store.dispatch("answer",{username:this.caller});
    },
    onHangup : function() {
      this.$store.dispatch("hangup");
    }
  }
}


</script>

<style>

.incomingcallcard {
  max-width: 20em;
}

</style>
