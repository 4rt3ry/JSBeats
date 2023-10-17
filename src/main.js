import * as utils from "./utils.js"
import * as visualizer from "./visualizer.js"
import * as audio from "./audio.js"

const init = () => {
    const canvas = document.querySelector("canvas");

    // Load audio data when the webpage loads. This async so it can be placed anywhere in Init()
    // audio.loadDemo();
    audio.load(() => {
        document.querySelector("#play-button").removeAttribute("disabled")
        audio.setCurrentMidi("Beginner 2");

        const midiOptions = document.querySelector("#midi-options");
        midiOptions.innerHTML = audio.midiFiles.map(name => `<option>${name}<options>`).join("");
        midiOptions.addEventListener("change", e => audio.setCurrentMidi(e.target.value));
    });


    setupUI(canvas); // can be called anywhere in Init()

    // Set up canvas before drawing
    visualizer.setupCanvas(canvas);
    visualizer.draw();
}

const setupUI = canvas => {
    // DOM References
    const playBtn = document.querySelector("#play-button");
    // ...
    // ...

    // Register events
    playBtn.onclick = audio.playMidi;
    // ...
    // ...
}

init();