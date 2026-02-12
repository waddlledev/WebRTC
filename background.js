function blockWebRTC() {
  // Disable peer connections
  var setting = browser.privacy.network.peerConnectionEnabled.set({
    value: false
  });
  
  // Disable WebRTC non-proxied UDP
  var udpSetting = browser.privacy.network.webRTCIPHandlingPolicy.set({
    value: "disable_non_proxied_udp"
  });
  
  return Promise.all([setting, udpSetting]);
}

function allowWebRTC() {

  var setting = browser.privacy.network.peerConnectionEnabled.set({
    value: true
  });
  
  var udpSetting = browser.privacy.network.webRTCIPHandlingPolicy.set({
    value: "default"
  });
  
  return Promise.all([setting, udpSetting]);
}

browser.runtime.onStartup.addListener(() => {
  browser.storage.local.get('webrtcBlocked').then((result) => {
    if (result.webrtcBlocked !== false) {
      blockWebRTC();
    }
  });
});

browser.runtime.onInstalled.addListener(() => {
  browser.storage.local.set({ webrtcBlocked: true });
  blockWebRTC();
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "block") {
    return blockWebRTC().then(() => {
      browser.storage.local.set({ webrtcBlocked: true });
      return { status: "blocked" };
    });
  } else if (message.action === "allow") {
    return allowWebRTC().then(() => {
      browser.storage.local.set({ webrtcBlocked: false });
      return { status: "allowed" };
    });
  } else if (message.action === "getStatus") {
    return browser.privacy.network.peerConnectionEnabled.get({}).then((result) => {
      return { blocked: !result.value };
    });
  }
});
