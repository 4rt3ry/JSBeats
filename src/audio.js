import * as visualizer from "./visualizer.js"



let midiFiles = {};
let midiFileNames = [];
let currentMidi = null;
let percussionSampler = null;
let metronomeLoop;
let midiPart;

/**
 * Load a specific midi file
 * @param {object} midi object: {path: string, name: string}
 */
const loadMidiFile = async midi => {
    currentMidi = await Midi.fromUrl(midi.path);
    midiFiles[midi.name] = currentMidi;
    midiFileNames.push(midi.name);
}

/**
 * Set the midi file that will be played next. Invoke setCurrentMidi() from
 * user input or in the load() callback to ensure midi files finished loading.
 * @param {string} name name of the midi file according to audio-data.json
 */
const setCurrentMidi = name => {
    currentMidi = midiFiles[name];
}

/**
 * Load all midi files and samplers. Once all sound files have been loaded, the callback will be invoked.
 * @param {Function} callback - The callback is called once all sound files have been loaded
 */
const load = async callback => {
    fetch("data/audio-data.json")
        .then(response => response.json(), error => "error")
        .then(json => {
            if (json == "error") return; // Potentially do some other error handling

            // load midi files
            const midiData = json["midi"];
            Object.keys(midiData).forEach(async midiName => {
                midiFiles[midiName] = await Midi.fromUrl(midiData[midiName]);
                midiFileNames.push(midiName);
            })

            // load sampler
            const sampler = json["sampler"];
            percussionSampler = new Tone.Sampler(sampler).toDestination();

            // Ensure all audio loads
            Tone.loaded().then(() => {
                // set default midi file
                currentMidi = Object.values(midiFiles)[0];
                callback();
            });
        })
}

// These are temporary functions. In the future, we can have a more robust/scalable way of loading files
const loadMelody = async () => await loadMidiFile(midiFiles.melody);
const loadDemo = async () => await loadMidiFile(midiFiles.demo);

const playMidi = () => {
    // await loadMidi(midiFiles.melody.path);
    if (!currentMidi) return;

    // reset tracks
    midiPart?.stop();
    midiPart?.dispose();
    metronomeLoop?.stop();
    metronomeLoop?.dispose();
    visualizer.resetMetronome();

    // debugger;

    Tone.Transport.bpm.value = 100;
    let now = Tone.now();

    let midiToPart = [];

    currentMidi.tracks.forEach(track => {
        track.notes.forEach(note => {
            midiToPart.push({
                time: note.time,
                note: note.name,
                velocity: 0.8
            });
        });
    });

    midiPart = new Tone.Part((time, value) => {
        percussionSampler.triggerAttackRelease(value.note, "8n", time, value.velocity);
    }, midiToPart);

    metronomeLoop = new Tone.Part((time, note) => {
        percussionSampler.triggerAttackRelease(note, 0.5, time);
        visualizer.incrementMetronome();
    }, [[0, "E4"], [0.5, "E4"] , [1, "E4"], [1.5, "E4"]]);
    metronomeLoop.loop = 3;
    metronomeLoop.loopEnd = 2;
    // debugger;

    metronomeLoop.start(now);
    midiPart.start(now + 2);
    Tone.Transport.start();

    // If you want to hard-code audio

    // const synthA = new Tone.FMSynth().toDestination();
    // //play a note every quarter-note
    // const loopA = new Tone.Loop(time => {
    //     synthA.triggerAttackRelease("C2", "8n", time);
    // }, "4n").start(0);

    // Tone.Transport.start();
}

/**
 * Play a single sound immediately
 */
const playSingle = () => {
    percussionSampler.triggerAttackRelease("D4", "8n", Tone.now());
    console.log("boop: " + Tone.now())
}

export { loadMidiFile, load, playMidi, setCurrentMidi, midiFileNames as midiFiles, playSingle };