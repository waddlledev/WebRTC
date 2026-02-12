document.addEventListener('DOMContentLoaded', () => {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusText = document.getElementById('statusText');
  const toggleBtn = document.getElementById('toggleBtn');
  const infoText = document.getElementById('infoText');

  function updateUI(blocked) {
    if (blocked) {
      statusIndicator.className = 'status-indicator protected';
      statusText.textContent = 'Protected';
      statusText.className = 'status-text';
      toggleBtn.textContent = 'Disable';
      infoText.textContent = 'Your real IP is hidden from WebRTC';
    } else {
      statusIndicator.className = 'status-indicator exposed';
      statusText.textContent = 'Disabled';
      statusText.className = 'status-text exposed';
      toggleBtn.textContent = 'Enable';
      infoText.textContent = 'WebRTC may leak your real IP address';
    }
  }

  browser.runtime.sendMessage({ action: 'getStatus' }).then((response) => {
    updateUI(response.blocked);
  });

  toggleBtn.addEventListener('click', () => {
    browser.runtime.sendMessage({ action: 'getStatus' }).then((response) => {
      const newAction = response.blocked ? 'allow' : 'block';
      browser.runtime.sendMessage({ action: newAction }).then(() => {
        updateUI(!response.blocked);
      });
    });
  });
});
