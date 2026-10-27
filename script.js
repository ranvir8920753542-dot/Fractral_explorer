// getting elements from html
const canvas = document.getElementById("fractalCanvas");
const ctx = canvas.getContext("2d");

const typeSelect = document.getElementById("typeSelect");
const depthSlider = document.getElementById("depthSlider");
const angleSlider = document.getElementById("angleSlider");
const colorPicker = document.getElementById("colorPicker");

const depthVal = document.getElementById("depthVal");
const angleVal = document.getElementById("angleVal");
const angleBox = document.getElementById("angleBox");

// function to draw recursive tree
function drawTree(x1, y1, angle, depth, branchLen) {
  if (depth === 0) return;

  // convert angle to radians
  const rad = (angle * Math.PI) / 180;
  const x2 = x1 + Math.cos(rad) * branchLen;
  const y2 = y1 + Math.sin(rad) * branchLen;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = colorPicker.value;
  ctx.lineWidth = depth * 0.7;
  ctx.stroke();

  const splitAngle = Number(angleSlider.value);
  // call same function for left and right branches
  drawTree(x2, y2, angle - splitAngle, depth - 1, branchLen * 0.75);
  drawTree(x2, y2, angle + splitAngle, depth - 1, branchLen * 0.75);
}

// function to draw sierpinski triangle
function drawTriangle(x, y, size, depth) {
  if (depth === 0) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / 2, y - size * Math.sin(Math.PI / 3));
    ctx.lineTo(x + size, y);
    ctx.closePath();
    ctx.fillStyle = colorPicker.value;
    ctx.fill();
    return;
  }

  const half = size / 2;
  const height = half * Math.sin(Math.PI / 3);

  drawTriangle(x, y, half, depth - 1);
  drawTriangle(x + half, y, half, depth - 1);
  drawTriangle(x + half / 2, y - height, half, depth - 1);
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const depth = Number(depthSlider.value);
  depthVal.innerText = depth;
  angleVal.innerText = angleSlider.value;

  if (typeSelect.value === "tree") {
    angleBox.style.display = "flex";
    drawTree(canvas.width / 2, canvas.height - 20, -90, depth, 75);
  } else {
    angleBox.style.display = "none";
    // keep max depth safe for triangle so phone browser doesnt lag
    const safeDepth = depth > 7 ? 7 : depth;
    drawTriangle(30, 320, 300, safeDepth);
  }
}

// update canvas when user moves any slider
typeSelect.addEventListener("change", render);
depthSlider.addEventListener("input", render);
angleSlider.addEventListener("input", render);
colorPicker.addEventListener("input", render);

// first draw on page load
render();
