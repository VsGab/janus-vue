
<template>
        <v-card v-if="activeCall.enabled" class="video-group">
          <v-card-row dark>{{activeCall.username}}</v-card-row>
          <video v-bind:id="remotevideo" autoplay="autoplay" class="remote"></video>
          <video v-bind:id="localvideo" autoplay="autoplay" class="local" muted="muted"></video>

          <div class="video-controls">
            <v-btn icon="icon" large error v-on:click.native="onHangup">
             <v-icon large>call_end</v-icon>
           </v-btn>
           <v-btn icon="icon" large v-on:click.native="onMicToggle">
            <v-icon large>{{micIcon}}</v-icon>
          </v-btn>
          <v-btn icon="icon" large v-on:click.native="onCamToggle">
           <v-icon large>{{camIcon}}</v-icon>
         </v-btn>
          </div>
          <v-snackbar :timeout="1000" bottom absolute v-model="snackbarOn">
            {{snackbarMsg}}
          </v-snackbar>
      </v-card>
</template>

<script>


function getMicIcon(muted) {
  return muted ? "mic_off" : "mic";
}

function getCamIcon(muted) {
  return muted ? "videocam_off" : "videocam";
}

function getOnOff(status) {
  return status ? "ON" : "OFF" ;
}

export default {
  name: 'call',
  props: ['localvideo','remotevideo'],
  data: function() {
    return {
      snackbarMsg : "",
      snackbarOn : false,
      micMuted : false,
      micIcon : getMicIcon(false),
      camMuted: false,
      camIcon: getCamIcon(false)
    }
  },
  methods : {
    onMicToggle : function() {
      this.micMuted = ! this.micMuted;
      this.micIcon = getMicIcon(this.micMuted);
      this.snackbarMsg = getOnOff(!this.micMuted);
      this.snackbarOn = true;
    },
    onCamToggle : function() {
      this.camMuted = ! this.camMuted;
      this.camIcon = getCamIcon(this.camMuted);
      this.snackbarMsg = getOnOff(!this.camMuted);
      this.snackbarOn = true;
    },
    onHangup : function() {
      this.$store.dispatch("hangup");
    }
  },
  computed : {
    activeCall : function() {
      return this.$store.getters.getActive;
    }
  }
}
</script>

<style>

.video-group {
  position: relative;
  width:600px;
  overflow: hidden;
}


.video-group video.remote {
  position: relative;
  width: 600px;
  height: 300px;
  background-color: #000;
}

.video-group video.local {
  width: 100px;
  height: 100px;
  position: absolute;
  right: 10px;
  top: 10px;
  background-color: #555;
}

.video-group .video-controls {
  position: absolute;
  bottom: 10px;
  width: 100%;
  display: block;
  color: #fff;
}

</style>
