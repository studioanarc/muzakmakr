// synthesis.js - Synth engines for minimal, dub, and ambient music
// Using Web Audio API

// Base Synth Voice
export class SynthVoice {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.output = this.ctx.createGain();
    }

    connect(destination) {
        this.output.connect(destination);
        return this;
    }

    disconnect() {
        this.output.disconnect();
    }
}

// Minimal Piano/Bell Synth (Philip Glass style)
// Bright, percussive, arpeggiated sounds
export class MinimalPianoVoice extends SynthVoice {
    constructor(audioContext) {
        super(audioContext);
        this.type = 'minimal_piano';
    }

    trigger(frequency, duration = 0.5, velocity = 0.7) {
        const now = this.ctx.currentTime;

        // FM synthesis for bell-like tone with richer harmonics
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const envelope = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // FM configuration - adjusted for brighter, clearer tone
        carrier.type = 'sine';
        carrier.frequency.value = frequency;
        modulator.type = 'sine';
        modulator.frequency.value = frequency * 3.5; // Higher ratio for bell-like quality
        modGain.gain.value = frequency * 1.2; // Increased modulation depth

        // High-pass filter for clarity
        filter.type = 'highpass';
        filter.frequency.value = 100;
        filter.Q.value = 0.7;

        // Connections
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        // Sharp attack, longer sustain with natural decay
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity * 0.9, now + 0.003); // Very fast attack
        envelope.gain.exponentialRampToValueAtTime(velocity * 0.5, now + 0.08);
        envelope.gain.exponentialRampToValueAtTime(velocity * 0.2, now + 0.3);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + duration);
        modulator.stop(now + duration);

        return { carrier, modulator, envelope, filter };
    }
}

// Sub Bass Synth (Tech-dub style)
// Deep, sustained bass notes
export class SubBassVoice extends SynthVoice {
    constructor(audioContext) {
        super(audioContext);
        this.type = 'sub_bass';
    }

    trigger(frequency, duration = 1.0, velocity = 0.8) {
        const now = this.ctx.currentTime;

        // Sub bass with subtle harmonics for better presence
        const sub = this.ctx.createOscillator();
        const harmonicOsc = this.ctx.createOscillator();
        const harmonicGain = this.ctx.createGain();
        const envelope = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        // Pure sine for fundamental
        sub.type = 'sine';
        sub.frequency.value = frequency;

        // Add subtle second harmonic for warmth (10% volume)
        harmonicOsc.type = 'sine';
        harmonicOsc.frequency.value = frequency * 2;
        harmonicGain.gain.value = 0.15;

        // Low-pass filter to keep it in sub range
        filter.type = 'lowpass';
        filter.frequency.value = Math.min(frequency * 5, 200); // Cap at 200 Hz
        filter.Q.value = 3;

        // Connections
        sub.connect(filter);
        harmonicOsc.connect(harmonicGain);
        harmonicGain.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        // Envelope - punchy attack, sustained
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity, now + 0.02); // Faster attack for punch
        envelope.gain.setValueAtTime(velocity, now + duration - 0.15);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        sub.start(now);
        harmonicOsc.start(now);
        sub.stop(now + duration);
        harmonicOsc.stop(now + duration);

        return { sub, harmonicOsc, envelope, filter };
    }
}

// Synth Pad (Ambient)
// Slow, evolving textures
export class PadVoice extends SynthVoice {
    constructor(audioContext) {
        super(audioContext);
        this.type = 'pad';
    }

    trigger(frequency, duration = 4.0, velocity = 0.5) {
        const now = this.ctx.currentTime;

        // Multiple detuned oscillators for lush thickness
        const oscs = [];
        const detunes = [-12, -7, -3, 0, 3, 7, 12]; // Wider detuning for richness
        const envelope = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = frequency * 6;
        filter.Q.value = 2; // More resonance for character

        // Mix of sawtooth and triangle for warm, analog sound
        detunes.forEach((detune, i) => {
            const osc = this.ctx.createOscillator();
            osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle'; // Alternate for complexity
            osc.frequency.value = frequency;
            osc.detune.value = detune;
            osc.connect(filter);
            oscs.push(osc);
        });

        filter.connect(envelope);
        envelope.connect(this.output);

        // Very slow attack, long release for pad
        const attack = 1.2;
        const release = 2.0;
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity / detunes.length, now + attack);
        envelope.gain.setValueAtTime(velocity / detunes.length, now + duration - release);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // Dual LFOs for organic movement
        const lfo1 = this.ctx.createOscillator();
        const lfo1Gain = this.ctx.createGain();
        lfo1.frequency.value = 0.15; // Slow
        lfo1Gain.gain.value = frequency * 1.5;
        lfo1.connect(lfo1Gain);
        lfo1Gain.connect(filter.frequency);

        const lfo2 = this.ctx.createOscillator();
        const lfo2Gain = this.ctx.createGain();
        lfo2.frequency.value = 0.23; // Slightly different rate
        lfo2Gain.gain.value = frequency;
        lfo2.connect(lfo2Gain);
        lfo2Gain.connect(filter.Q);

        oscs.forEach(osc => osc.start(now));
        lfo1.start(now);
        lfo2.start(now);

        oscs.forEach(osc => osc.stop(now + duration));
        lfo1.stop(now + duration);
        lfo2.stop(now + duration);

        return { oscs, envelope, filter, lfo1, lfo2 };
    }
}

// Distorted Drum Synth (Gil Scott-Heron style)
// Lo-fi, gritty percussion
export class LoFiDrumVoice extends SynthVoice {
    constructor(audioContext) {
        super(audioContext);
        this.type = 'lofi_drum';
    }

    triggerKick(velocity = 0.9) {
        const now = this.ctx.currentTime;

        const osc = this.ctx.createOscillator();
        const envelope = this.ctx.createGain();
        const distortion = this.ctx.createWaveShaper();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';

        // Deeper, punchier kick pitch envelope
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.08);

        // Low-pass filter for thump
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        filter.Q.value = 4;

        // Moderate distortion for character
        distortion.curve = this.makeDistortionCurve(60);
        distortion.oversample = '2x';

        osc.connect(filter);
        filter.connect(distortion);
        distortion.connect(envelope);
        envelope.connect(this.output);

        // Punchy envelope
        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.05);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.start(now);
        osc.stop(now + 0.4);

        return { osc, envelope, filter };
    }

    triggerSnare(velocity = 0.7) {
        const now = this.ctx.currentTime;

        // Noise component (body of snare)
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 2500;
        noiseFilter.Q.value = 3; // Tighter filter for snap

        // Tone component (snare shell)
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 180;

        const envelope = this.ctx.createGain();
        const distortion = this.ctx.createWaveShaper();
        distortion.curve = this.makeDistortionCurve(120); // More grit

        noise.connect(noiseFilter);
        noiseFilter.connect(distortion);
        osc.connect(distortion);
        distortion.connect(envelope);
        envelope.connect(this.output);

        // Snappy envelope
        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(velocity * 0.2, now + 0.08);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        noise.start(now);
        osc.start(now);
        noise.stop(now + 0.25);
        osc.stop(now + 0.25);

        return { noise, osc, envelope };
    }

    triggerHihat(velocity = 0.4) {
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 8000; // Higher for crisp hi-hat
        filter.Q.value = 1;

        const envelope = this.ctx.createGain();

        noise.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        // Quick decay for tight hi-hat
        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        noise.start(now);
        noise.stop(now + 0.08);

        return { noise, envelope };
    }

    createNoiseBuffer() {
        const bufferSize = this.ctx.sampleRate * 0.5;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        return buffer;
    }

    makeDistortionCurve(amount) {
        const samples = 44100;
        const curve = new Float32Array(samples);
        const deg = Math.PI / 180;

        for (let i = 0; i < samples; i++) {
            const x = (i * 2) / samples - 1;
            curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
        }

        return curve;
    }
}

// Synth Factory
export class SynthEngine {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.voices = new Map();
    }

    createVoice(type) {
        switch(type) {
            case 'minimal_piano':
            case 'piano':
            case 'bell':
                return new MinimalPianoVoice(this.ctx);

            case 'sub_bass':
            case 'bass':
                return new SubBassVoice(this.ctx);

            case 'pad':
            case 'ambient':
                return new PadVoice(this.ctx);

            case 'lofi_drum':
            case 'drum':
            case 'percussion':
                return new LoFiDrumVoice(this.ctx);

            default:
                return new MinimalPianoVoice(this.ctx);
        }
    }

    getVoiceTypes() {
        return [
            { value: 'piano', label: 'Minimal Piano' },
            { value: 'bass', label: 'Sub Bass' },
            { value: 'pad', label: 'Ambient Pad' },
            { value: 'drum', label: 'Lo-Fi Drums' }
        ];
    }
}

export default {
    SynthVoice,
    MinimalPianoVoice,
    SubBassVoice,
    PadVoice,
    LoFiDrumVoice,
    SynthEngine
};
