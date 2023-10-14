import { defaultTheme } from "./theme.js";

let ctx, width, height;

/**
 * Set up the visualizer
 * NOTE: Any visuals that require audio analysis should use an "analyzerNode" parameter, 
 * pointing to a reference of an AudioContext.analizerNode
 * @param {*} canvas 
 */
const setupCanvas = (canvas) => {
    ctx = canvas.getContext("2d");
    width = canvas.width;
    height = canvas.height;
}

/**
 * This can use RequestAnimationFrame() to update every frame. For now, it only needs to be displayed once
 * @param {*} params 
 */
const draw = (params = {}) => {

    // Background
    ctx.save();
    ctx.fillStyle = defaultTheme.primary;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
}

export { setupCanvas, draw }