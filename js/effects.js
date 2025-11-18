// effects.js - Audio effects for tech-dub and ambient processing
// Delay, reverb, filters, distortion, etc.

// Base Effect Class
export class Effect {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.input = this.ctx.createGain();
        this.output = this.ctx.createGain();
        this.wetDry = this.ctx.createGain();
        this.wetDry.gain.value = 0.5; // 50% wet by default
    }

    connect(destination) {
        this.output.connect(destination);
        return this;
    }

    disconnect() {
        this.output.disconnect();
    }

    setWetDry(value) {
        // value 0-1, 0 = dry, 1 = wet
        this.wetDry.gain.value = value;
    }
}

// Dub Delay (echoing delay with feedback)
// Essential for tech-dub sound
export class DubDelay extends Effect {
    constructor(audioContext, delayTime = 0.375, feedback = 0.5) {
        super(audioContext);

        this.delay = this.ctx.createDelay(5.0);
        this.feedback = this.ctx.createGain();
        this.filter = this.ctx.createBiquadFilter();

        // Setup
        this.delay.delayTime.value = delayTime;
        this.feedback.gain.value = feedback;
        this.filter.type = 'lowpass';
        this.filter.frequency.value = 2000;
        this.filter.Q.value = 1;

        // Routing
        this.input.connect(this.delay);
        this.delay.connect(this.filter);
        this.filter.connect(this.feedback);
        this.feedback.connect(this.delay); // Feedback loop
        this.delay.connect(this.wetDry);
        this.wetDry.connect(this.output);

        // Dry signal
        this.input.connect(this.output);
    }

    setDelayTime(time) {
        this.delay.delayTime.setValueAtTime(time, this.ctx.currentTime);
    }

    setFeedback(amount) {
        // Clamp to prevent runaway feedback
        this.feedback.gain.value = Math.min(0.95, Math.max(0, amount));
    }

    setFilterFreq(freq) {
        this.filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }

    // Sync delay time to tempo
    syncToTempo(bpm, division = '1/4') {
        const beatDuration = 60 / bpm;
        const divisions = {
            '1/16': beatDuration / 4,
            '1/8': beatDuration / 2,
            '1/8T': beatDuration / 3,
            '1/4': beatDuration,
            '1/4D': beatDuration * 1.5,
            '1/2': beatDuration * 2,
            '1/1': beatDuration * 4
        };

        this.setDelayTime(divisions[division] || divisions['1/4']);
    }
}

// Convolution Reverb
export class ConvolutionReverb extends Effect {
    constructor(audioContext, impulseURL = null) {
        super(audioContext);

        this.convolver = this.ctx.createConvolver();
        this.preDelay = this.ctx.createDelay(1.0);
        this.preDelay.delayTime.value = 0.03; // 30ms pre-delay

        // Routing
        this.input.connect(this.preDelay);
        this.preDelay.connect(this.convolver);
        this.convolver.connect(this.wetDry);
        this.wetDry.connect(this.output);
        this.input.connect(this.output); // Dry

        if (impulseURL) {
            this.loadImpulse(impulseURL);
        } else {
            this.createAlgorithmicReverb(2.5); // 2.5 second reverb
        }
    }

    async loadImpulse(url) {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.ctx.decodeAudioData(arrayBuffer);
            this.convolver.buffer = audioBuffer;
        } catch (error) {
            console.error('Error loading impulse:', error);
            this.createAlgorithmicReverb(2.5);
        }
    }

    // Create simple algorithmic reverb
    createAlgorithmicReverb(duration) {
        const sampleRate = this.ctx.sampleRate;
        const length = sampleRate * duration;
        const impulse = this.ctx.createBuffer(2, length, sampleRate);
        const impulseL = impulse.getChannelData(0);
        const impulseR = impulse.getChannelData(1);

        for (let i = 0; i < length; i++) {
            const decay = Math.exp(-3 * i / length); // Exponential decay
            impulseL[i] = (Math.random() * 2 - 1) * decay;
            impulseR[i] = (Math.random() * 2 - 1) * decay;
        }

        this.convolver.buffer = impulse;
    }

    setPreDelay(time) {
        this.preDelay.delayTime.setValueAtTime(time, this.ctx.currentTime);
    }
}

// Multi-mode Filter with LFO
export class FilterEffect extends Effect {
    constructor(audioContext, type = 'lowpass') {
        super(audioContext);

        this.filter = this.ctx.createBiquadFilter();
        this.filter.type = type;
        this.filter.frequency.value = 1000;
        this.filter.Q.value = 1;

        this.lfo = this.ctx.createOscillator();
        this.lfoGain = this.ctx.createGain();
        this.lfoGain.gain.value = 0; // Off by default

        // LFO modulates filter frequency
        this.lfo.connect(this.lfoGain);
        this.lfoGain.connect(this.filter.frequency);
        this.lfo.start();

        // Routing
        this.input.connect(this.filter);
        this.filter.connect(this.output);
    }

    setFrequency(freq) {
        this.filter.frequency.setValueAtTime(freq, this.ctx.currentTime);
    }

    setQ(q) {
        this.filter.Q.setValueAtTime(q, this.ctx.currentTime);
    }

    setType(type) {
        this.filter.type = type;
    }

    // Enable/configure LFO
    setLFO(rate, depth) {
        this.lfo.frequency.value = rate;
        this.lfoGain.gain.value = depth;
    }

    // Sweep filter (for dub effects)
    sweep(fromFreq, toFreq, duration) {
        const now = this.ctx.currentTime;
        this.filter.frequency.cancelScheduledValues(now);
        this.filter.frequency.setValueAtTime(fromFreq, now);
        this.filter.frequency.exponentialRampToValueAtTime(toFreq, now + duration);
    }
}

// Bit Crusher / Lo-Fi Effect
export class BitCrusher extends Effect {
    constructor(audioContext, bits = 8, sampleRate = 8000) {
        super(audioContext);

        this.bits = bits;
        this.normFreq = sampleRate / this.ctx.sampleRate;
        this.processor = this.createBitCrusherProcessor();

        this.input.connect(this.processor);
        this.processor.connect(this.output);
    }

    createBitCrusherProcessor() {
        // We'll use a simple gain node here, but in a real implementation
        // you'd use an AudioWorklet for actual bit crushing
        // For now, we'll use a waveshaper as approximation

        const shaper = this.ctx.createWaveShaper();
        const samples = 65536;
        const curve = new Float32Array(samples);
        const step = Math.pow(0.5, this.bits);

        for (let i = 0; i < samples; i++) {
            const x = (i / samples) * 2 - 1;
            curve[i] = Math.round(x / step) * step;
        }

        shaper.curve = curve;
        return shaper;
    }

    setBits(bits) {
        this.bits = bits;
        // Recreate processor with new bit depth
        this.processor.disconnect();
        this.processor = this.createBitCrusherProcessor();
        this.input.connect(this.processor);
        this.processor.connect(this.output);
    }
}

// Tape Saturation / Soft Clipping
export class TapeSaturation extends Effect {
    constructor(audioContext, drive = 1) {
        super(audioContext);

        this.preGain = this.ctx.createGain();
        this.waveshaper = this.ctx.createWaveShaper();
        this.postGain = this.ctx.createGain();

        this.setDrive(drive);

        this.input.connect(this.preGain);
        this.preGain.connect(this.waveshaper);
        this.waveshaper.connect(this.postGain);
        this.postGain.connect(this.output);
    }

    setDrive(amount) {
        // amount: 0-10
        this.preGain.gain.value = amount;
        this.postGain.gain.value = 1 / (amount + 1);

        // Soft clipping curve
        const samples = 44100;
        const curve = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const x = (i / samples) * 2 - 1;
            // Soft clipping using tanh
            curve[i] = Math.tanh(x * amount);
        }

        this.waveshaper.curve = curve;
    }
}

// Effects Chain Manager
export class EffectsChain {
    constructor(audioContext) {
        this.ctx = audioContext;
        this.input = this.ctx.createGain();
        this.output = this.ctx.createGain();
        this.effects = [];

        // Connect input directly to output initially
        this.input.connect(this.output);
    }

    addEffect(effect) {
        // Disconnect old chain
        if (this.effects.length > 0) {
            this.input.disconnect();
            this.effects[this.effects.length - 1].disconnect();
        } else {
            this.input.disconnect();
        }

        this.effects.push(effect);
        this.rebuildChain();
        return this;
    }

    removeEffect(index) {
        if (index >= 0 && index < this.effects.length) {
            this.effects.splice(index, 1);
            this.rebuildChain();
        }
        return this;
    }

    rebuildChain() {
        // Disconnect everything
        this.input.disconnect();
        this.effects.forEach(fx => fx.disconnect());

        if (this.effects.length === 0) {
            this.input.connect(this.output);
            return;
        }

        // Connect: input -> effect1 -> effect2 -> ... -> output
        this.input.connect(this.effects[0].input);

        for (let i = 0; i < this.effects.length - 1; i++) {
            this.effects[i].output.connect(this.effects[i + 1].input);
        }

        this.effects[this.effects.length - 1].output.connect(this.output);
    }

    connect(destination) {
        this.output.connect(destination);
        return this;
    }

    disconnect() {
        this.output.disconnect();
    }
}

export default {
    Effect,
    DubDelay,
    ConvolutionReverb,
    FilterEffect,
    BitCrusher,
    TapeSaturation,
    EffectsChain
};
