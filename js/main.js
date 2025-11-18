// main.js - Application entry point

import AudioEngine from './audioEngine.js';
import UIController from './ui.js';

class MuzakMakr {
    constructor() {
        this.engine = null;
        this.ui = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            console.log('Initializing MUZAKMAKR...');

            // Create audio engine
            this.engine = new AudioEngine();
            await this.engine.init();

            // Create UI controller
            this.ui = new UIController(this.engine);

            // Initialize default voices
            this.ui.initDefaultVoices();

            this.initialized = true;
            console.log('MUZAKMAKR ready!');

            // Show welcome message
            this.showWelcome();

        } catch (error) {
            console.error('Failed to initialize MUZAKMAKR:', error);
            alert('Failed to initialize audio. Please refresh the page.');
        }
    }

    showWelcome() {
        console.log(`
╔══════════════════════════════════════════════════════════╗
║                      MUZAKMAKR                           ║
║          Generative Minimal Music Webapp                 ║
║                                                          ║
║  Styles: Philip Glass • Michael Nyman • Wim Mertens     ║
║          Tech-dub • Ambient • Lo-Fi                      ║
║                                                          ║
║  Features:                                               ║
║  • Euclidean rhythm generation                           ║
║  • Modal harmony systems                                 ║
║  • Dub effects (delay, reverb, filters)                  ║
║  • Lo-fi distortion & bit crushing                       ║
║  • Preset system with save/load                          ║
║  • Real-time audio visualization                         ║
║                                                          ║
║  Try the presets or create your own!                     ║
╚══════════════════════════════════════════════════════════╝
        `);
    }
}

// Initialize when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', async () => {
    app = new MuzakMakr();

    // Add click-to-start for browsers that require user interaction
    const startButton = document.getElementById('play-btn');

    startButton.addEventListener('click', async () => {
        if (!app.initialized) {
            await app.init();
        }
    }, { once: true });

    // Also initialize on any other interaction
    document.addEventListener('click', async () => {
        if (!app.initialized) {
            await app.init();
        }
    }, { once: true });
});

// Export for debugging
window.MUZAKMAKR = {
    getEngine: () => app?.engine,
    getUI: () => app?.ui,
    getApp: () => app
};
