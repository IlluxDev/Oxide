import Settings from "./Settings";
import mergeDeep from "merge-deep";
import cliColor from "cli-color";

let isRunning = false;
let animationText = "";
let animationMode: "success" | "warning" | "error" | "info" = "info";
let animationLoop: NodeJS.Timer | null = null;
let animationSettings: Settings;
let frameInterval = 0;
let currentFrame = 0;
const frames = [
    "⠋",
    "⠙",
    "⠹",
    "⠸",
    "⠼",
    "⠴",
    "⠦",
    "⠧",
    "⠇",
    "⠏"
];

/**
 * Generate whitespace to clear off trailing text of previous text or frame
 */
function generateWhiteSpace() {

}

/**
 * Render the current frame in time
 */
function renderCurrentFrame(finalMode = false) {
    const width = process.stdout.getWindowSize()[0];
    let spinnerFrame = finalMode ? "•" : frames[currentFrame];
    let spinnerSize = spinnerFrame.length + 2;
    let outputText = animationText;

    if (width < (outputText.length + spinnerSize)) {
        const difference = (outputText.length + spinnerSize) - width;
        outputText = outputText.slice(0, -(difference + 4)) + " ...";
    }

    process.stdout.write("\r " + cliColor[animationSettings.colors[animationMode]](spinnerFrame) + " " + outputText);

    if (currentFrame >= frames.length - 1) {
        currentFrame = 0;
        return;
    }
}

/**
 * Create an animated spinner with text
 * @param text The text to show with the processing animation
 */
export async function animate(text: string, mode: "success" | "warning" | "error" | "info" = "info", settings: Settings = {}) {
    const runAnimation = () => {
        const defaultSettings = {
            fps: 20,
            colors: {
                success: "greenBright",
                warning: "yellowBright",
                error: "redBright",
                info: "blueBright"
            }
        } as Settings;
    
        animationSettings = mergeDeep(defaultSettings, settings);
        frameInterval = 1000 / animationSettings.fps;
        animationText = text;
        animationMode = mode;
    
        animationLoop = setInterval(() => {
            isRunning = true;
            renderCurrentFrame();
    
            currentFrame++;
        }, frameInterval);
    }

    if (isRunning) {
        stop().then(() => {
            runAnimation();
        });
        
        return;
    }

    runAnimation();
}

/**
 * Stop the current running animation
 * @param mode The new state of the final animation frame
 * @param text The new text for the final animation frame
 */
export function stop(mode: "success" | "warning" | "error" | "info" = "info", text?: string): Promise<void> {
    return new Promise((resolve) => {
        updateText(text, mode);
        renderCurrentFrame(true);

        process.stdout.write("\n");
        resolve();
    });
}

/**
 * Update the text of a currently running animation
 * @param text The new text
 * @param mode The new mode
 */
export function updateText(text: string, mode: "success" | "warning" | "error" | "info" = "info") {
    let finalText = text;
    
    if (!finalText) {
        finalText = animationText;
    }

    if (mode) {
        animationMode = mode;
    }

    animationText = finalText;
    clearInterval(animationLoop);

    isRunning = false;
    renderCurrentFrame();
}
