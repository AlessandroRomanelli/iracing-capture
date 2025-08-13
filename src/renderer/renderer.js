const { ipcRenderer } = require('electron');

const resolutions = ['1080p', '2k', '4k', '8k'];

const container = document.getElementById('buttons');
resolutions.forEach(res => {
  const btn = document.createElement('button');
  btn.innerText = `Capture ${res.toUpperCase()}`;
  btn.addEventListener('click', async () => {
    try {
      const file = await ipcRenderer.invoke('capture', res);
      alert(`Screenshot saved to ${file}`);
    } catch (err) {
      alert(err.message);
    }
  });
  container.appendChild(btn);
});
