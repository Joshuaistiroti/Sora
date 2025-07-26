// photobooth.js – simple photo booth to apply SØRA overlays to uploaded photos

document.addEventListener('DOMContentLoaded', () => {
  const uploadInput = document.getElementById('photo-upload');
  const userPhoto = document.getElementById('user-photo');
  const overlaySelect = document.getElementById('overlay-select');
  const overlayImg = document.getElementById('overlay-img');

  const downloadBtn = document.getElementById('download-photo-btn');

  uploadInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      userPhoto.src = URL.createObjectURL(file);
    }
  });

  overlaySelect.addEventListener('change', () => {
    const value = overlaySelect.value;
    overlayImg.src = value ? 'images/' + value : '';
  });

  // Download composed image with overlay
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Ensure a photo is uploaded
      if (!userPhoto.src) {
        alert('Please upload a photo first.');
        return;
      }
      const canvas = document.createElement('canvas');
      const width = userPhoto.naturalWidth || userPhoto.width || 800;
      const height = userPhoto.naturalHeight || userPhoto.height || 800;
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      // Draw the user's photo
      ctx.drawImage(userPhoto, 0, 0, width, height);
      // Draw overlay if one is selected
      if (overlayImg.src) {
        const overlay = new Image();
        overlay.crossOrigin = 'anonymous';
        overlay.onload = function() {
          ctx.drawImage(overlay, 0, 0, width, height);
          const link = document.createElement('a');
          link.href = canvas.toDataURL('image/png');
          link.download = 'sora_photobooth.png';
          link.click();
        };
        overlay.src = overlayImg.src;
      } else {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'sora_photobooth.png';
        link.click();
      }
    });
  }
});