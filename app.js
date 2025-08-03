const imageUpload = document.getElementById('image-upload');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const frame = document.getElementById('frame');
const downloadBtn = document.getElementById('download-btn');

let uploadedImage = null;
let imgX = 0;
let imgY = 0;
let scale = 1;
let isDragging = false;
let startX, startY;

// رفع الصورة
imageUpload.addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      uploadedImage = img;
      imgX = 0;
      imgY = 0;
      scale = 1;
      drawCanvas();
    };
    img.crossOrigin = "anonymous";
    img.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// رسم الصورة
function drawCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (uploadedImage) {
    const imgWidth = uploadedImage.width * scale;
    const imgHeight = uploadedImage.height * scale;
    ctx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);
  }
}

// سحب
canvas.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX - imgX;
  startY = e.clientY - imgY;
  canvas.style.cursor = 'grabbing';
});

canvas.addEventListener('mouseup', () => {
  isDragging = false;
  canvas.style.cursor = 'default';
});

canvas.addEventListener('mousemove', (e) => {
  if (isDragging) {
    imgX = e.clientX - startX;
    imgY = e.clientY - startY;
    drawCanvas();
  }
});

// تكبير وتصغير بالماوس
canvas.addEventListener('wheel', (e) => {
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.05 : 0.05;
  scale = Math.min(Math.max(0.1, scale + delta), 3);
  drawCanvas();
});

// تحميل الصورة النهائية
downloadBtn.addEventListener('click', () => {
  if (!uploadedImage) return;
  
  // إعادة رسم مع الفريم
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');

  // رسم الصورة
  const imgWidth = uploadedImage.width * scale;
  const imgHeight = uploadedImage.height * scale;
  tempCtx.drawImage(uploadedImage, imgX, imgY, imgWidth, imgHeight);

  // رسم الفريم فوقها
  const frameImg = new Image();
  frameImg.crossOrigin = "anonymous";
  frameImg.onload = () => {
    tempCtx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    const link = document.createElement('a');
    link.download = 'graduation_frame.png';
    link.href = tempCanvas.toDataURL();
    link.click();
  };
  frameImg.src = frame.src;
});
