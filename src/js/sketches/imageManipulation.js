export const imageManipulationSketch = (p) => {
/**
 * Advanced High-Performance Image Processor HUD
 * Calibrated for Global Linear 1D Sorting (Continuous Wrapped Text Layout)
 */

let imgA; // Primary image
let imgB; // Secondary image for blending
let currentFilter = 'Sort Pixels';

// UI Elements
let selectFilter;
let sliderStrength;
let uploadBtnA;
let uploadBtnB;

function preload() {
  imgA = loadImage('../../images/cat_aah.jpg');
  imgB = loadImage('../../images/cat_mmm.jpg');
}

function setup() {
  createCanvas(600, 400);
  pixelDensity(1);
  setupInterface();
}

function draw() {
  background(20);

  if (!imgA || imgA.width === 0) return;

  // Interactive Dynamic Resizing Matrix
  let scaleFactor = map(mouseX, 0, width, 0.3, 1.0, true);
  
  // Hard clamp to safeguard memory allocations
  let maxDimension = 400; 
  if (imgA.width > maxDimension || imgA.height > maxDimension) {
    scaleFactor *= maxDimension / max(imgA.width, imgA.height);
  }

  let targetWidth = max(10, floor(imgA.width * scaleFactor));
  let targetHeight = max(10, floor(imgA.height * scaleFactor));

  let buffer = createImage(targetWidth, targetHeight);
  buffer.copy(imgA, 0, 0, imgA.width, imgA.height, 0, 0, targetWidth, targetHeight);
  
  let strength = sliderStrength.value() / 100;

  // Filter Routing Matrix
  buffer.loadPixels();
  switch (currentFilter) {
    case 'Sort Pixels':
      applyGlobalPixelSort(buffer, strength);
      break;
    case 'Combine Images':
      applyImageCombine(buffer, imgB, strength);
      break;
    case 'Glitch Effect':
      applyGlitchOptimized(buffer, strength);
      break;
    case 'Random Dithering':
      applyRandomDitherOptimized(buffer, strength);
      break;
  }
  buffer.updatePixels();

  image(buffer, 0, 0, width, height);
}

/* ==========================================
  FLATTENED GLOBAL FILTER MODULE
 ==========================================
*/

/**
 * Filter 1: Continuous 1D Global Pixel Sort
 * Flattens the 2D grid image data, sorts it from darkest to brightest, 
 * and wraps it line-by-line (Left to Right, Top to Bottom).
 * Strength determines what percentage of total image pixels are included in the sort.
 */
function applyGlobalPixelSort(img, strength) {
  let totalPixels = img.width * img.height;
  
  // Determine total pool to sort based on HUD slider strength
  let sortCount = floor(map(strength, 0, 1, 0, totalPixels));
  if (sortCount < 2) return; 

  let pixelPool = [];

  // 1. Extract pixel packets into a flat 1D sequence array
  for (let i = 0; i < sortCount; i++) {
    let idx = i * 4;
    let r = img.pixels[idx];
    let g = img.pixels[idx + 1];
    let b = img.pixels[idx + 2];
    let a = img.pixels[idx + 3];
    
    // Perceived luminance metric
    let luma = 0.299 * r + 0.587 * g + 0.114 * b;
    
    pixelPool.push({ r, g, b, a, luma });
  }

  // 2. Global Sort execution: Darkest (0) to Brightest (255)
  pixelPool.sort((pixelA, pixelB) => pixelA.luma - pixelB.luma);

  // 3. Inject continuous data back into the buffer array (wrapping automatically)
  for (let i = 0; i < sortCount; i++) {
    let idx = i * 4;
    img.pixels[idx]     = pixelPool[i].r;
    img.pixels[idx + 1] = pixelPool[i].g;
    img.pixels[idx + 2] = pixelPool[i].b;
    img.pixels[idx + 3] = pixelPool[i].a;
  }
}

/* ==========================================
  SECONDARY FILTER SUBSYSTEMS
 ==========================================
*/

function applyImageCombine(img, secondary, strength) {
  if (!secondary || secondary.width === 0) return;
  
  let secResized = createImage(img.width, img.height);
  secResized.copy(secondary, 0, 0, secondary.width, secondary.height, 0, 0, img.width, img.height);
  secResized.loadPixels();

  for (let i = 0; i < img.pixels.length; i += 4) {
    img.pixels[i]     = img.pixels[i]   * (1 - strength) + secResized.pixels[i]   * strength;
    img.pixels[i + 1] = img.pixels[i + 1] * (1 - strength) + secResized.pixels[i + 1] * strength;
    img.pixels[i + 2] = img.pixels[i + 2] * (1 - strength) + secResized.pixels[i + 2] * strength;
  }
}

function applyGlitchOptimized(img, strength) {
  if (strength === 0) return;

  let srcPixels = new Uint8ClampedArray(img.pixels);
  let w = img.width;
  let h = img.height;
  
  let sliceCount = floor(map(strength, 0, 1, 2, 25));
  let maxOffset = floor(map(strength, 0, 1, 5, w * 0.4));

  for (let s = 0; s < sliceCount; s++) {
    let yStart = floor(random(0, h));
    let sliceH = floor(random(4, max(10, h / 5)));
    let xOffset = floor(random(-maxOffset, maxOffset));

    for (let y = yStart; y < yStart + sliceH; y++) {
      if (y >= h) break;
      for (let x = 0; x < w; x++) {
        let targetX = (x + xOffset + w) % w;
        let srcIdx = 4 * (y * w + x);
        let destIdx = 4 * (y * w + targetX);

        img.pixels[destIdx]     = srcPixels[srcIdx];     
        img.pixels[destIdx + 1] = srcPixels[srcIdx + 1]; 
        img.pixels[destIdx + 2] = srcPixels[srcIdx + 2]; 
      }
    }
  }
}

function applyRandomDitherOptimized(img, strength) {
  for (let i = 0; i < img.pixels.length; i += 4) {
    let r = img.pixels[i];
    let g = img.pixels[i + 1];
    let b = img.pixels[i + 2];
    
    let gray = 0.299 * r + 0.587 * g + 0.114 * b;
    let noiseRange = map(strength, 0, 1, 0, 255);
    let noise = random(-noiseRange / 2, noiseRange / 2);
    
    let binaryState = (gray + noise > 127) ? 255 : 0;
    
    img.pixels[i]     = binaryState;
    img.pixels[i + 1] = binaryState;
    img.pixels[i + 2] = binaryState;
  }
}

/* ==========================================
  INTERFACE SETTINGS
 ==========================================
*/

function setupInterface() {
  selectFilter = createSelect();
  selectFilter.position(10, height + 15);
  selectFilter.option('Sort Pixels');
  selectFilter.option('Combine Images');
  selectFilter.option('Glitch Effect');
  selectFilter.option('Random Dithering');
  selectFilter.changed(() => currentFilter = selectFilter.value());

  sliderStrength = createSlider(0, 100, 50);
  sliderStrength.position(160, height + 15);
  
  uploadBtnA = createFileInput(handleFileA);
  uploadBtnA.position(310, height + 15);
  
  uploadBtnB = createFileInput(handleFileB);
  uploadBtnB.position(480, height + 15);
}

function handleFileA(file) {
  if (file.type === 'image') {
    imgA = loadImage(file.data);
  }
}

function handleFileB(file) {
  if (file.type === 'image') {
    imgB = loadImage(file.data);
  }
}
};