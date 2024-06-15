const app = document.getElementById("app");
const colorPicker = document.getElementById("color-picker");

// Create the color picker sliders dynamically
function createColorPicker() {
  const colors = ["red", "green", "blue", "alpha"];
  const container = document.createElement("div");
  container.classList.add("slider-container");

  colors.forEach((color) => {
    const label = document.createElement("label");
    label.innerText = `${color.charAt(0).toUpperCase() + color.slice(1)}: `;

    const slider = document.createElement("input");
    slider.type = "range";
    slider.id = color;
    slider.min = "0";
    slider.max = "255";
    slider.value = color === "alpha" ? "255" : "128";

    label.appendChild(slider);
    container.appendChild(label);

    slider.addEventListener("input", () => updateCircleColor(mouseCircle));
  });

  // Add slider for circle size
  const sizeLabel = document.createElement("label");
  sizeLabel.innerText = "Size: ";
  const sizeSlider = document.createElement("input");
  sizeSlider.type = "range";
  sizeSlider.id = "size";
  sizeSlider.min = "10";
  sizeSlider.max = "100";
  sizeSlider.value = "25";
  sizeLabel.appendChild(sizeSlider);
  container.appendChild(sizeLabel);

  sizeSlider.addEventListener("input", () => {
    mouseCircle.style.width = `${sizeSlider.value}px`;
    mouseCircle.style.height = `${sizeSlider.value}px`;
  });

  colorPicker.appendChild(container);

  // Add message for hotkey 'p'
  const hotkeyMessage = document.createElement("p");
  hotkeyMessage.innerText = "Press 'p' to toggle color picker";
  hotkeyMessage.style.marginTop = "10px";
  hotkeyMessage.style.color = "#fff"; // Adjust color as needed
  colorPicker.appendChild(hotkeyMessage);
}

// Call the function to create color pickers
createColorPicker();

// Create the initial circle to be attached to the mouse.
const mouseCircle = createCircle();
app.appendChild(mouseCircle);

// Helper function for making circles.
function createCircle() {
  const circle = document.createElement("div");
  circle.classList.add("circle");
  circle.style.width = "25px"; // Initial size
  circle.style.height = "25px"; // Initial size
  updateCircleColor(circle);
  return circle;
}

// Helper function for placing circles.
function placeCircle(circle) {
  const copy = circle.cloneNode(true);
  app.appendChild(copy);
}

// Update the circle's color based on the slider values.
function updateCircleColor(circle) {
  const red = document.getElementById("red").value;
  const green = document.getElementById("green").value;
  const blue = document.getElementById("blue").value;
  const alpha = document.getElementById("alpha").value;
  const color = `rgba(${red}, ${green}, ${blue}, ${alpha / 255})`;
  circle.style.backgroundColor = color;
  colorPicker.style.backgroundColor = color;
}

// Variable to track whether the mouse is pressed down.
let isDrawing = false;

// Place the mouse circle at the current location,
// and switch the circle to a new color.
function handleClick(event) {
  event.preventDefault();
  placeCircle(mouseCircle);
  updateCircleColor(mouseCircle);
}

// Create a "painting" effect with pointerdown
// and pointerup. Cache the interval for cancelling.
let paintInterval;
function handleStart(event) {
  event.preventDefault();
  isDrawing = true;
  paintInterval = setInterval(() => {
    if (isDrawing) {
      placeCircle(mouseCircle);
    }
  }, 10);
}
function handleEnd(event) {
  event.preventDefault();
  isDrawing = false;
  clearInterval(paintInterval);
  setTimeout(() => updateCircleColor(mouseCircle), 0);
}

// Stop drawing if the cursor leaves the viewport.
function handlePointerLeave(event) {
  isDrawing = false;
  clearInterval(paintInterval);
}

// Toggle color picker visibility with the 'p' key.
document.addEventListener("keydown", (event) => {
  if (event.key === "p") {
    colorPicker.style.display =
      colorPicker.style.display === "none" ? "block" : "none";
  }
});

// Moves the mouse circle alongside the mouse.
function handleMove(event) {
  event.preventDefault();
  mouseCircle.style.top = event.y - mouseCircle.clientHeight / 2 + "px";
  mouseCircle.style.left = event.x - mouseCircle.clientWidth / 2 + "px";
}

// Register events!
app.addEventListener("click", handleClick);
app.addEventListener("pointerdown", handleStart);
app.addEventListener("pointerup", handleEnd);
app.addEventListener("pointermove", handleMove);
document.addEventListener("pointerleave", handlePointerLeave);