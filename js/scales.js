// scales.js - Music Theory Foundation
// Harmonic system for minimal, tech-dub, and ambient music

// MIDI note to frequency conversion
export const midiToFreq = (midi) => 440 * Math.pow(2, (midi - 69) / 12);

// Note names to MIDI numbers
export const notes = {
    'C': 0, 'C#': 1, 'Db': 1,
    'D': 2, 'D#': 3, 'Eb': 3,
    'E': 4,
    'F': 5, 'F#': 6, 'Gb': 6,
    'G': 7, 'G#': 8, 'Ab': 8,
    'A': 9, 'A#': 10, 'Bb': 10,
    'B': 11
};

// Scale formulas (intervals from root)
export const scaleFormulas = {
    // Minimal Music Scales (Philip Glass, Michael Nyman)
    dorian: [0, 2, 3, 5, 7, 9, 10],           // Minor with raised 6th
    phrygian: [0, 1, 3, 5, 7, 8, 10],         // Minor with flat 2nd
    aeolian: [0, 2, 3, 5, 7, 8, 10],          // Natural minor
    mixolydian: [0, 2, 4, 5, 7, 9, 10],       // Major with flat 7th

    // Pentatonic for ambient
    minor_pentatonic: [0, 3, 5, 7, 10],
    major_pentatonic: [0, 2, 4, 7, 9],

    // Simple for tech-dub (often just bass notes)
    bass_notes: [0, 5, 7, 10],                // Root, 5th, 7th, flat 7th

    // Chromatic for experimental
    chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
};

// Generate scale from root note and formula
export const generateScale = (root, scaleType, octaves = 3) => {
    const formula = scaleFormulas[scaleType] || scaleFormulas.dorian;
    const rootMidi = notes[root] + 48; // Start at C3
    const scale = [];

    for (let oct = 0; oct < octaves; oct++) {
        for (let interval of formula) {
            scale.push(rootMidi + (oct * 12) + interval);
        }
    }

    return scale;
};

// Get frequency array from scale
export const getScaleFrequencies = (root, scaleType, octaves = 3) => {
    const midiNotes = generateScale(root, scaleType, octaves);
    return midiNotes.map(midiToFreq);
};

// Common chord voicings for minimal music
export const chordVoicings = {
    // Power chord (root, 5th, octave) - minimal dub
    power: [0, 7, 12],

    // Triad
    minor: [0, 3, 7],
    major: [0, 4, 7],

    // 7th chords for dub
    minor7: [0, 3, 7, 10],
    major7: [0, 4, 7, 11],
    dominant7: [0, 4, 7, 10],

    // Extended for Glass-style
    minor9: [0, 3, 7, 10, 14],
    major9: [0, 4, 7, 11, 14],

    // Suspended
    sus2: [0, 2, 7],
    sus4: [0, 5, 7]
};

// Generate chord frequencies from root
export const getChord = (rootFreq, voicing) => {
    const intervals = chordVoicings[voicing] || chordVoicings.power;
    return intervals.map(interval => rootFreq * Math.pow(2, interval / 12));
};

// Preset scale configurations for quick access
export const scalePresets = {
    'C Dorian': { root: 'C', type: 'dorian' },
    'D Phrygian': { root: 'D', type: 'phrygian' },
    'A Aeolian': { root: 'A', type: 'aeolian' },
    'E Minor Pent': { root: 'E', type: 'minor_pentatonic' },
    'C Minor Pent': { root: 'C', type: 'minor_pentatonic' },
    'G Mixolydian': { root: 'G', type: 'mixolydian' },
    'C Bass': { root: 'C', type: 'bass_notes' },
    'Eb Bass': { root: 'Eb', type: 'bass_notes' }
};

// Get random note from scale (for generative algorithms)
export const getRandomScaleNote = (scale) => {
    return scale[Math.floor(Math.random() * scale.length)];
};

// Markov chain for melodic generation
export class MarkovMelody {
    constructor(scale) {
        this.scale = scale;
        this.transitionMatrix = this.buildTransitionMatrix();
        this.currentNote = scale[0];
    }

    buildTransitionMatrix() {
        // Simple transition probabilities:
        // Higher probability for small intervals (stepwise motion)
        // Lower for large leaps
        const matrix = {};

        this.scale.forEach((note, i) => {
            matrix[i] = {};
            this.scale.forEach((targetNote, j) => {
                const interval = Math.abs(j - i);
                // Prefer steps and small leaps (Glass/Nyman style)
                if (interval === 0) matrix[i][j] = 0.1;      // Stay
                else if (interval === 1) matrix[i][j] = 0.4; // Step
                else if (interval === 2) matrix[i][j] = 0.25;// Skip
                else if (interval === 3) matrix[i][j] = 0.15;// Small leap
                else matrix[i][j] = 0.1;                      // Large leap
            });
        });

        return matrix;
    }

    getNextNote() {
        const currentIndex = this.scale.indexOf(this.currentNote);
        const probabilities = this.transitionMatrix[currentIndex];

        // Weighted random selection
        const rand = Math.random();
        let cumulative = 0;

        for (let i = 0; i < this.scale.length; i++) {
            cumulative += probabilities[i];
            if (rand < cumulative) {
                this.currentNote = this.scale[i];
                return midiToFreq(this.currentNote);
            }
        }

        return midiToFreq(this.currentNote);
    }
}

export default {
    midiToFreq,
    notes,
    scaleFormulas,
    generateScale,
    getScaleFrequencies,
    chordVoicings,
    getChord,
    scalePresets,
    getRandomScaleNote,
    MarkovMelody
};
