const form = document.querySelector("#qr-form");
const contentInput = document.querySelector("#qr-content");
const canvas = document.querySelector("#qr-canvas");
const context = canvas.getContext("2d");
const statusMessage = document.querySelector("#status-message");
const contrastMessage = document.querySelector("#contrast-message");
const downloadButton = document.querySelector("#download-button");
const shapeButtons = [...document.querySelectorAll(".shape-option")];
const qrColorInput = document.querySelector("#qr-color");
const bgColorInput = document.querySelector("#bg-color");
const borderColorInput = document.querySelector("#border-color");
const heartFillInput = document.querySelector("#heart-fill-color");
const heartFillOption = document.querySelector("#heart-fill-option");

let selectedShape = "rounded";
let currentQr;

function isFinderArea(row, column, size) {
  return (
    (row < 8 && column < 8) ||
    (row < 8 && column >= size - 8) ||
    (row >= size - 8 && column < 8)
  );
}

function drawHeartPath(x, y, width, height) {
  const centerX = x + width / 2;
  const centerY = y + height * 0.94;
  context.beginPath();
  context.moveTo(centerX, centerY);
  context.bezierCurveTo(x + width * 0.4, y + height * 0.8, x + width * 0.04, y + height * 0.57, x + width * 0.04, y + height * 0.32);
  context.bezierCurveTo(x + width * 0.04, y + height * 0.08, x + width * 0.36, y + height * 0.03, centerX, y + height * 0.29);
  context.bezierCurveTo(x + width * 0.64, y + height * 0.03, x + width * 0.96, y + height * 0.08, x + width * 0.96, y + height * 0.32);
  context.bezierCurveTo(x + width * 0.96, y + height * 0.57, x + width * 0.6, y + height * 0.8, centerX, centerY);
  context.closePath();
}

function drawRoundedRectPath(x, y, width, height, radius) {
  context.beginPath();
  if (typeof context.roundRect === "function") {
    context.roundRect(x, y, width, height, radius);
    return;
  }

  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function relativeLuminance(hexColor) {
  const channels = hexColor.match(/[a-f\d]{2}/gi).map((channel) => parseInt(channel, 16) / 255);
  const linearChannels = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
  );
  return linearChannels[0] * 0.2126 + linearChannels[1] * 0.7152 + linearChannels[2] * 0.0722;
}

function updateContrastMessage(foreground, background) {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);
  const ratio = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05);

  contrastMessage.textContent =
    foregroundLuminance >= backgroundLuminance || ratio < 4.5
      ? `Para facilitar el escaneo, usa un QR más oscuro que el fondo y aumenta el contraste (ahora ${ratio.toFixed(1)}:1).`
      : "";
}

function drawFinder(x, y, moduleSize, color, background) {
  const outerSize = moduleSize * 7;

  context.fillStyle = color;
  context.beginPath();
  context.rect(x, y, outerSize, outerSize);
  context.fill();

  const inset = moduleSize;
  context.fillStyle = background;
  context.beginPath();
  context.rect(x + inset, y + inset, moduleSize * 5, moduleSize * 5);
  context.fill();

  const innerInset = moduleSize * 2;
  context.fillStyle = color;
  context.beginPath();
  context.rect(x + innerInset, y + innerInset, moduleSize * 3, moduleSize * 3);
  context.fill();
}

function drawSquareQr(qr, x, y, width, foreground, background) {
  const size = qr.getModuleCount();
  const padding = 4;
  const moduleSize = width / (size + padding * 2);
  const codeX = x + padding * moduleSize;
  const codeY = y + padding * moduleSize;

  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      if (!qr.isDark(row, column) || isFinderArea(row, column, size)) continue;
      context.fillStyle = foreground;
      context.fillRect(codeX + column * moduleSize, codeY + row * moduleSize, moduleSize, moduleSize);
    }
  }

  const finderOrigins = [
    [codeX, codeY],
    [codeX + (size - 7) * moduleSize, codeY],
    [codeX, codeY + (size - 7) * moduleSize],
  ];
  finderOrigins.forEach(([finderX, finderY]) => drawFinder(finderX, finderY, moduleSize, foreground, background));
}

function drawShapePath(shape) {
  if (shape === "heart") {
    drawHeartPath(42, 34, 940, 956);
  } else if (shape === "circle") {
    context.beginPath();
    context.arc(512, 512, 462, 0, Math.PI * 2);
  } else if (shape === "diamond") {
    context.beginPath();
    context.moveTo(512, 42);
    context.lineTo(982, 512);
    context.lineTo(512, 982);
    context.lineTo(42, 512);
    context.closePath();
  } else if (shape === "rounded") {
    drawRoundedRectPath(52, 52, 920, 920, 120);
  } else {
    context.beginPath();
    context.rect(52, 52, 920, 920);
  }
}

function drawShapePlate(shape, color, borderColor) {
  context.save();
  context.shadowColor = "rgba(25, 43, 31, 0.16)";
  context.shadowBlur = 32;
  context.shadowOffsetY = 16;
  context.fillStyle = color;
  drawShapePath(shape);
  context.fill();
  context.restore();

  context.save();
  drawShapePath(shape);
  context.clip();
  context.strokeStyle = borderColor;
  context.lineWidth = 20;
  context.stroke();
  context.restore();
}

function drawBadgeQr(qr, shape, foreground, background, borderColor) {
  drawShapePlate(shape, background, borderColor);

  const qrLayouts = {
    heart: { x: 292, y: 320, width: 440 },
    circle: { x: 214, y: 214, width: 596 },
    diamond: { x: 304, y: 304, width: 416 },
    rounded: { x: 160, y: 160, width: 704 },
    square: { x: 160, y: 160, width: 704 },
  };
  const { x, y, width } = qrLayouts[shape];
  drawSquareQr(qr, x, y, width, foreground, background);
}

function renderQr() {
  const value = contentInput.value.trim();
  statusMessage.textContent = "";
  currentQr = null;
  downloadButton.disabled = true;
  heartFillOption.hidden = selectedShape !== "heart";
  context.clearRect(0, 0, canvas.width, canvas.height);
  const foreground = qrColorInput.value;
  const background = selectedShape === "heart" ? heartFillInput.value : bgColorInput.value;
  updateContrastMessage(foreground, background);

  if (!value) {
    statusMessage.textContent = "Escribe un enlace o mensaje para generar tu QR.";
    return;
  }
  if (typeof window.qrcode !== "function") {
    statusMessage.textContent = "No se pudo cargar el generador local. Comprueba que los archivos estén completos y vuelve a cargar la página.";
    return;
  }

  try {
    const qr = window.qrcode(0, "H");
    qr.addData(value);
    qr.make();
    currentQr = qr;

    const borderColor = borderColorInput.value;

    drawBadgeQr(qr, selectedShape, foreground, background, borderColor);
    downloadButton.disabled = false;
  } catch {
    currentQr = null;
    statusMessage.textContent = "No se pudo generar este QR. Prueba con un texto más corto o revisa el contenido.";
  }
}

function updateColorLabel(input, label) {
  document.querySelector(label).textContent = input.value.toUpperCase();
}

form.addEventListener("submit", (event) => event.preventDefault());
contentInput.addEventListener("input", renderQr);

shapeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedShape = button.dataset.shape;
    shapeButtons.forEach((option) => {
      const selected = option === button;
      option.classList.toggle("is-selected", selected);
      option.setAttribute("aria-pressed", String(selected));
    });
    renderQr();
  });
});

qrColorInput.addEventListener("input", () => {
  updateColorLabel(qrColorInput, "#qr-color-value");
  renderQr();
});
bgColorInput.addEventListener("input", () => {
  updateColorLabel(bgColorInput, "#bg-color-value");
  renderQr();
});
borderColorInput.addEventListener("input", () => {
  updateColorLabel(borderColorInput, "#border-color-value");
  renderQr();
});
heartFillInput.addEventListener("input", () => {
  updateColorLabel(heartFillInput, "#heart-fill-color-value");
  renderQr();
});

downloadButton.addEventListener("click", () => {
  if (!currentQr) {
    renderQr();
    if (!currentQr) return;
  }

  const link = document.createElement("a");
  link.download = "A.H.QR-mi-qr.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

renderQr();
