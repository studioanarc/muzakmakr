// presets.js - Preset configurations for different musical styles
// Philip Glass minimalism, tech-dub, ambient, etc.

export const presets = {
    'Glass Arpeggios': {
        name: 'Glass Arpeggios',
        description: 'Philip Glass-style cascading minimal patterns',
        bpm: 126,
        voices: [
            {
                synthType: 'piano',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 13,
                euclideanSteps: 16,
                volume: 0.55,
                scale: 'C Dorian'
            },
            {
                synthType: 'piano',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 9,
                euclideanSteps: 16,
                volume: 0.45,
                scale: 'C Dorian'
            },
            {
                synthType: 'bass',
                effectType: 'none',
                patternType: 'euclidean',
                euclideanHits: 3,
                euclideanSteps: 8,
                volume: 0.65,
                scale: 'C Bass'
            }
        ]
    },

    'Dub Pressure': {
        name: 'Dub Pressure',
        description: 'Deep sub-bass with dub echoes and heavy groove',
        bpm: 82,
        voices: [
            {
                synthType: 'bass',
                effectType: 'distortion',
                patternType: 'euclidean',
                euclideanHits: 7,
                euclideanSteps: 16,
                volume: 0.75,
                scale: 'E Bass'
            },
            {
                synthType: 'piano',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 5,
                euclideanSteps: 16,
                volume: 0.35,
                scale: 'E Minor Pent'
            },
            {
                synthType: 'drum',
                effectType: 'bitcrush',
                patternType: 'euclidean',
                euclideanHits: 8,
                euclideanSteps: 16,
                volume: 0.55,
                scale: 'E Minor Pent'
            }
        ]
    },

    'Ambient Decay': {
        name: 'Ambient Decay',
        description: 'Lush pads with lo-fi percussion textures',
        bpm: 68,
        voices: [
            {
                synthType: 'pad',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 4,
                euclideanSteps: 16,
                volume: 0.55,
                scale: 'A Aeolian'
            },
            {
                synthType: 'drum',
                effectType: 'bitcrush',
                patternType: 'euclidean',
                euclideanHits: 5,
                euclideanSteps: 13,
                volume: 0.5,
                scale: 'A Aeolian'
            },
            {
                synthType: 'bass',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 3,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'A Bass'
            }
        ]
    },

    'Phasing Minimalism': {
        name: 'Phasing Minimalism',
        description: 'Steve Reich-style phasing patterns',
        bpm: 120,
        voices: [
            {
                synthType: 'piano',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 12,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'C Dorian'
            },
            {
                synthType: 'piano',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 11,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'C Dorian'
            },
            {
                synthType: 'bass',
                effectType: 'none',
                patternType: 'euclidean',
                euclideanHits: 3,
                euclideanSteps: 8,
                volume: 0.6,
                scale: 'C Bass'
            }
        ]
    },

    'Nyman Cycles': {
        name: 'Nyman Cycles',
        description: 'Michael Nyman-inspired cycling patterns',
        bpm: 140,
        voices: [
            {
                synthType: 'piano',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 13,
                euclideanSteps: 16,
                volume: 0.6,
                scale: 'G Mixolydian'
            },
            {
                synthType: 'piano',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 9,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'G Mixolydian'
            },
            {
                synthType: 'bass',
                effectType: 'none',
                patternType: 'euclidean',
                euclideanHits: 5,
                euclideanSteps: 16,
                volume: 0.7,
                scale: 'C Bass'
            }
        ]
    },

    'Stott Textures': {
        name: 'Stott Textures',
        description: 'Deep sub pressure with evolving dark pads',
        bpm: 75,
        voices: [
            {
                synthType: 'bass',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 7,
                euclideanSteps: 16,
                volume: 0.7,
                scale: 'D Bass'
            },
            {
                synthType: 'pad',
                effectType: 'filter',
                patternType: 'euclidean',
                euclideanHits: 5,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'D Phrygian'
            },
            {
                synthType: 'drum',
                effectType: 'distortion',
                patternType: 'euclidean',
                euclideanHits: 9,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'D Phrygian'
            }
        ]
    },

    'Sparse Minimal': {
        name: 'Sparse Minimal',
        description: 'Space and silence as compositional elements',
        bpm: 92,
        voices: [
            {
                synthType: 'piano',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 4,
                euclideanSteps: 16,
                volume: 0.55,
                scale: 'A Aeolian'
            },
            {
                synthType: 'bass',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 3,
                euclideanSteps: 12,
                volume: 0.6,
                scale: 'A Bass'
            }
        ]
    },

    'Dense Polyrhythm': {
        name: 'Dense Polyrhythm',
        description: 'Interlocking cycles creating evolving complexity',
        bpm: 108,
        voices: [
            {
                synthType: 'piano',
                effectType: 'reverb',
                patternType: 'euclidean',
                euclideanHits: 9,
                euclideanSteps: 16,
                volume: 0.5,
                scale: 'D Phrygian'
            },
            {
                synthType: 'piano',
                effectType: 'delay',
                patternType: 'euclidean',
                euclideanHits: 7,
                euclideanSteps: 13,
                volume: 0.4,
                scale: 'D Phrygian'
            },
            {
                synthType: 'bass',
                effectType: 'none',
                patternType: 'euclidean',
                euclideanHits: 4,
                euclideanSteps: 11,
                volume: 0.65,
                scale: 'D Bass'
            }
        ]
    }
};

// Generate a random preset
export function generateRandomPreset() {
    const synthTypes = ['piano', 'bass', 'pad', 'drum'];
    const effectTypes = ['none', 'reverb', 'delay', 'filter', 'bitcrush', 'distortion'];
    const scales = ['C Dorian', 'D Phrygian', 'A Aeolian', 'E Minor Pent', 'C Minor Pent', 'G Mixolydian'];
    const numVoices = 2 + Math.floor(Math.random() * 2); // 2-3 voices

    const voices = [];
    for (let i = 0; i < numVoices; i++) {
        voices.push({
            synthType: synthTypes[Math.floor(Math.random() * synthTypes.length)],
            effectType: effectTypes[Math.floor(Math.random() * effectTypes.length)],
            patternType: 'euclidean',
            euclideanHits: 3 + Math.floor(Math.random() * 11), // 3-13 hits
            euclideanSteps: 12 + Math.floor(Math.random() * 5), // 12-16 steps
            volume: 0.4 + Math.random() * 0.4, // 0.4-0.8
            scale: scales[Math.floor(Math.random() * scales.length)]
        });
    }

    return {
        name: 'Random ' + Date.now(),
        description: 'Randomly generated preset',
        bpm: 60 + Math.floor(Math.random() * 100), // 60-160 BPM
        voices: voices
    };
}

// Save preset to localStorage
export function savePreset(name, state) {
    const presetData = {
        name: name,
        description: 'Custom preset',
        ...state
    };

    const saved = getSavedPresets();
    saved[name] = presetData;

    localStorage.setItem('muzakmakr_presets', JSON.stringify(saved));
    return presetData;
}

// Get all saved presets from localStorage
export function getSavedPresets() {
    const saved = localStorage.getItem('muzakmakr_presets');
    return saved ? JSON.parse(saved) : {};
}

// Delete a saved preset
export function deletePreset(name) {
    const saved = getSavedPresets();
    delete saved[name];
    localStorage.setItem('muzakmakr_presets', JSON.stringify(saved));
}

// Get all presets (built-in + saved)
export function getAllPresets() {
    return { ...presets, ...getSavedPresets() };
}

export default {
    presets,
    generateRandomPreset,
    savePreset,
    getSavedPresets,
    deletePreset,
    getAllPresets
};
