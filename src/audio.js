
// Temporary. In the future, move this to a JSON file and load with fetch/XHR
const midiFiles = {
    demo: {
        path: "midi/full_bar_quarter_notes.mid",
        name: "Demo"
    },
    melody: {
        path: "midi/simple_melody.mid",
        name: "Simple Melody"
    }
}

let currentMidi = null;

const loadMidi = async filepath => {
    currentMidi = await Midi.fromUrl(filepath);
}

// These are temporary functions. In the future, we can have a more robust/scalable way of loading files
const loadMelody = async () => await loadMidi(midiFiles.melody.path);
const loadDemo = async () => await loadMidi(midiFiles.demo.path);

const playMidi = () => {
    // await loadMidi(midiFiles.melody.path);

    if (currentMidi) {
        const now = Tone.now();
        const synth = new Tone.AMSynth().toDestination();
        currentMidi.tracks[0].notes.forEach(note => {
            synth.triggerAttackRelease(
                note.name,
                note.duration,
                note.time + now,
                note.velocity);
        });
    }

    // If you want to hard-code audio

    // const synthA = new Tone.FMSynth().toDestination();
    // //play a note every quarter-note
    // const loopA = new Tone.Loop(time => {
    //     synthA.triggerAttackRelease("C2", "8n", time);
    // }, "4n").start(0);

    // Tone.Transport.start();
}

export { loadDemo, loadMelody, playMidi };