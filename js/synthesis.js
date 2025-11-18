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

        // FM synthesis for bell-like tone
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const envelope = this.ctx.createGain();

        // FM configuration
        carrier.frequency.value = frequency;
        modulator.frequency.value = frequency * 2.01; // Slightly detuned
        modGain.gain.value = frequency * 0.5;

        // Connections
        modulator.connect(modGain);
        modGain.connect(carrier.frequency);
        carrier.connect(envelope);
        envelope.connect(this.output);

        // Sharp attack, medium decay (percussive)
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity, now + 0.005);
        envelope.gain.exponentialRampToValueAtTime(velocity * 0.3, now + 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        carrier.start(now);
        modulator.start(now);
        carrier.stop(now + duration);
        modulator.stop(now + duration);

        return { carrier, modulator, envelope };
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

        // Pure sine wave for sub bass
        const osc = this.ctx.createOscillator();
        const envelope = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.value = frequency;

        // Low-pass filter
        filter.type = 'lowpass';
        filter.frequency.value = frequency * 4;
        filter.Q.value = 2;

        // Connections
        osc.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        // Envelope - slow attack, sustained
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity, now + 0.05);
        envelope.gain.setValueAtTime(velocity, now + duration - 0.1);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.start(now);
        osc.stop(now + duration);

        return { osc, envelope, filter };
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

        // Multiple detuned oscillators for thickness
        const oscs = [];
        const detunes = [-7, -3, 0, 3, 7]; // Cents
        const envelope = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'lowpass';
        filter.frequency.value = frequency * 8;
        filter.Q.value = 1;

        detunes.forEach(detune => {
            const osc = this.ctx.createOscillator();
            osc.type = 'sawtooth';
            osc.frequency.value = frequency;
            osc.detune.value = detune;
            osc.connect(filter);
            oscs.push(osc);
        });

        filter.connect(envelope);
        envelope.connect(this.output);

        // Slow attack, long release
        const attack = 0.8;
        const release = 1.5;
        envelope.gain.setValueAtTime(0, now);
        envelope.gain.linearRampToValueAtTime(velocity / detunes.length, now + attack);
        envelope.gain.setValueAtTime(velocity / detunes.length, now + duration - release);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + duration);

        // LFO for filter movement
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.value = 0.2; // Slow
        lfoGain.gain.value = frequency * 2;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        oscs.forEach(osc => osc.start(now));
        lfo.start(now);

        oscs.forEach(osc => osc.stop(now + duration));
        lfo.stop(now + duration);

        return { oscs, envelope, filter, lfo };
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

        osc.type = 'sine';

        // Pitch envelope for kick
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.1);

        // Distortion curve
        distortion.curve = this.makeDistortionCurve(100);
        distortion.oversample = '4x';

        osc.connect(distortion);
        distortion.connect(envelope);
        envelope.connect(this.output);

        // Sharp envelope
        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);

        return { osc, envelope };
    }

    triggerSnare(velocity = 0.7) {
        const now = this.ctx.currentTime;

        // Noise component
        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();

        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.value = 2000;
        noiseFilter.Q.value = 2;

        // Tone component
        const osc = this.ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 200;

        const envelope = this.ctx.createGain();
        const distortion = this.ctx.createWaveShaper();
        distortion.curve = this.makeDistortionCurve(80);

        noise.connect(noiseFilter);
        noiseFilter.connect(distortion);
        osc.connect(distortion);
        distortion.connect(envelope);
        envelope.connect(this.output);

        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        noise.start(now);
        osc.start(now);
        noise.stop(now + 0.2);
        osc.stop(now + 0.2);

        return { noise, osc, envelope };
    }

    triggerHihat(velocity = 0.4) {
        const now = this.ctx.currentTime;

        const noise = this.ctx.createBufferSource();
        noise.buffer = this.createNoiseBuffer();

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 7000;

        const envelope = this.ctx.createGain();

        noise.connect(filter);
        filter.connect(envelope);
        envelope.connect(this.output);

        envelope.gain.setValueAtTime(velocity, now);
        envelope.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        noise.start(now);
        noise.stop(now + 0.1);

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
