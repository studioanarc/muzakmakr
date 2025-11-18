# MUZAKMAKR

A generative music webapp producing sounds in the style of:
- **American Minimal Music**: Philip Glass, Michael Nyman, Wim Mertens
- **Tech-dub**: Andy Stott, Adam Johnson, Rhythm & Sound
- **Ambient**: Lo-fi and distorted textures inspired by Gil Scott-Heron

## Features

### 🎹 Synthesis Engines
- **Minimal Piano**: Bell-like FM synthesis for Glass-style arpeggios
- **Sub Bass**: Deep sine waves for dub foundations
- **Ambient Pad**: Detuned oscillators with slow filter sweeps
- **Lo-Fi Drums**: Distorted, bit-crushed percussion

### 🎵 Music Theory
- **Modal Scales**: Dorian, Phrygian, Aeolian, Mixolydian
- **Pentatonic**: Minor and major for ambient textures
- **Harmonic System**: Scale-based generative melodies
- **Markov Chains**: Probabilistic note selection

### 🥁 Pattern Generation
- **Euclidean Rhythms**: E(k,n) algorithm for even distribution
- **Probabilistic**: Random triggering with adjustable probability
- **Phasing**: Steve Reich-style gradually shifting patterns
- **Polyrhythms**: Multiple cycle lengths creating complex grooves

### 🎚️ Effects Chain
- **Dub Delay**: Tempo-synced echoing delay with feedback
- **Convolution Reverb**: Algorithmic and impulse-based reverb
- **Filters**: Multi-mode with LFO modulation
- **Bit Crusher**: Lo-fi sample rate reduction
- **Tape Saturation**: Soft clipping and distortion

### 💾 Preset System
- **8 Built-in Presets**:
  - Glass Arpeggios
  - Dub Pressure
  - Ambient Decay
  - Phasing Minimalism
  - Nyman Cycles
  - Stott Textures
  - Sparse Minimal
  - Dense Polyrhythm
- **Save/Load Custom Presets**
- **Random Preset Generator**
- **LocalStorage Persistence**

## Design

### Color Palette
- `#001D4A` - Deep Blue (background)
- `#27476E` - Slate (panels)
- `#006992` - Teal (secondary elements)
- `#ECA400` - Orange (accents, active states)
- `#EAF8BF` - Light Yellow-Green (text, borders)

### Typography
- **JetBrains Mono** - Modern monospaced font
- Clear hierarchy and readability
- Minimal, technical aesthetic

## Technical Architecture

### Audio Engine
- **Web Audio API**: Modern browser-based synthesis
- **Scheduler**: Precise timing for rhythm patterns
- **Modular Design**: Voices, effects, and patterns are independent
- **Real-time Visualization**: Frequency analyzer

### File Structure
```
muzakmakr/
├── index.html           # Main HTML
├── style.css            # Styling
├── js/
│   ├── main.js          # Application entry point
│   ├── audioEngine.js   # Core audio system
│   ├── synthesis.js     # Synth voices
│   ├── effects.js       # Audio effects
│   ├── patterns.js      # Rhythm generation
│   ├── scales.js        # Music theory
│   ├── presets.js       # Preset definitions
│   └── ui.js            # UI controller
└── README.md
```

## Usage

1. **Select a Preset**: Choose from the dropdown or click "Random"
2. **Adjust Parameters**:
   - Instrument type (Piano, Bass, Pad, Drums)
   - Scale/harmony
   - Pattern density
   - Effects
   - Volume
3. **Press Play**: Start the generative sequence
4. **Experiment**: Change parameters in real-time
5. **Save**: Store your creations as custom presets

## Music Theory Deep Dive

### Minimal Music (Glass/Nyman/Mertens)
- **Repetitive arpeggiated patterns**: Constant 16th note motion
- **Modal harmony**: Dorian, Phrygian for darker tones
- **Additive processes**: Gradually adding complexity
- **Phasing**: Patterns shifting out of sync
- **Tempo**: 120-140 BPM typically

### Tech-dub (Stott/Rhythm & Sound)
- **Sub-bass emphasis**: 40-80 Hz sine waves
- **Dub effects**: Long delays (1/4, 1/8 dotted) with feedback
- **Filter sweeps**: Slow LFO modulation of low-pass filters
- **Space and breaks**: Silence as compositional element
- **Tempo**: 70-95 BPM half-time feel

### Ambient + Lo-Fi
- **Textural layers**: Noise, pads, atmospheric elements
- **Bit crushing**: Digital degradation for lo-fi aesthetic
- **Heavy reverb**: Long tails (3-8 seconds)
- **Distorted drums**: Saturation and crushing on percussion
- **Tempo**: 60-75 BPM, very slow

## Effect Triggering Philosophy

Effects are **not constant** - they're triggered based on:
1. **Pattern-based**: Every N bars
2. **Probability**: Percentage chance per beat
3. **Threshold**: When parameters cross certain values
4. **Manual**: User interaction
5. **Dynamics**: Velocity-sensitive triggering

This creates more organic, evolving soundscapes rather than static processing.

## Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Requires user interaction to start audio

## Future Enhancements

- [ ] MIDI input/output support
- [ ] Audio export/rendering
- [ ] More synthesis types (granular, wavetable)
- [ ] Advanced pattern sequencer
- [ ] Gesture-based controls (inspired by Orchid)
- [ ] Collaboration/sharing features
- [ ] Expanded preset library

## Credits

Inspired by:
- **Philip Glass** - Minimalist composer
- **Michael Nyman** - Experimental composer
- **Wim Mertens** - Belgian composer
- **Andy Stott** - Tech-dub producer
- **Rhythm & Sound** - Dub techno project
- **Steve Reich** - Phasing techniques
- **Euclidean Rhythms** - Bjorklund's algorithm

Hardware inspiration:
- **HiChord** - Generative MIDI controller
- **Teenage Engineering OP-Z/EP-40** - Parameter locks and punch-in effects
- **Orchid by Telepathic Instruments** - Gesture-based synthesis

## License

MIT License - Free to use and modify

---

**MUZAKMAKR** - Generative minimal music for the web
