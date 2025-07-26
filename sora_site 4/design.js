// design.js – simple tee design tool allowing users to pick colours and designs

document.addEventListener('DOMContentLoaded', () => {
  const colorInput = document.getElementById('tee-color');
  const designSelect = document.getElementById('design-select');
  const teeBase = document.getElementById('tee-base');
  const teeDesign = document.getElementById('tee-design');

  // Handle download of the custom design
  const downloadBtn = document.getElementById('download-btn');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Create an offscreen canvas to render the t‑shirt design
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const width = 800;
      const height = 1000;
      canvas.width = width;
      canvas.height = height;
      // Fill with the selected base colour
      ctx.fillStyle = colorInput.value || '#f5e6ca';
      ctx.fillRect(0, 0, width, height);
      // Load the overlay image and draw it once ready
      const overlay = new Image();
      overlay.crossOrigin = 'anonymous';
      overlay.onload = function() {
        // Scale overlay to occupy ~70% of the width while preserving aspect ratio
        const desiredWidth = width * 0.7;
        const scale = desiredWidth / overlay.width;
        const desiredHeight = overlay.height * scale;
        const x = (width - desiredWidth) / 2;
        const y = (height - desiredHeight) / 2;
        ctx.drawImage(overlay, x, y, desiredWidth, desiredHeight);
        // Trigger download
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'sora_custom_tee.png';
        link.click();
      };
      overlay.src = teeDesign.src;
    });
  }

  // Update base colour
  colorInput.addEventListener('input', () => {
    teeBase.style.backgroundColor = colorInput.value;
  });

  // Update design image
  designSelect.addEventListener('change', () => {
    teeDesign.src = 'images/' + designSelect.value;
  });
});