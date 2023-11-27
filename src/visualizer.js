import { defaultTheme } from "./theme.js";

let ctx, canvasWidth, canvasHeight;

let debugColor = defaultTheme.primary;
let midiMarkers = [];
let feedbackMarkers = [];
let timedFeedbackMarkers = [];

let metronomeIndex = -1;
let metronomeMarkers = 12;

let startTime = Infinity;
const inputOffset = -0.2;

const feedbackEnum = Object.freeze(Object.assign(Object.create(null), {
    unmarked: 0,
    incorrect: 1,
    correct: 2
}));

/**
 * Set up the visualizer
 * NOTE: Any visuals that require audio analysis should use an "analyzerNode" parameter, 
 * pointing to a reference of an AudioContext.analizerNode
 * @param {*} canvas 
 */
const setupCanvas = (canvas) => {
    ctx = canvas.getContext("2d");

    // if we want a higher pixel density canvas, multiply these by a scalar
    canvas.width = 1920;
    canvas.height = 1080;

    canvasWidth = canvas.width;
    canvasHeight = canvas.height;

    ctx.save();
    ctx.fillStyle = defaultTheme.primary;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();
}

/**
 * This can use RequestAnimationFrame() to update every frame. For now, it only needs to be displayed once
 * @param {*} params 
 */
const draw = (params = {}) => {

    // Background
    ctx.save();
    ctx.fillStyle = defaultTheme.primary + "80";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // ctx.fillStyle = debugColor;
    // // ctx.fillStyle = "white";
    // ctx.beginPath();
    // ctx.arc(canvasWidth / 2, canvasHeight / 2 - 100, 50, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();

    drawTimeMarkers();
    drawMidiMarkers();

    requestAnimationFrame(() => draw(params))
}

/**
 * Metronome and measure markers
 */
const drawTimeMarkers = () => {
    const width = canvasWidth / 3;
    const centerY = canvasHeight / 4;
    const centerX = canvasWidth / 2;
    const innerLeft = canvasWidth / 2 - width / 2;
    const innerRight = canvasWidth / 2 + width / 2;

    ctx.save();
    ctx.fillStyle = defaultTheme.primaryFront;
    ctx.strokeStyle = defaultTheme.primaryFront;

    // left and right markers
    ctx.beginPath();
    ctx.rect(innerLeft - 2, centerY - 25, 5, 50);
    ctx.rect(innerRight - 2, centerY - 25, 5, 50);
    ctx.rect(centerX - 2, centerY - 25, 5, 50);
    ctx.fill();
    ctx.closePath();

    const spacing = width / (metronomeMarkers - 4);
    for (let i = 0; i < metronomeMarkers; i++) {
        if (i == 4 || i == 8) continue;

        ctx.fillStyle = defaultTheme.primaryFront;
        ctx.strokeStyle = defaultTheme.primaryFront;
        ctx.beginPath();
        ctx.arc(innerLeft + i * spacing - 4 * spacing, centerY, 5, 0, Math.PI * 2);
        if (i == metronomeIndex) {
            ctx.fillStyle = defaultTheme.secondaryFront;
            ctx.strokeStyle = defaultTheme.secondaryFront;
            ctx.fill();
        }
        ctx.stroke();

        ctx.closePath();
    }
    // ctx.fill();

    ctx.restore();
}

/**
 * Feedback markers
 */
const drawMidiMarkers = () => {
    const width = canvasWidth / 3;
    const centerY = canvasHeight / 4 + 100;
    const innerLeft = canvasWidth / 2 - width / 2;
    const innerRight = canvasWidth / 2 + width / 2;

    ctx.save();
    for (let i = 0; i < midiMarkers.length; i++) {
        const x = width * midiMarkers[i] / 4 + innerLeft;

        ctx.beginPath();

        switch (feedbackMarkers[i]) {
            case feedbackEnum.unmarked:
                ctx.fillStyle = defaultTheme.primaryFront;
                ctx.strokeStyle = defaultTheme.primaryFront;
                break;
            case feedbackEnum.correct:
                ctx.fillStyle = "#0be5a7";
                ctx.strokeStyle = "#0be5a7";
                break;
            case feedbackEnum.incorrect:
                ctx.fillStyle = defaultTheme.secondaryFront;
                ctx.strokeStyle = defaultTheme.secondaryFront;
                break;
        }
        ctx.arc(x, centerY, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.arc(x, centerY, 15, 0, Math.PI * 2);
        ctx.stroke();

        ctx.closePath();
    }
    ctx.restore();
}

/**
 * In the future, tell the user how far off they are
 */
const drawTimedMidiFeedback = () => {

}

const debugThing = (enabled = true) => {
    debugColor = enabled ? defaultTheme.secondary : defaultTheme.primary;
}

const resetMetronome = () => metronomeIndex = -1;
const incrementMetronome = () => metronomeIndex++;

const setStartTime = time => {
    startTime = time;
}

/**
 * 
 * @param {number[]} timestamps format: [n1, n2] where n is the timestamp of a note in seconds
 */
const loadMidiMarkers = timestamps => {
    midiMarkers = timestamps;
    feedbackMarkers = midiMarkers.map(() => feedbackEnum.unmarked);
}

/**
 * Called when the user presses a button. This checks the nearest midi note to see if the user was close enough
 * @param {*} time 
 */
const approximateInput = time => {
    midiMarkers.forEach((marker, i) => {
        if (Math.abs(time - startTime - marker + inputOffset) < 0.1) {
            feedbackMarkers[i] = feedbackEnum.correct;
        }
    })

    // ctx.beginPath();

    // ctx.arc(canvasWidth / 3 * (time - startTime) / 4 + canvasWidth / 2 - canvasWidth / 6, canvasHeight / 4 + 50, 15, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();
}

// Force incorrect feedback when it's too late for the player to get a note
const forceIncorrectFeedback = (time, noteOffset = 0) => {
    midiMarkers.forEach((marker, i) => {
        if (marker == time) {
            if (i + noteOffset >= 0)
                if (feedbackMarkers[i + noteOffset] == feedbackEnum.unmarked) {
                    feedbackMarkers[i + noteOffset] = feedbackEnum.incorrect;
                }
        }
    })
}

export { setupCanvas, draw, debugThing, loadMidiMarkers, resetMetronome, incrementMetronome, setStartTime, approximateInput, forceIncorrectFeedback }