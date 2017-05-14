import Janus from "./janus.nojquery"
import JanusCall from "./JanusCall"

var vuexStore = null;
var janus = null;
var videocall = null;
var currentCallId = 1;
var currentCall = null;

function sessionCreated() {
  // Attach to echo test plugin
  janus.attach(
    {
      plugin: "janus.plugin.videocall",
      success: function(pluginHandle) {
        videocall = pluginHandle;
        Janus.log("Plugin attached! (" + videocall.getPlugin() + ", id=" + videocall.getId() + ")");

        registerUsername();
      },
      error: function(error) {
        Janus.error("  -- Error attaching plugin...", error);
      },
      consentDialog: function(on) {
        Janus.debug("Consent dialog should be " + (on ? "on" : "off") + " now");
      },
      mediaState: function(medium, on) {
        Janus.log("Janus " + (on ? "started" : "stopped") + " receiving our " + medium);
      },
      webrtcState: function(on) {
        Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
      },
      onmessage: function(msg, jsep) {
        Janus.debug(" ::: Got a message :::");
        Janus.debug(JSON.stringify(msg));
        var result = msg["result"];
        if(result !== null && result !== undefined) {
          if(result["event"] !== undefined && result["event"] !== null) {
            var event = result["event"];
            if(event === 'registered') {
              onRegistered(result["username"]);
            } else if(event === 'calling') {
              Janus.log("Waiting for the peer to answer...");
              // TODO Any ringtone?
            } else if(event === 'incomingcall') {
              // TODO Enable buttons to answer
              onIncomingCall(result["username"],jsep)
            } else if(event === 'accepted') {
              onRemoteAccepted(result["username"],jsep);
            } else if(event === 'hangup') {
              Janus.log("Call hung up by " + result["username"] + " (" + result["reason"] + ")!");
              // TODO Reset status
              onRemoteHangup();
            }
          }
        } else {
          // FIXME Error?
          var error = msg["error"];
          // TODO Reset status
          videocall.hangup();
        }
      },
      onlocalstream: function(stream) {
        Janus.debug(" ::: Got a local stream :::");
        Janus.debug(JSON.stringify(stream));
        var localVideoId = vuexStore.getters.getActive.localVideo;
        Janus.attachMediaStream(document.getElementById(localVideoId), stream);

        var videoTracks = stream.getVideoTracks();
        if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
          Janus.debug("No camera found");
        }
      },
      onremotestream: function(stream) {
        Janus.debug(" ::: Got a remote stream :::");
        Janus.debug(JSON.stringify(stream));
        var remoteVideoId = vuexStore.getters.getActive.remoteVideo;
        Janus.attachMediaStream(document.getElementById(remoteVideoId), stream);
        var videoTracks = stream.getVideoTracks();

      },
      ondataopen: function(data) {
        Janus.log("The DataChannel is available!");

      },
      ondata: function(data) {
        Janus.debug("We got data from the DataChannel! " + data);
      },
      oncleanup: function() {
        Janus.log(" ::: Got a cleanup notification :::");
      }
    });
};

function onRemoteAccepted(peer, jsep) {
  if(peer === null || peer === undefined) {
    Janus.log("Call started!");
  } else {
    Janus.log(peer + " accepted the call!");
  }
  // TODO Video call can start
  if(jsep !== null && jsep !== undefined)
    videocall.handleRemoteJsep({jsep: jsep});
}

function onIncomingCall(username, jsep) {
  Janus.log("Incoming call from " + username + "!");
  let callHandle = new JanusCall(videocall,currentCallId++);
  callHandle.initIncoming(username,jsep);
  currentCall = callHandle;
  vuexStore.dispatch("initIncoming",{
      username:username
    });
}

function onRemoteHangup() {
  videocall.hangup();
  vuexStore.dispatch("remoteHangup");
}

function onRegistered(username) {
  Janus.log("Successfully registered as " + username + "!");
  vuexStore.commit("setCallReady");
}

function registerUsername() {
var register = { "request": "register", "username": "test@h1" };
videocall.send({"message": register});
}

function doHangup() {
// Hangup a call
var hangup = { "request": "hangup" };
videocall.send({"message": hangup});
videocall.hangup();
}

function createSession() {
  // Create session
  janus = new Janus(
    {
      server: "wss://lifemeaning.space:9001/janus",
      success: sessionCreated,
      error: function(error) {
        Janus.error(error);
      },
      destroyed: function() {
        window.location.reload();
      }
    });
}


export default {
  init(store) {
    vuexStore = store;
    Janus.init({debug: true, callback: function() {
      // Make sure the browser supports WebRTC
      if(!Janus.isWebrtcSupported()) {
        return;
      }
      createSession();
    }});
  },
  call(username) {
    let callHandle = new JanusCall(videocall,currentCallId++);
    callHandle.initOutgoing(username);
    currentCall = callHandle;
    return callHandle;
  },
  hangup() {
    doHangup();
  },
  answer(username) {
    currentCall.answer();
  }


}
