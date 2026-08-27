const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");

function generateRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function createColorBox(color) {
    const colorBox = document.createElement("article");
    colorBox.classList.add("color-box");

    colorBox.innerHTML = `
        <div class="color" style="background-color: ${color};" aria-label="Color ${color}"></div>
        <div class="color-info">
            <span class="hex-value">${color}</span>
            <button class="copy-btn" type="button" aria-label="Copy color ${color}">
                <i class="far fa-copy" aria-hidden="true"></i>
            </button>
        </div>
    `;

    const copyBtn = colorBox.querySelector(".copy-btn");
    copyBtn.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(color);
            copyBtn.innerHTML = '<i class="fas fa-check" aria-hidden="true"></i>';

            setTimeout(() => {
                copyBtn.innerHTML = '<i class="far fa-copy" aria-hidden="true"></i>';
            }, 1000);
        } catch (error) {
            console.error("Copy failed:", error);
        }
    });

    return colorBox;
}

function generatePalette() {
    paletteContainer.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const color = generateRandomColor();
        paletteContainer.appendChild(createColorBox(color));
    }
}

generateBtn.addEventListener("click", generatePalette);

generatePalette();