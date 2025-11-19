// audioEngine.js - Core audio engine
// Manages Web Audio context, voices, sequencing, and playback

import { SynthEngine } from './synthesis.js';
import { EffectsChain, DubDelay, ConvolutionReverb, FilterEffect, BitCrusher, TapeSaturation } from './effects.js';
import { euclideanRhythm, euclideanPresets, probabilisticPattern, patternToString } from './patterns.js';
import { getScaleFrequencies, scalePresets, midiToFreq } from './scales.js';

export class Voice {
    constructor(audioContext, id) {
        this.ctx = audioContext;
        this.id = id;
        this.isPlaying = false;
        this.isMuted = false;

        // Audio nodes
        this.synthEngine = new SynthEngine(this.ctx);
        this.voice = null;
        this.effectsChain = new EffectsChain(this.ctx);
        this.volumeNode = this.ctx.createGain();
        this.volumeNode.gain.value = 0.7;

        // Musical parameters
        this.scale = [];
        this.scaleName = 'C Dorian'; // Store scale name for presets
        this.pattern = [];
        this.currentStep = 0;
        this.synthType = 'piano';
        this.effectType = 'none';

        // Pattern parameters
        this.patternType = 'euclidean';
        this.euclideanHits = 8;
        this.euclideanSteps = 16;

        // Effect instances
        this.currentEffect = null;

        // Connect audio graph
        this.effectsChain.connect(this.volumeNode);
    }

    setSynthType(type) {
        this.synthType = type;
        this.voice = this.synthEngine.createVoice(type);
        this.voice.connect(this.effectsChain.input);
    }

    setScale(scaleName) {
        const scaleConfig = scalePresets[scaleName];
        if (scaleConfig) {
            this.scaleName = scaleName;
            const octaves = scaleConfig.type === 'bass_notes' ? 3 : 2; // More octaves for bass
            const startOctave = scaleConfig.octave || 4;
            this.scale = getScaleFrequencies(scaleConfig.root, scaleConfig.type, octaves, startOctave);
        }
    }

    setPattern(type, param1, param2) {
        this.patternType = type;

        if (type === 'euclidean') {
            this.euclideanHits = param1 || 8;
            this.euclideanSteps = param2 || 16;
            this.pattern = euclideanRhythm(this.euclideanHits, this.euclideanSteps);
        } else if (type === 'probabilistic') {
            const probability = param1 || 0.3;
            const steps = param2 || 16;
            this.pattern = probabilisticPattern(steps, probability);
        } else if (type === 'constant') {
            this.pattern = Array(16).fill(1);
        } else {
            // Default
            this.pattern = euclideanRhythm(8, 16);
        }
    }

    setEffect(type, intensity = 0.5) {
        // Remove old effect
        if (this.currentEffect) {
            this.effectsChain.removeEffect(0);
            this.currentEffect = null;
        }

        this.effectType = type;

        // Add new effect
        switch(type) {
            case 'delay':
                this.currentEffect = new DubDelay(this.ctx, 0.375, 0.4);
                this.currentEffect.setWetDry(intensity);
                this.effectsChain.addEffect(this.currentEffect);
                break;

            case 'reverb':
                this.currentEffect = new ConvolutionReverb(this.ctx);
                this.currentEffect.setWetDry(intensity);
                this.effectsChain.addEffect(this.currentEffect);
                break;

            case 'filter':
                this.currentEffect = new FilterEffect(this.ctx, 'lowpass');
                this.currentEffect.setFrequency(1000 + intensity * 4000);
                this.effectsChain.addEffect(this.currentEffect);
                break;

            case 'bitcrush':
                this.currentEffect = new BitCrusher(this.ctx, 8 + Math.floor(intensity * 8));
                this.effectsChain.addEffect(this.currentEffect);
                break;

            case 'distortion':
                this.currentEffect = new TapeSaturation(this.ctx, intensity * 5);
                this.effectsChain.addEffect(this.currentEffect);
                break;

            case 'none':
            default:
                // No effect
                break;
        }
    }

    setVolume(value) {
        this.volumeNode.gain.setValueAtTime(value, this.ctx.currentTime);
    }

    mute(shouldMute) {
        this.isMuted = shouldMute;
        this.volumeNode.gain.setValueAtTime(shouldMute ? 0 : 0.7, this.ctx.currentTime);
    }

    step() {
        if (this.isMuted || !this.pattern.length || !this.scale.length || !this.voice) {
            this.currentStep = (this.currentStep + 1) % (this.pattern.length || 16);
            return false;
        }

        const shouldTrigger = this.pattern[this.currentStep];

        if (shouldTrigger) {
            // Select note from scale
            const noteIndex = this.currentStep % this.scale.length;
            const frequency = this.scale[noteIndex];

            // Trigger synth
            if (this.synthType === 'drum') {
                // Drums have different triggers
                const drumType = this.currentStep % 3;
                if (drumType === 0) this.voice.triggerKick(0.9);
                else if (drumType === 1) this.voice.triggerSnare(0.7);
                else this.voice.triggerHihat(0.4);
            } else {
                const velocity = 0.6 + Math.random() * 0.3; // Slight variation
                const duration = this.synthType === 'bass' ? 0.4 : 0.3;
                this.voice.trigger(frequency, duration, velocity);
            }
        }

        this.currentStep = (this.currentStep + 1) % this.pattern.length;
        return shouldTrigger;
    }

    getPatternString() {
        return patternToString(this.pattern);
    }

    connect(destination) {
        this.volumeNode.connect(destination);
        return this;
    }

    disconnect() {
        this.volumeNode.disconnect();
    }
}

export class AudioEngine {
    constructor() {
        this.ctx = null;
        this.masterGain = null;
        this.analyser = null;
        this.voices = [];
        this.isPlaying = false;
        this.bpm = 85;
        this.currentStep = 0;
        this.schedulerTimer = null;
        this.nextNoteTime = 0;
        this.lookahead = 25.0; // ms
        this.scheduleAheadTime = 0.1; // s
        this.stepDuration = 0.125; // 16th notes
    }

    async init() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Master gain
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.value = 0.75;

        // Analyser for visualizer
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 2048;

        // Connect chain
        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);

        // Resume context (required in some browsers)
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        console.log('Audio Engine initialized');
    }

    addVoice() {
        const voice = new Voice(this.ctx, this.voices.length);
        voice.connect(this.masterGain);

        // Set defaults
        voice.setSynthType('piano');
        voice.setScale('C Dorian');
        voice.setPattern('euclidean', 8, 16);

        this.voices.push(voice);
        return voice;
    }

    removeVoice(id) {
        const voice = this.voices[id];
        if (voice) {
            voice.disconnect();
            this.voices.splice(id, 1);
        }
    }

    setBPM(bpm) {
        this.bpm = Math.max(40, Math.min(200, bpm));
        this.stepDuration = (60 / this.bpm) / 4; // 16th notes
    }

    setMasterVolume(value) {
        this.masterGain.gain.setValueAtTime(value, this.ctx.currentTime);
    }

    play() {
        if (this.isPlaying) return;

        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }

        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.ctx.currentTime;

        this.scheduler();
    }

    stop() {
        this.isPlaying = false;
        if (this.schedulerTimer) {
            clearTimeout(this.schedulerTimer);
        }
        this.currentStep = 0;
    }

    scheduler() {
        while (this.nextNoteTime < this.ctx.currentTime + this.scheduleAheadTime) {
            this.scheduleNote(this.currentStep, this.nextNoteTime);
            this.nextNote();
        }

        if (this.isPlaying) {
            this.schedulerTimer = setTimeout(() => this.scheduler(), this.lookahead);
        }
    }

    scheduleNote(step, time) {
        // This would be where we schedule notes precisely
        // For simplicity, we'll trigger immediately
        this.voices.forEach(voice => {
            voice.step();
        });
    }

    nextNote() {
        this.nextNoteTime += this.stepDuration;
        this.currentStep = (this.currentStep + 1) % 16;
    }

    // Get analyser data for visualizer
    getAnalyserData() {
        if (!this.analyser) {
            return new Uint8Array(128); // Return empty array if not initialized
        }
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteTimeDomainData(dataArray);
        return dataArray;
    }

    getFrequencyData() {
        if (!this.analyser) {
            return new Uint8Array(128); // Return empty array if not initialized
        }
        const bufferLength = this.analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        this.analyser.getByteFrequencyData(dataArray);
        return dataArray;
    }

    // Export state for presets
    exportState() {
        return {
            bpm: this.bpm,
            voices: this.voices.map(v => ({
                synthType: v.synthType,
                effectType: v.effectType,
                patternType: v.patternType,
                euclideanHits: v.euclideanHits,
                euclideanSteps: v.euclideanSteps,
                volume: v.volumeNode.gain.value,
                scale: v.scaleName || 'C Dorian'
            }))
        };
    }

    // Import state from preset
    importState(state) {
        this.setBPM(state.bpm);

        // Clear existing voices
        while (this.voices.length > 0) {
            this.removeVoice(0);
        }

        // Recreate voices
        state.voices.forEach(voiceData => {
            const voice = this.addVoice();
            voice.setSynthType(voiceData.synthType);
            voice.setScale(voiceData.scale || 'C Dorian');
            voice.setEffect(voiceData.effectType, 0.5);
            voice.setPattern(voiceData.patternType, voiceData.euclideanHits, voiceData.euclideanSteps);
            voice.setVolume(voiceData.volume);
        });
    }
}

export default AudioEngine;
