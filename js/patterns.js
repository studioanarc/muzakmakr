// patterns.js - Rhythm Pattern Generation
// Euclidean, phasing, probabilistic, and other generative algorithms

// Euclidean Rhythm Generator (Bjorklund's algorithm)
// E(k, n) = k hits distributed as evenly as possible over n steps
// Perfect for minimal music and tech-dub
export const euclideanRhythm = (hits, steps) => {
    if (hits >= steps) {
        return Array(steps).fill(1);
    }
    if (hits === 0) {
        return Array(steps).fill(0);
    }

    const pattern = [];
    const bucket = [];

    for (let i = 0; i < steps; i++) {
        bucket.push(Math.floor((hits * (i + 1)) / steps) - Math.floor((hits * i) / steps));
    }

    return bucket;
};

// Common euclidean patterns for different feels
export const euclideanPresets = {
    // Minimal / Ambient
    'Sparse': { hits: 3, steps: 16 },      // •  •    •
    'Minimal': { hits: 5, steps: 16 },     // Glass-style spacing
    'Phasing': { hits: 11, steps: 16 },    // Dense for phasing effects

    // Tech-dub
    'Dub Kick': { hits: 5, steps: 16 },
    'Dub Bass': { hits: 7, steps: 16 },
    'Offbeat': { hits: 8, steps: 16 },

    // Polyrhythmic
    '3-4': { hits: 3, steps: 8 },
    '5-4': { hits: 5, steps: 16 },
    '7-4': { hits: 7, steps: 16 },

    // Dense
    'Almost All': { hits: 13, steps: 16 },
    'Constant': { hits: 16, steps: 16 }
};

// Probabilistic pattern - each step has X% chance to trigger
export const probabilisticPattern = (steps, probability) => {
    const pattern = [];
    for (let i = 0; i < steps; i++) {
        pattern.push(Math.random() < probability ? 1 : 0);
    }
    return pattern;
};

// Phasing Pattern Generator
// Creates two patterns that gradually shift out of phase (Steve Reich style)
export class PhasingPattern {
    constructor(basePattern, speedRatio = 0.995) {
        this.pattern1 = [...basePattern];
        this.pattern2 = [...basePattern];
        this.position1 = 0;
        this.position2 = 0;
        this.speedRatio = speedRatio; // Pattern 2 plays at 99.5% speed
        this.stepAccumulator = 0;
    }

    step(bpm, sampleRate) {
        const beatsPerSecond = bpm / 60;
        const samplesPerBeat = sampleRate / beatsPerSecond / 4; // 16th notes

        // Pattern 1 advances normally
        this.position1 = (this.position1 + 1) % this.pattern1.length;

        // Pattern 2 advances at different speed
        this.stepAccumulator += this.speedRatio;
        if (this.stepAccumulator >= 1) {
            this.position2 = (this.position2 + 1) % this.pattern2.length;
            this.stepAccumulator -= 1;
        }

        return {
            pattern1: this.pattern1[this.position1],
            pattern2: this.pattern2[this.position2],
            phase: (this.position1 - this.position2) / this.pattern1.length
        };
    }

    getCurrentNotes() {
        return {
            note1: this.pattern1[this.position1],
            note2: this.pattern2[this.position2]
        };
    }
}

// Cellular Automata Pattern (Rule 30, Rule 110, etc.)
// Creates evolving patterns
export class CellularPattern {
    constructor(size = 16, rule = 30) {
        this.size = size;
        this.rule = rule;
        this.cells = this.initCells();
    }

    initCells() {
        const cells = Array(this.size).fill(0);
        cells[Math.floor(this.size / 2)] = 1; // Seed in middle
        return cells;
    }

    step() {
        const newCells = [...this.cells];

        for (let i = 0; i < this.size; i++) {
            const left = this.cells[i === 0 ? this.size - 1 : i - 1];
            const center = this.cells[i];
            const right = this.cells[i === this.size - 1 ? 0 : i + 1];

            const neighborhood = (left << 2) | (center << 1) | right;
            newCells[i] = (this.rule >> neighborhood) & 1;
        }

        this.cells = newCells;
        return this.cells;
    }

    getPattern() {
        return this.cells;
    }
}

// Polyrhythm Generator
// Creates two or more patterns with different cycle lengths
export const polyrhythm = (rhythm1Length, rhythm2Length, steps = 16) => {
    const pattern1 = [];
    const pattern2 = [];

    for (let i = 0; i < steps; i++) {
        pattern1.push(i % rhythm1Length === 0 ? 1 : 0);
        pattern2.push(i % rhythm2Length === 0 ? 1 : 0);
    }

    return { pattern1, pattern2 };
};

// Additive Process (Philip Glass technique)
// Gradually adds notes to a pattern
export class AdditivePattern {
    constructor(baseMotif) {
        this.baseMotif = baseMotif; // e.g., [1,0,1,0]
        this.currentLength = 1;
        this.maxLength = baseMotif.length;
    }

    grow() {
        if (this.currentLength < this.maxLength) {
            this.currentLength++;
        }
    }

    shrink() {
        if (this.currentLength > 1) {
            this.currentLength--;
        }
    }

    getPattern() {
        return this.baseMotif.slice(0, this.currentLength);
    }
}

// Pattern Utilities
export const rotatePattern = (pattern, steps) => {
    const normalized = steps % pattern.length;
    return [...pattern.slice(normalized), ...pattern.slice(0, normalized)];
};

export const invertPattern = (pattern) => {
    return pattern.map(v => v === 0 ? 1 : 0);
};

export const combinePatterns = (pattern1, pattern2, method = 'OR') => {
    const maxLength = Math.max(pattern1.length, pattern2.length);
    const result = [];

    for (let i = 0; i < maxLength; i++) {
        const v1 = pattern1[i % pattern1.length] || 0;
        const v2 = pattern2[i % pattern2.length] || 0;

        switch(method) {
            case 'OR':
                result.push(v1 || v2 ? 1 : 0);
                break;
            case 'AND':
                result.push(v1 && v2 ? 1 : 0);
                break;
            case 'XOR':
                result.push(v1 !== v2 ? 1 : 0);
                break;
            default:
                result.push(v1);
        }
    }

    return result;
};

// Convert pattern to visual representation
export const patternToString = (pattern) => {
    return pattern.map(v => v ? '●' : '○').join('');
};

// Generate break pattern (removes beats for tension)
// Common in tech-dub
export const generateBreak = (pattern, breakProbability = 0.3) => {
    return pattern.map(v => {
        if (v === 1 && Math.random() < breakProbability) {
            return 0; // Remove this hit
        }
        return v;
    });
};

export default {
    euclideanRhythm,
    euclideanPresets,
    probabilisticPattern,
    PhasingPattern,
    CellularPattern,
    polyrhythm,
    AdditivePattern,
    rotatePattern,
    invertPattern,
    combinePatterns,
    patternToString,
    generateBreak
};
