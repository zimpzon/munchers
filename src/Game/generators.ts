interface LevelData {
    pixels: Uint8Array;
    w: number;
    h: number;
}

export function createSpiralMaze(pixels: Uint8Array, width: number, height: number, wallThickness: number, r: number, g: number, b: number): LevelData {
    pixels.fill(0); // Clear the array

    let x = width / 2;
    let y = height / 2;
    let dx = 0;
    let dy = -1;
    let steps = 1;

    while (x >= 0 && x < width && y >= 0 && y < height) {
        for (let i = 0; i < wallThickness; i++) {
            for (let j = 0; j < wallThickness; j++) {
                if (x + i < width && y + j < height) {
                    let index = 4 * ((x + i) + (y + j) * width);
                    pixels[index] = r;      // Red component
                    pixels[index + 1] = g;  // Green component
                    pixels[index + 2] = b;  // Blue component
                    pixels[index + 3] = 255; // Alpha component
                }
            }
        }

        if (--steps == 0) {
            const temp = dx;
            dx = -dy;
            dy = temp;
            steps = Math.sqrt(x * x + y * y) * Math.PI / wallThickness; // Increase step size gradually
        }
        x += dx;
        y += dy;
    }

    return { pixels, w: width, h: height };
}

export function createRandomWalls(pixels: Uint8Array, width: number, height: number, wallThickness: number, numWalls: number, r: number, g: number, b: number): LevelData {
    pixels.fill(0); // Assuming 0 is open and 1 is wall

    for (let n = 0; n < numWalls; n++) {
        const x = Math.floor(Math.random() * width);
        const y = Math.floor(Math.random() * height);
        const horizontal = Math.random() > 0.5;
        const length = Math.floor(Math.random() * 20) + 10; // random length between 10 and 30

        for (let i = 0; i < length; i++) {
            for (let j = 0; j < wallThickness; j++) {
                if (horizontal) {
                    if (x + i < width && y + j < height) {
                        let index = 4 * ((x + i) + (y + j) * width);
                        pixels[index] = r;      // Red component
                        pixels[index + 1] = g;  // Green component
                        pixels[index + 2] = b;  // Blue component
                        pixels[index + 3] = 255; // Alpha component
                    }
                } else {
                    if (x + j < width && y + i < height) {
                        let index = 4 * ((x + j) + (y + i) * width);
                        pixels[index] = r;      // Red component
                        pixels[index + 1] = g;  // Green component
                        pixels[index + 2] = b;  // Blue component
                        pixels[index + 3] = 255; // Alpha component
                    }
                }
            }
        }
    }

    return { pixels, w: width, h: height };
}

export function createCentralHub(pixels: Uint8Array, width: number, height: number, wallThickness: number, numPaths: number, r: number, g: number, b: number): LevelData {
    pixels.fill(0); // Assuming 0 is open and 1 is wall

    const centerX = Math.floor(width / 2);
    const centerY = Math.floor(height / 2);
    const radius = Math.min(centerX, centerY) - wallThickness;

    // Create the central hub
    for (let x = -radius; x <= radius; x++) {
        for (let y = -radius; y <= radius; y++) {
            if (x * x + y * y <= radius * radius) {
                let index = 4 * ((centerX + x) + (centerY + y) * width);
                pixels[index] = r;      // Red component
                pixels[index + 1] = g;  // Green component
                pixels[index + 2] = b;  // Blue component
                pixels[index + 3] = 255; // Alpha component
            }
        }
    }

    // Create radial paths
    for (let i = 0; i < numPaths; i++) {
        const angle = (i / numPaths) * 2 * Math.PI;
        const dx = Math.cos(angle);
        const dy = Math.sin(angle);
        let pathX = centerX;
        let pathY = centerY;

        while (pathX >= 0 && pathX < width && pathY >= 0 && pathY < height) {
            for (let w = -wallThickness; w <= wallThickness; w++) {
                if (Math.abs(w) <= wallThickness / 2) { // Path width is half the wall thickness
                    const pathXW = pathX + Math.floor(dy * w);
                    const pathYW = pathY + Math.floor(dx * w);
                    if (pathXW >= 0 && pathXW < width && pathYW >= 0 && pathYW < height) {
                        let index = 4 * (pathXW + pathYW * width);
                        pixels[index] = r;
                        pixels[index + 1] = g;
                        pixels[index + 2] = b;
                        pixels[index + 3] = 255;
                    }
                }
            }
            pathX += dx;
            pathY += dy;
        }
    }

    return { pixels, w: width, h: height };
}

export function createGridMaze(pixels: Uint8Array, width: number, height: number, wallThickness: number, r: number, g: number, b: number): LevelData {
    pixels.fill(0); // Clear the array initially, assuming 0 is open space and 1 is wall (but we will use RGBA values)

    for (let x = 0; x < width; x += wallThickness * 4) {
        for (let y = 0; y < height; y += wallThickness * 4) {
            for (let i = 0; i < wallThickness; i++) {
                // Draw vertical walls
                for (let j = 0; j < height; j++) {
                    if (x + i < width) {
                        let index = 4 * ((x + i) + j * width);
                        pixels[index] = r;      // Red component
                        pixels[index + 1] = g;  // Green component
                        pixels[index + 2] = b;  // Blue component
                        pixels[index + 3] = 255; // Alpha component, always 255
                    }
                }
                // Draw horizontal walls
                for (let j = 0; j < width; j++) {
                    if (y + i < height) {
                        let index = 4 * (j + (y + i) * width);
                        pixels[index] = r;      // Red component
                        pixels[index + 1] = g;  // Green component
                        pixels[index + 2] = b;  // Blue component
                        pixels[index + 3] = 255; // Alpha component, always 255
                    }
                }
            }
        }
    }

    return { pixels, w: width, h: height };
}
