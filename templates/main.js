
async function showPreview() {
  const fileInput = document.getElementById('imageInput');
  const x = parseInt(document.getElementById('x').value);
  const y = parseInt(document.getElementById('y').value);
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);
  const previewSection = document.getElementById('previewSection');
  const imageCounter = document.getElementById('imageCounter');

  if (fileInput.files.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  if (fileInput.files.length > 100) {
    alert("You can only upload up to 100 images at once.");
    return;
  }

  const file = fileInput.files[0];

  try {
    const imageBitmap = await createImageBitmap(file);
    const safeX = Math.max(0, Math.min(x, imageBitmap.width - 1));
    const safeY = Math.max(0, Math.min(y, imageBitmap.height - 1));
    const safeWidth = Math.max(1, Math.min(width, imageBitmap.width - safeX));
    const safeHeight = Math.max(1, Math.min(height, imageBitmap.height - safeY));

    if (safeWidth <= 0 || safeHeight <= 0) {
      alert("Please check the numbers you have inputted.");
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = safeWidth;
    canvas.height = safeHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(imageBitmap, safeX, safeY, safeWidth, safeHeight, 0, 0, safeWidth, safeHeight);

    const preview = document.getElementById('croppedPreview');
    preview.src = canvas.toDataURL('image/png');
    preview.classList.add('animate-preview');

    previewSection.style.display = 'block';
    imageCounter.textContent = `Showing Image 1 of ${fileInput.files.length}`;
  } catch (error) {
    alert("Failed to process the image. Please try again.");
  }
}

function openUserManual() {
  const modal = document.getElementById('userManualModal');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

function closeUserManual() {
  const modal = document.getElementById('userManualModal');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}

function openDeveloperInfo() {
  const modal = document.getElementById('developerModal');
  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('show'), 10);
}

function closeDeveloperInfo() {
  const modal = document.getElementById('developerModal');
  modal.classList.remove('show');
  setTimeout(() => modal.style.display = 'none', 300);
}
