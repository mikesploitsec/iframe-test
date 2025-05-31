function loadTarget() {
  const url = document.getElementById('target').value;
  if (!url || !url.startsWith('http')) {
    alert('Please enter a valid URL (https://...)');
    return;
  }
  document.getElementById('targetFrame').src = url;
  document.querySelector('.layout').style.display = 'grid';
  document.getElementById('target-url-input').style.display = 'none';

  // Broadcast the target URL to all iframes (testbed)
  for (let i = 0; i < window.frames.length; i++) {
    window.frames[i].postMessage({ type: 'setTarget', url: url }, '*');
  }
}