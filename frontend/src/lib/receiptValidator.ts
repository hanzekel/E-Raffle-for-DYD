// Client-side image validation inspecting resolution, blank canvas detection, and receipt structure
export interface ReceiptValidationResult {
  isValid: boolean;
  error?: string;
  metrics?: {
    width: number;
    height: number;
    stdDev: number;
    edgeDensity: number;
  };
}

export async function validateReceiptImage(file: File): Promise<ReceiptValidationResult> {
  // 1. File size checks
  const MIN_SIZE_BYTES = 12 * 1024; // 12KB
  const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

  if (file.size < MIN_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'The uploaded file is too small to be a readable transaction receipt (minimum 12KB). Please upload your full payment screenshot.',
    };
  }

  if (file.size > MAX_SIZE_BYTES) {
    return {
      isValid: false,
      error: 'File size exceeds the 5MB limit. Please choose a smaller JPEG, PNG, or WebP screenshot.',
    };
  }

  const validMimes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!validMimes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Unsupported file type. Please upload a JPEG, PNG, or WebP screenshot.',
    };
  }

  // 2. Load into HTMLImageElement
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Unable to read image data'));
      image.src = objectUrl;
    });

    const { naturalWidth: w, naturalHeight: h } = img;

    // Minimum resolution for legible financial slips
    if (w < 250 || h < 250) {
      return {
        isValid: false,
        error: `Image resolution is too low (${w}×${h}px). Receipts require at least 250×250px so reference numbers and amounts can be verified.`,
      };
    }

    // Extreme aspect ratio checks (e.g. 1px line or stretched banner)
    const aspectRatio = w / h;
    if (aspectRatio < 0.2 || aspectRatio > 5.0) {
      return {
        isValid: false,
        error: 'Unusual image aspect ratio. Please upload a standard mobile screenshot or receipt photo.',
      };
    }

    // 3. Render onto an offscreen canvas for pixel inspection
    const sampleWidth = 240;
    const sampleHeight = Math.max(120, Math.min(480, Math.round(sampleWidth / aspectRatio)));

    const canvas = document.createElement('canvas');
    canvas.width = sampleWidth;
    canvas.height = sampleHeight;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      // If canvas is unsupported in client environment, allow graceful pass
      return { isValid: true };
    }

    ctx.drawImage(img, 0, 0, sampleWidth, sampleHeight);
    const imgData = ctx.getImageData(0, 0, sampleWidth, sampleHeight);
    const data = imgData.data;
    const totalPixels = sampleWidth * sampleHeight;

    // Convert to grayscale luminance array
    const luma = new Float32Array(totalPixels);
    let sumLuma = 0;
    const colorBuckets = new Set<number>();

    for (let i = 0; i < totalPixels; i++) {
      const idx = i * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // If fully transparent image
      if (a < 10) {
        luma[i] = 255;
      } else {
        luma[i] = 0.299 * r + 0.587 * g + 0.114 * b;
      }
      sumLuma += luma[i];

      // Quantize to 12-bit color bucket (4 bits per channel)
      const bucket = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
      colorBuckets.add(bucket);
    }

    const meanLuma = sumLuma / totalPixels;

    // Compute standard deviation of luminance (detects solid white, black, or flat colors)
    let varianceSum = 0;
    for (let i = 0; i < totalPixels; i++) {
      const diff = luma[i] - meanLuma;
      varianceSum += diff * diff;
    }
    const stdDev = Math.sqrt(varianceSum / totalPixels);

    // If standard deviation is very low or unique colors are near-zero, it is a blank or solid image
    if (stdDev < 12 || colorBuckets.size < 10) {
      return {
        isValid: false,
        error: 'The uploaded image appears to be blank or a solid color. Please upload your actual GCash or bank transfer confirmation receipt.',
        metrics: { width: w, height: h, stdDev, edgeDensity: 0 },
      };
    }

    // 4. Edge & Text Density Analysis (Sobel gradient filter)
    // Receipts have sharp contrast edges from typography (amounts, reference numbers, tables)
    let edgePixelCount = 0;
    const edgeThreshold = 38;

    for (let y = 1; y < sampleHeight - 1; y++) {
      for (let x = 1; x < sampleWidth - 1; x++) {
        const idx = y * sampleWidth + x;
        const gx = Math.abs(luma[idx + 1] - luma[idx - 1]);
        const gy = Math.abs(luma[idx + sampleWidth] - luma[idx - sampleWidth]);
        const gradient = gx + gy;

        if (gradient > edgeThreshold) {
          edgePixelCount++;
        }
      }
    }

    const edgeDensity = (edgePixelCount / totalPixels) * 100;

    // An image with readable receipt typography typically has > 2.0% high-contrast edge pixels.
    // Plain walls, empty backgrounds, or smooth random photos have < 1.3%.
    if (edgeDensity < 1.4) {
      return {
        isValid: false,
        error: 'Image does not appear to contain legible transaction details or receipt structure. Please upload a clear screenshot of your GCash, Maya, or bank transfer receipt.',
        metrics: { width: w, height: h, stdDev, edgeDensity },
      };
    }

    return {
      isValid: true,
      metrics: { width: w, height: h, stdDev, edgeDensity },
    };
  } catch (err: any) {
    return {
      isValid: false,
      error: 'Unable to process image. Please ensure the file is an uncorrupted JPEG, PNG, or WebP photo.',
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

