# MUZAKMAKR Architecture

## Overview

MUZAKMAKR is a browser-based generative music webapp built with vanilla JavaScript and the Web Audio API. It generates music in the styles of minimal composers (Philip Glass, Michael Nyman, Wim Mertens), tech-dub producers (Andy Stott, Rhythm & Sound), and ambient/lo-fi aesthetics.

## Core Concepts

### 1. Music Theory Foundation

#### Harmonic System (scales.js)
- **Modal scales**: Dorian, Phrygian, Aeolian, Mixolydian
- **Pentatonic scales**: Minor and major variants
- **Chord voicings**: Power chords, 7ths, 9ths, suspended
- **Markov melody generator**: Probabilistic note selection favoring stepwise motion

**Key Design Decision**: Using modal harmony instead of traditional major/minor creates the darker, more hypnotic sound characteristic of minimal music.

#### Pattern Generation (patterns.js)
- **Euclidean rhythms**: Bjorklund's algorithm E(k,n) distributes k hits evenly across n steps
- **Probabilistic patterns**: Each step has X% chance to trigger
- **Phasing**: Steve Reich-style gradually shifting patterns
- **Cellular automata**: Rule-based evolving patterns
- **Additive/subtractive processes**: Philip Glass technique

**Key Design Decision**: Euclidean rhythms create mathematically perfect distributions that sound organic and are foundational to minimal and tech-dub music.

### 2. Audio Engine

#### Synthesis (synthesis.js)

**MinimalPianoVoice**
- FM synthesis (carrier + modulator)
- Sharp attack, medium decay for percussive sound
- Bright, bell-like timbre
- Usage: Arpeggios, repeating patterns

**SubBassVoice**
- Pure sine wave
- Low-pass filter
- Slow attack, sustained envelope
- Usage: Dub basslines, sub-bass foundation

**PadVoice**
- Multiple detuned sawtooth oscillators
- Slow attack/release
- LFO-modulated filter
- Usage: Ambient textures, sustained chords

**LoFiDrumVoice**
- Kick: Sine with pitch envelope + distortion
- Snare: Noise + tone, bandpass filtered
- Hi-hat: High-pass filtered noise
- Usage: Lo-fi percussion, Gil Scott-Heron style

**Key Design Decision**: Each synth is optimized for a specific role rather than being general-purpose. This ensures authentic sounds for each style.

#### Effects Chain (effects.js)

Signal flow order (matters for sound quality):
```
Input → Distortion → Filter → Modulation → Delay → Reverb → Output
```

**DubDelay**
- Tempo-synced delay times
- Feedback loop with low-pass filter
- Essential for tech-dub spaciousness
- Wet/dry mix control

**ConvolutionReverb**
- Algorithmic impulse response generation
- Pre-delay parameter
- Long decay times (2-8 seconds)
- Usage: Ambient depth, space simulation

**FilterEffect**
- Multi-mode (lowpass, highpass, bandpass)
- LFO modulation
- Sweep automation
- Usage: Dub filter sweeps, rhythmic filtering

**BitCrusher**
- Sample rate reduction simulation
- Bit depth reduction
- Lo-fi degradation
- Usage: Gil Scott-Heron aesthetic

**TapeSaturation**
- Soft clipping using tanh curve
- Pre/post gain compensation
- Warm analog-style distortion
- Usage: Subtle warmth to extreme distortion

**EffectsChain**
- Modular effect routing
- Series connection of effects
- Dry/wet mixing
- Add/remove effects dynamically

**Key Design Decision**: Effects are modular and can be chained. The order is critical - distortion before filtering creates different timbres than filtering before distortion.

### 3. Audio Engine Core (audioEngine.js)

**Voice Class**
- Combines synthesis + effects + pattern
- Musical parameters (scale, pattern type, volume)
- Step sequencing
- Mute/solo functionality

**AudioEngine Class**
- Master audio context management
- Voice management (add/remove)
- Scheduler for precise timing
- BPM control
- Analyser for visualization
- State export/import for presets

**Timing Architecture**:
- Lookahead scheduler (inspired by Chris Wilson's Web Audio scheduling)
- 25ms lookahead, 100ms schedule-ahead time
- 16th note resolution
- Prevents timing drift

**Key Design Decision**: Using a scheduler instead of setTimeout ensures sample-accurate timing, critical for rhythm-based minimal music.

### 4. User Interface

#### Design System

**Color Palette**:
- Deep blue background (#001D4A): Calm, focused
- Slate panels (#27476E): Depth and organization
- Teal accents (#006992): Secondary elements
- Orange highlights (#ECA400): Active states, draws attention
- Light text (#EAF8BF): High contrast, readability

**Typography**:
- JetBrains Mono: Technical, modern monospaced font
- Clear hierarchy (12px body, 14px labels, 18px headers)
- Uppercase labels for parameters

#### UI Controller (ui.js)

**Responsibilities**:
- DOM manipulation and event handling
- Voice UI creation and updates
- Preset loading/saving
- Transport controls
- Real-time visualization

**UI Structure**:
```
Header
  └── Preset selector, Save, Random
Main (Voices Container)
  └── Voice panels (dynamically created)
      ├── Instrument selector
      ├── Scale selector
      ├── Pattern selector
      ├── Effect selector
      ├── Pattern visualization
      └── Sliders (volume, density)
Footer
  ├── Transport (Play/Stop, BPM, Master Volume)
  └── Visualizer (frequency analyzer)
```

**Key Design Decision**: Minimal interface with essential controls only. Advanced features are accessible but not overwhelming.

### 5. Preset System (presets.js)

**Built-in Presets**:
1. **Glass Arpeggios**: Fast, bright, repetitive (132 BPM)
2. **Dub Pressure**: Deep, heavy bass with dub effects (78 BPM)
3. **Ambient Decay**: Slow, textured, lo-fi (65 BPM)
4. **Phasing Minimalism**: Reich-style phasing (120 BPM)
5. **Nyman Cycles**: Romantic minimal (140 BPM)
6. **Stott Textures**: Dark tech-dub (72 BPM)
7. **Sparse Minimal**: Lots of space (95 BPM)
8. **Dense Polyrhythm**: Complex rhythms (110 BPM)

**Preset Structure**:
```javascript
{
  name: string,
  description: string,
  bpm: number,
  voices: [
    {
      synthType: 'piano' | 'bass' | 'pad' | 'drum',
      effectType: 'none' | 'reverb' | 'delay' | 'filter' | 'bitcrush' | 'distortion',
      patternType: 'euclidean' | 'probabilistic',
      euclideanHits: number,
      euclideanSteps: number,
      volume: 0-1,
      scale: string
    }
  ]
}
```

**Storage**:
- Built-in presets in code
- Custom presets in localStorage
- JSON serialization
- Export/import capability

**Random Preset Generator**:
- Random synthesis type
- Random effect
- Random euclidean pattern (3-13 hits, 12-16 steps)
- Random scale
- Random BPM (60-160)
- 2-3 voices

## Data Flow

### Initialization
```
User clicks Play
  → AudioContext created
  → AudioEngine initialized
  → Default voices created
  → UI populated
  → Scheduler starts
```

### Playback Loop
```
Scheduler (every 25ms)
  → Check if notes need scheduling
  → For each voice:
      → Check pattern at current step
      → If triggered:
          → Select note from scale
          → Trigger synth voice
          → Apply effects
      → Advance step
  → Schedule next check
```

### User Interaction
```
User changes parameter
  → UI event handler
  → Update voice or engine state
  → If playing, change takes effect immediately
  → Update visual feedback
```

### Preset Loading
```
User selects preset
  → Clear existing voices
  → Import preset state
  → Recreate voices with preset parameters
  → Update all UI elements
  → Pattern displays update
```

## Performance Considerations

### Audio Performance
- **Voice pooling**: Reuse oscillators when possible
- **Effect bypass**: Disconnect unused effects
- **Analyser throttling**: 60 FPS max for visualization
- **Context suspension**: Pause when not playing

### Memory Management
- **Node cleanup**: Disconnect and null unused audio nodes
- **Event listener cleanup**: Remove listeners when voices are deleted
- **LocalStorage limits**: Limit preset storage to prevent quota errors

### Browser Compatibility
- **AudioContext**: Vendor prefixing for older browsers
- **User gesture**: Required for audio start in Safari/iOS
- **Performance**: Target 60 FPS on mid-range devices

## Musical Algorithms

### Euclidean Rhythm Distribution

The Bjorklund algorithm distributes k hits evenly across n steps:

```
E(5,13) = [1,0,0,1,0,1,0,0,1,0,1,0,0]
E(7,16) = [1,0,0,1,0,1,0,1,0,0,1,0,1,0,1,0]
```

This creates polyrhythmic patterns that sound complex but are mathematically perfect.

### Markov Melody Generation

Transition probabilities favor stepwise motion:
- Stay on same note: 10%
- Move 1 step: 40%
- Move 2 steps: 25%
- Move 3 steps: 15%
- Large leap: 10%

This creates melodies that are primarily stepwise (Glass/Nyman style) with occasional leaps.

### Phasing

Two identical patterns at slightly different tempos (100% vs 99.5%) gradually shift out of phase, creating a constantly evolving relationship.

## Effect Triggering Strategy

Unlike traditional DAWs where effects run continuously, MUZAKMAKR can trigger effects dynamically:

1. **Pattern-based**: Activate every N bars
2. **Probability**: X% chance per beat
3. **Threshold**: When parameter crosses value
4. **Manual**: User interaction
5. **Velocity**: Louder hits = more effect

This creates evolving soundscapes rather than static processing.

## Future Architecture Considerations

### Scalability
- **Web Workers**: Move pattern generation to worker thread
- **Audio Worklets**: Custom DSP for bit crushing, granular synthesis
- **Shared Array Buffer**: Zero-copy audio data transfer

### Features
- **MIDI I/O**: Use Web MIDI API for external control
- **Audio Export**: OfflineAudioContext for rendering
- **Collaboration**: WebRTC for multi-user sessions
- **Cloud Storage**: Firebase for preset sharing

### Performance
- **Lazy loading**: Load presets on demand
- **Code splitting**: Separate modules for advanced features
- **Service Worker**: Offline functionality, faster load times

## Design Philosophy

**Constraints breed creativity**: Limited options force musical exploration.

**Mathematics meets music**: Euclidean rhythms, phasing, and modal scales create complex results from simple rules.

**Real-time manipulation**: All parameters are live, encouraging experimentation.

**Minimal interface**: Focus on sound, not visual complexity.

**Educational**: Code is readable and well-documented for learning.

---

This architecture balances simplicity (vanilla JS, no build step) with power (sophisticated audio synthesis and pattern generation) to create an instrument that's both accessible and deep.
