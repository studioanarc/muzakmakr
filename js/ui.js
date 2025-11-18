// ui.js - User interface controller

import { euclideanPresets } from './patterns.js';
import { scalePresets } from './scales.js';
import { getAllPresets, savePreset, generateRandomPreset } from './presets.js';

export class UIController {
    constructor(audioEngine) {
        this.engine = audioEngine;
        this.voiceElements = new Map();

        this.initElements();
        this.initEventListeners();
        this.initVisualizer();
    }

    initElements() {
        this.playBtn = document.getElementById('play-btn');
        this.tempoInput = document.getElementById('tempo');
        this.masterVolInput = document.getElementById('master-vol');
        this.presetSelect = document.getElementById('preset-select');
        this.saveBtn = document.getElementById('save-btn');
        this.randomBtn = document.getElementById('random-btn');
        this.voicesContainer = document.getElementById('voices-container');
        this.visualizerCanvas = document.getElementById('visualizer');
        this.visualizerCtx = this.visualizerCanvas.getContext('2d');
    }

    initEventListeners() {
        // Play/Stop
        this.playBtn.addEventListener('click', () => this.togglePlay());

        // Tempo
        this.tempoInput.addEventListener('input', (e) => {
            this.engine.setBPM(parseInt(e.target.value));
        });

        // Master volume
        this.masterVolInput.addEventListener('input', (e) => {
            this.engine.setMasterVolume(e.target.value / 100);
        });

        // Presets
        this.presetSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.loadPreset(e.target.value);
            }
        });

        // Save
        this.saveBtn.addEventListener('click', () => this.saveCurrentPreset());

        // Random
        this.randomBtn.addEventListener('click', () => this.loadRandomPreset());

        // Populate preset dropdown
        this.populatePresets();
    }

    populatePresets() {
        const presets = getAllPresets();
        this.presetSelect.innerHTML = '<option value="">Select Preset...</option>';

        Object.keys(presets).forEach(name => {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            this.presetSelect.appendChild(option);
        });
    }

    loadPreset(name) {
        const presets = getAllPresets();
        const preset = presets[name];

        if (!preset) return;

        // Clear existing voices
        this.voicesContainer.innerHTML = '';
        this.voiceElements.clear();

        // Set BPM
        this.tempoInput.value = preset.bpm;
        this.engine.setBPM(preset.bpm);

        // Remove all voices
        while (this.engine.voices.length > 0) {
            this.engine.removeVoice(0);
        }

        // Create voices from preset
        preset.voices.forEach((voiceData, i) => {
            const voice = this.engine.addVoice();
            voice.setSynthType(voiceData.synthType);
            voice.setScale(voiceData.scale || 'C Dorian');
            voice.setPattern(voiceData.patternType, voiceData.euclideanHits, voiceData.euclideanSteps);
            voice.setEffect(voiceData.effectType, 0.5);
            voice.setVolume(voiceData.volume);

            this.createVoiceUI(voice, i);
        });
    }

    loadRandomPreset() {
        const preset = generateRandomPreset();
        const name = 'Random';

        // Clear existing voices
        this.voicesContainer.innerHTML = '';
        this.voiceElements.clear();

        // Set BPM
        this.tempoInput.value = preset.bpm;
        this.engine.setBPM(preset.bpm);

        // Remove all voices
        while (this.engine.voices.length > 0) {
            this.engine.removeVoice(0);
        }

        // Create voices
        preset.voices.forEach((voiceData, i) => {
            const voice = this.engine.addVoice();
            voice.setSynthType(voiceData.synthType);
            voice.setScale(voiceData.scale);
            voice.setPattern(voiceData.patternType, voiceData.euclideanHits, voiceData.euclideanSteps);
            voice.setEffect(voiceData.effectType, 0.5);
            voice.setVolume(voiceData.volume);

            this.createVoiceUI(voice, i);
        });
    }

    saveCurrentPreset() {
        const name = prompt('Preset name:');
        if (!name) return;

        const state = this.engine.exportState();
        savePreset(name, state);
        this.populatePresets();
        this.presetSelect.value = name;

        alert(`Preset "${name}" saved!`);
    }

    createVoiceUI(voice, index) {
        const voiceDiv = document.createElement('div');
        voiceDiv.className = 'voice';
        voiceDiv.dataset.voiceId = voice.id;

        voiceDiv.innerHTML = `
            <div class="voice-header">
                <div class="voice-title">VOICE ${index + 1}: ${voice.synthType.toUpperCase()}</div>
                <div class="voice-header-controls">
                    <button class="btn-small mute-btn">Mute</button>
                </div>
            </div>

            <div class="voice-controls">
                <div class="control-group">
                    <label>Instrument</label>
                    <select class="synth-select">
                        <option value="piano" ${voice.synthType === 'piano' ? 'selected' : ''}>Minimal Piano</option>
                        <option value="bass" ${voice.synthType === 'bass' ? 'selected' : ''}>Sub Bass</option>
                        <option value="pad" ${voice.synthType === 'pad' ? 'selected' : ''}>Ambient Pad</option>
                        <option value="drum" ${voice.synthType === 'drum' ? 'selected' : ''}>Lo-Fi Drums</option>
                    </select>
                </div>

                <div class="control-group">
                    <label>Scale</label>
                    <select class="scale-select">
                        ${this.getScaleOptions(voice.scaleName)}
                    </select>
                </div>

                <div class="control-group">
                    <label>Pattern</label>
                    <select class="pattern-select">
                        ${this.getPatternOptions()}
                    </select>
                </div>

                <div class="control-group">
                    <label>Effect</label>
                    <select class="effect-select">
                        <option value="none">None</option>
                        <option value="reverb" ${voice.effectType === 'reverb' ? 'selected' : ''}>Reverb</option>
                        <option value="delay" ${voice.effectType === 'delay' ? 'selected' : ''}>Dub Delay</option>
                        <option value="filter" ${voice.effectType === 'filter' ? 'selected' : ''}>Filter</option>
                        <option value="bitcrush" ${voice.effectType === 'bitcrush' ? 'selected' : ''}>Bit Crusher</option>
                        <option value="distortion" ${voice.effectType === 'distortion' ? 'selected' : ''}>Distortion</option>
                    </select>
                </div>
            </div>

            <div class="pattern-display" data-pattern="">
                ${voice.getPatternString()}
            </div>

            <div class="voice-controls">
                <div class="slider-group">
                    <label>
                        Volume
                        <span class="slider-value">${Math.round(voice.volumeNode.gain.value * 100)}</span>
                    </label>
                    <input type="range" class="volume-slider" min="0" max="100" value="${voice.volumeNode.gain.value * 100}">
                </div>

                <div class="slider-group">
                    <label>
                        Density
                        <span class="slider-value">${voice.euclideanHits}/${voice.euclideanSteps}</span>
                    </label>
                    <input type="range" class="density-slider" min="1" max="16" value="${voice.euclideanHits}">
                </div>
            </div>
        `;

        this.voicesContainer.appendChild(voiceDiv);
        this.voiceElements.set(voice.id, voiceDiv);

        // Attach event listeners
        this.attachVoiceEventListeners(voiceDiv, voice);
    }

    getScaleOptions(selectedScale = 'C Dorian') {
        return Object.keys(scalePresets).map(name =>
            `<option value="${name}" ${name === selectedScale ? 'selected' : ''}>${name}</option>`
        ).join('');
    }

    getPatternOptions() {
        return Object.keys(euclideanPresets).map(name =>
            `<option value="${name}">${name}</option>`
        ).join('');
    }

    attachVoiceEventListeners(voiceDiv, voice) {
        // Synth type
        const synthSelect = voiceDiv.querySelector('.synth-select');
        synthSelect.addEventListener('change', (e) => {
            voice.setSynthType(e.target.value);
            voiceDiv.querySelector('.voice-title').textContent =
                `VOICE ${voice.id + 1}: ${e.target.value.toUpperCase()}`;
        });

        // Scale
        const scaleSelect = voiceDiv.querySelector('.scale-select');
        scaleSelect.addEventListener('change', (e) => {
            voice.setScale(e.target.value);
        });

        // Pattern preset
        const patternSelect = voiceDiv.querySelector('.pattern-select');
        patternSelect.addEventListener('change', (e) => {
            const preset = euclideanPresets[e.target.value];
            if (preset) {
                voice.setPattern('euclidean', preset.hits, preset.steps);
                this.updatePatternDisplay(voiceDiv, voice);
            }
        });

        // Effect
        const effectSelect = voiceDiv.querySelector('.effect-select');
        effectSelect.addEventListener('change', (e) => {
            voice.setEffect(e.target.value, 0.5);
        });

        // Volume
        const volumeSlider = voiceDiv.querySelector('.volume-slider');
        const volumeValue = voiceDiv.querySelector('.slider-group:nth-of-type(1) .slider-value');
        volumeSlider.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            voice.setVolume(value);
            volumeValue.textContent = e.target.value;
        });

        // Density
        const densitySlider = voiceDiv.querySelector('.density-slider');
        const densityValue = voiceDiv.querySelector('.slider-group:nth-of-type(2) .slider-value');
        densitySlider.addEventListener('input', (e) => {
            const hits = parseInt(e.target.value);
            voice.setPattern('euclidean', hits, voice.euclideanSteps);
            densityValue.textContent = `${hits}/${voice.euclideanSteps}`;
            this.updatePatternDisplay(voiceDiv, voice);
        });

        // Mute
        const muteBtn = voiceDiv.querySelector('.mute-btn');
        muteBtn.addEventListener('click', () => {
            voice.mute(!voice.isMuted);
            muteBtn.classList.toggle('active');
            muteBtn.textContent = voice.isMuted ? 'Unmute' : 'Mute';
        });
    }

    updatePatternDisplay(voiceDiv, voice) {
        const patternDisplay = voiceDiv.querySelector('.pattern-display');
        patternDisplay.textContent = voice.getPatternString();
    }

    togglePlay() {
        if (this.engine.isPlaying) {
            this.engine.stop();
            this.playBtn.textContent = '▶ PLAY';
            this.playBtn.classList.remove('playing');
            this.voiceElements.forEach(el => el.classList.remove('playing'));
        } else {
            this.engine.play();
            this.playBtn.textContent = '■ STOP';
            this.playBtn.classList.add('playing');
            this.voiceElements.forEach(el => el.classList.add('playing'));
        }
    }

    initVisualizer() {
        this.visualizerCanvas.width = this.visualizerCanvas.offsetWidth;
        this.visualizerCanvas.height = this.visualizerCanvas.offsetHeight;

        this.animateVisualizer();
    }

    animateVisualizer() {
        requestAnimationFrame(() => this.animateVisualizer());

        const dataArray = this.engine.getFrequencyData();
        const bufferLength = dataArray.length;

        const canvas = this.visualizerCanvas;
        const ctx = this.visualizerCtx;
        const width = canvas.width;
        const height = canvas.height;

        // Clear
        ctx.fillStyle = '#001D4A';
        ctx.fillRect(0, 0, width, height);

        // Draw frequency bars
        const barWidth = width / bufferLength * 2.5;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = (dataArray[i] / 255) * height;

            // Gradient from teal to orange based on height
            const hue = 180 + (dataArray[i] / 255) * 60; // Teal to yellow
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;

            ctx.fillRect(x, height - barHeight, barWidth, barHeight);
            x += barWidth + 1;
        }
    }

    // Add initial voices for demo
    initDefaultVoices() {
        // Create 3 default voices
        for (let i = 0; i < 3; i++) {
            const voice = this.engine.addVoice();
            this.createVoiceUI(voice, i);
        }

        // Configure defaults
        const voice1 = this.engine.voices[0];
        voice1.setSynthType('piano');
        voice1.setScale('C Dorian');
        voice1.setPattern('euclidean', 8, 16);
        voice1.setEffect('reverb', 0.5);

        const voice2 = this.engine.voices[1];
        voice2.setSynthType('bass');
        voice2.setScale('C Bass');
        voice2.setPattern('euclidean', 5, 16);
        voice2.setEffect('none', 0);

        const voice3 = this.engine.voices[2];
        voice3.setSynthType('drum');
        voice3.setScale('C Dorian');
        voice3.setPattern('euclidean', 7, 16);
        voice3.setEffect('delay', 0.3);
    }
}

export default UIController;
