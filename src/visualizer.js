import { defaultTheme } from "./theme.js";

let ctx, canvasWidth, canvasHeight;

let debugColor = defaultTheme.primary;
let midiMarkers = [];
let metronomeIndex = -1;
let metronomeMarkers = 12;

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
}

/**
 * This can use RequestAnimationFrame() to update every frame. For now, it only needs to be displayed once
 * @param {*} params 
 */
const draw = (params = {}) => {

    // Background
    ctx.save();
    ctx.fillStyle = defaultTheme.primary;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // ctx.fillStyle = debugColor;
    // // ctx.fillStyle = "white";
    // ctx.beginPath();
    // ctx.arc(canvasWidth / 2, canvasHeight / 2 - 100, 50, 0, Math.PI * 2);
    // ctx.fill();
    // ctx.closePath();

    drawMarkers();

    requestAnimationFrame(() => draw(params))
}

const drawMarkers = () => {
    const width = canvasWidth / 3;
    const centerY = canvasHeight / 4;
    const innerLeft = canvasWidth / 2 - width / 2;
    const innerRight = canvasWidth / 2 + width / 2;

    ctx.save();
    ctx.fillStyle = defaultTheme.primaryFront;
    ctx.strokeStyle = defaultTheme.primaryFront;

    // left and right markers
    ctx.beginPath();
    ctx.rect(innerLeft - 2, centerY - 25, 5, 50);
    ctx.rect(innerRight + 2, centerY - 25, 5, 50);
    ctx.fill();
    ctx.closePath();

    const spacing = width / (metronomeMarkers - 4);
    for (let i = 0; i < metronomeMarkers; i++) {
        if (i == 4) continue;
        ctx.beginPath();
        ctx.arc(innerLeft + i * spacing - 4 * spacing, centerY, 5, 0, Math.PI * 2);
        ctx.stroke();
        if (i == metronomeIndex)
            ctx.fill();
        ctx.closePath();
    }
    // ctx.fill();

    ctx.restore();
}

const debugThing = (enabled = true) => {
    debugColor = enabled ? defaultTheme.secondary : defaultTheme.primary;
}

const resetMetronome = () => metronomeIndex = -1;
const incrementMetronome = () => metronomeIndex ++;

/**
 * 
 * @param {number[]} timestamps format: [n1, n2] where n is the timestamp of a note in seconds
 */
const loadMidiMarkers = timestamps => {
    midiMarkers = timestamps;
}

export { setupCanvas, draw, debugThing, loadMidiMarkers, resetMetronome, incrementMetronome }