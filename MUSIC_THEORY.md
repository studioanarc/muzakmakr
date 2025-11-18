# Music Theory Guide for MUZAKMAKR

## Introduction

This document explains the music theory concepts underlying MUZAKMAKR's generative algorithms, tailored to the styles of minimal music, tech-dub, and ambient.

## 1. American Minimal Music

### Historical Context

**Philip Glass** (1937-)
- Repetitive arpeggiated patterns
- Additive/subtractive processes
- Modal harmony with cyclic chord progressions
- Key works: "Music in Twelve Parts", "Einstein on the Beach"

**Michael Nyman** (1944-)
- Baroque-influenced minimalism
- More romantic harmonic language than Glass
- Driving, energetic patterns
- Key works: "The Piano" soundtrack, "MGV"

**Wim Mertens** (1953-)
- Belgian minimalist
- Combines minimalism with European classical tradition
- Emotional, lyrical approach
- Key works: "Struggle for Pleasure", "Close Cover"

### Harmonic Language

#### Modal Scales

Traditional major/minor scales feel too "resolved". Modes create ambiguity and hypnotic quality:

**Dorian Mode** (minor with raised 6th)
```
C Dorian: C D Eb F G A Bb C
         1 2 b3 4 5 6 b7 1
Sound: Melancholic but hopeful
Use: Glass's darker works
```

**Phrygian Mode** (minor with flat 2nd)
```
D Phrygian: D Eb F G A Bb C D
           1 b2 b3 4 5 b6 b7 1
Sound: Spanish, exotic, dark
Use: Tension, drama
```

**Aeolian Mode** (natural minor)
```
A Aeolian: A B C D E F G A
          1 2 b3 4 5 b6 b7 1
Sound: Sad, introspective
Use: Ambient minimal
```

**Mixolydian Mode** (major with flat 7th)
```
G Mixolydian: G A B C D E F G
             1 2 3 4 5 6 b7 1
Sound: Bright but unresolved
Use: Nyman's brighter works
```

#### Why Modes Work for Minimal Music

1. **Lack of Leading Tone**: The b7 (instead of major 7th) doesn't pull to the tonic as strongly
2. **Cyclical Nature**: Patterns can repeat without feeling like they need to "resolve"
3. **Color**: Each mode has a distinct emotional character
4. **Historical**: Medieval/Renaissance music used modes, giving timeless quality

#### Chord Progressions

Minimal music often uses **static harmony** or **limited chord movement**:

**Glass-style progressions** (in C Dorian):
```
Cm - Ab - Eb - Bb
i  - bVI - bIII - bVII

All chords from the Dorian scale
Creates cycling, hypnotic effect
```

**Nyman-style** (more movement):
```
Am - F - C - G
i  - bVI - bIII - bVII

Similar to Glass but faster harmonic rhythm
```

**Static minimal**:
```
Cm - Cm - Cm - Cm

Single chord, variations in voicing
Melody and rhythm create interest
```

### Rhythmic Techniques

#### Additive Process

Start with short pattern, gradually add notes:

```
Bar 1:  C
Bar 2:  C D
Bar 3:  C D Eb
Bar 4:  C D Eb D
Bar 5:  C D Eb D C
...continues building
```

Philip Glass used this extensively in "Music in Twelve Parts".

#### Subtractive Process

Inverse of additive - start full, remove notes.

#### Phasing (Steve Reich)

Two musicians play same pattern at slightly different tempos, gradually shifting out of phase:

```
Player 1: • • • - • • • -
Player 2: • • • - • • • -  (starts aligned)

After N bars:
Player 1: • • • - • • • -
Player 2:   • • • - • • • - (shifted 1 step)

After 2N bars:
Player 1: • • • - • • • -
Player 2:     • • • - • • • - (shifted 2 steps)
```

Creates constantly evolving polyrhythmic texture.

#### Tempo

- **Glass**: 120-140 BPM typically
- **Reich**: 132-144 BPM
- **Nyman**: 140-160 BPM (more energetic)

## 2. Tech-Dub

### Historical Context

**Dub** (Jamaica, 1960s-70s)
- King Tubby, Lee "Scratch" Perry
- Emphasis on bass and drums
- Heavy use of reverb and delay as instruments
- Drop-outs and spatial effects

**Tech-dub** (1990s-2000s)
- Basic Channel / Rhythm & Sound (Mark Ernestus, Moritz von Oswald)
- Andy Stott
- Combines dub techniques with techno minimalism
- Very sparse, bass-heavy

### Sound Design

#### Sub-Bass

Fundamental frequency: **40-80 Hz**

```
Pure sine wave (no harmonics)
Long sustain
Low-pass filter cutoff: 100-200 Hz
Volume: Loudest element in mix
```

The sub-bass is the **foundation** - everything else is built around it.

#### Dub Delay

**Tempo-synced delay times**:
```
1/4 note  = one beat
1/8 note  = half beat
1/4 dotted = 1.5 beats (gives "swung" feel)
```

**Feedback**: 40-70%
- Too low = just echo
- Too high = runaway feedback

**Filter in feedback loop**:
- Low-pass filter (500-2000 Hz)
- Each repeat gets darker
- Creates "dub echoes fading into distance" effect

#### Filter Sweeps

Slow LFO (0.1-2 Hz) modulating low-pass filter cutoff:

```
Closed (200 Hz)  → Open (8000 Hz) → Closed (200 Hz)
        |                |                |
     Dark/muffled    Bright/clear    Dark/muffled
```

Creates rhythmic "breathing" quality.

#### Tape Saturation

Analog tape compression and distortion:
- Soft clipping using tanh() function
- Adds harmonic richness
- "Glues" mix together
- Essential for "warm" dub sound

### Harmonic Language

Tech-dub uses **minimal harmony**:

**Single chord** for entire track:
```
Cm7 (C Eb G Bb)
```

**Two-chord progression**:
```
Cm7 → Fm7
i   → iv

Creates subtle movement without losing hypnotic quality
```

**Bass movement** defines harmony:
```
Bass: C → F → C → G
      (root changes, no chords above)
```

### Rhythm

**Half-time feel**:
- Track is 140 BPM
- But kick on beats 1 and 3 only
- Feels like 70 BPM
- Creates heavy, weighty groove

**Offbeat hi-hats**:
```
Kick:    •   -   •   -
Snare:   -   •   -   •
Hi-hat:  - • - • - • - •
```

Hi-hats on the "and" of every beat create shuffle.

**Breaks**:
Remove elements every 4-8 bars:
```
Bars 1-4:  Kick + Bass + Hats + Delay
Bars 5-6:  Bass + Delay only (BREAK)
Bars 7-8:  Kick + Bass + Hats + Delay
```

Silence is compositional tool.

### Tempo

Tech-dub sweet spot: **70-95 BPM**

- Below 70: Too slow, loses energy
- Above 95: Loses "weight", becomes techno

## 3. Ambient & Lo-Fi

### Sound Design

#### Bit Crushing

Reduces bit depth and sample rate:

**Bit Depth Reduction**:
```
16-bit → 8-bit → 4-bit
Smooth → Gritty → Destroyed
```

**Sample Rate Reduction**:
```
44100 Hz → 22050 Hz → 8000 Hz
Clear → Lo-fi → Telephone quality
```

Creates digital degradation, vintage sampler aesthetic.

#### Reverb

Long reverb tails for ambient space:

**Parameters**:
- Decay time: 3-8 seconds (vs 1-2 for normal music)
- Pre-delay: 20-40ms (separates direct sound from reverb)
- Wet/dry: 50-80% wet (very spacious)

**Effect**:
- Sounds seem to exist in huge spaces
- Blurs rhythm, creates atmosphere
- Notes blend together (intentional)

#### Distorted Drums

Gil Scott-Heron "Me and the Devil" aesthetic:

```
Clean drum sample
  → Bit crush (8-bit)
  → Saturation (heavy)
  → Reverb (long)
  → Result: Gritty, lo-fi, vintage
```

Contrast with clean elements creates tension.

### Harmonic Language

**Pentatonic scales** (5 notes instead of 7):

```
C Minor Pentatonic: C Eb F G Bb
                   1 b3 4 5 b7

No 2nd or 6th scale degrees
Creates "safe" intervals - hard to play wrong note
Asian influence, timeless quality
```

**Drones**:
Sustained single note or chord for extended time:
```
Bass drone on C (60 seconds+)
Pad playing Cm chord (sustained)
Melody in C minor pentatonic over top
```

Creates meditative, trance-like state.

### Rhythm

**Very slow tempos**: 60-75 BPM

**Sparse patterns**:
```
Euclidean E(3,16):
•  -  -  -  -  •  -  -  -  -  -  •  -  -  -  -

Only 3 hits per bar - lots of space
```

**Irregular patterns**:
Unlike minimal music's rigorous patterns, ambient uses:
- Probabilistic triggering (30% chance)
- Random variations in timing
- Human feel, not robotic

## 4. Euclidean Rhythms

### The Mathematics

The **Bjorklund algorithm** distributes k hits as evenly as possible across n steps.

**E(5,12)**: 5 hits across 12 steps
```
• • - • • - • • - • • -
```

**Why it sounds good**:
1. **Mathematical perfection**: Maximally even distribution
2. **Cross-cultural**: Appears in traditional music worldwide
   - West African bell patterns
   - Cuban clave
   - Indian talas
3. **Polyrhythmic**: Different E(k,n) values create complex interactions

### Common Patterns

**E(3,8)**: Basic waltz/6-8 feel
```
•  -  •  -  •  -  -  -
```

**E(5,8)**: Cuban cinquillo
```
•  -  •  •  -  •  •  -
```

**E(7,12)**: West African bell pattern
```
•  -  •  -  •  •  -  •  -  •  •  -
```

**E(5,16)**: Minimal dub kick
```
•  -  -  •  -  -  -  •  -  -  •  -  -  -  •  -
```

### In MUZAKMAKR

Different instruments use different E(k,n) values:

```
Piano:  E(11,16) - Dense arpeggios
Bass:   E(5,16)  - Steady foundation
Drums:  E(7,16)  - Syncopated groove
```

The interaction of these patterns creates polyrhythmic complexity from simple rules.

## 5. Practical Application

### Building a Glass-Style Piece

1. **Choose scale**: C Dorian
2. **Set tempo**: 132 BPM
3. **Create arpeggio**: E(11,16) on piano
4. **Add bass**: E(4,16) playing C-F-C-G
5. **Layer second arp**: E(8,16) at different octave
6. **Effects**: Light reverb only
7. **Let it evolve**: Listen for 3-4 minutes as patterns phase

### Building a Dub Piece

1. **Choose key**: C minor
2. **Set tempo**: 78 BPM (half-time)
3. **Sub bass**: E(5,16) on root note (C)
4. **Add kick**: E(7,16)
5. **Chord stabs**: E(4,16) with Cm7, offbeat
6. **Effects**: Heavy delay (1/4 dotted, 60% feedback)
7. **Breaks**: Every 8 bars, drop everything except bass + delay

### Building an Ambient Piece

1. **Choose scale**: E minor pentatonic
2. **Set tempo**: 65 BPM
3. **Drone pad**: Sustained Em chord
4. **Sparse percussion**: E(3,13) with bit crusher
5. **Melodic element**: E(5,16) probabilistic (30% chance)
6. **Effects**: Long reverb (6 seconds), bit crusher on drums
7. **Evolve slowly**: Use LFO on filter, very slow (0.1 Hz)

## 6. Advanced Concepts

### Metric Modulation

Change perceived tempo without changing actual BPM:

```
Bar 1-4:   16th notes feel like pulse
Bar 5-8:   Switch to triplets - feels faster
Bar 9-12:  Back to 16ths - feels slower
```

Creates push-pull tension.

### Polyrhythms

Multiple rhythmic cycles of different lengths:

```
Voice 1: E(3,8)  - cycles every 8 steps
Voice 2: E(5,12) - cycles every 12 steps
LCM = 24 steps until pattern repeats
```

Creates rich, evolving texture.

### Harmonic Rhythm

How often chords change:

```
Fast harmonic rhythm:  New chord every 2 beats
Slow harmonic rhythm:  New chord every 8 bars
Minimal:               One chord entire piece
```

Minimal music typically uses very slow harmonic rhythm.

## Conclusion

MUZAKMAKR combines:
- **Modal harmony** (Dorian, Phrygian) for timeless minimal sound
- **Euclidean rhythms** for mathematically perfect distributions
- **Dub effects** (delay, filters) as compositional tools
- **Lo-fi processing** for vintage, degraded aesthetic

The intersection of mathematics, music theory, and sound design creates generative music that's both intellectually rigorous and emotionally engaging.

---

**Further Listening**:
- Philip Glass - "Music in Twelve Parts"
- Steve Reich - "Music for 18 Musicians"
- Michael Nyman - "The Piano" OST
- Basic Channel - "BCD"
- Andy Stott - "Luxury Problems"
- Gil Scott-Heron - "I'm New Here"
