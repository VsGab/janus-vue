import Janus from "./janus.nojquery"

class JanusCall {
  constructor(plugin,id) {
    this.plugin = plugin;
    this.id = id;
    this.incoming = false;
    this.remoteJsep = null;
    this.localJsep = null;
    console.log("constructed call");
  }
  initIncoming(username,remoteJsep) {
    this.remoteJsep = remoteJsep;
    this.incoming = false;
  }
  answer() {
    var self = this;
    self.plugin.createAnswer(
      {
        jsep: self.remoteJsep,
        // No media provided: by default, it's sendrecv for audio and video
        media: { data: true },	// Let's negotiate data channels as well
        success: function(jsep) {
          Janus.debug("Got SDP!");
          Janus.debug(jsep);
          self.localJsep = jsep;
          var body = { "request": "accept" };
          self.plugin.send({"message": body, "jsep": jsep});
        },
        error: function(error) {
          Janus.error("WebRTC error:", error);
        }
      });
  }
  initOutgoing(username) {
    var self = this;
    self.plugin.createOffer(
    {
      // By default, it's sendrecv for audio and video...
      media: { data: true },	// ... let's negotiate data channels as well
      success: function(jsep) {
        Janus.debug("Got SDP!");
        Janus.debug(jsep);
        var body = { "request": "call", "username": username };
        self.plugin.send({"message": body, "jsep": jsep});
      },
      error: function(error) {
        Janus.error("WebRTC error...", error);
      }
    });
  }
}

export default JanusCall
