import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg';
import PhoneFrame from '../components/PhoneFrame';
import SightLineTitle from '../components/SightLineTitle';
import {
  GradientPill,
  MapLayer,
  PaperBackground,
  Paperclip,
  PillBackground,
  Pushpin,
  Rect,
  Star,
} from '../components/Decorations';
import { svgPaths } from '../lib/svgPaths';

/** Main app home screen (was `mainappPage/src/app/App.tsx` in the web project). */
export default function AppScreen() {
  const router = useRouter();

  return (
    <PhoneFrame scrollable contentHeight={1987}>
      <PaperBackground />

      {/* Large blue star, top-left. */}
      <Star left={-50} top={-40} variant="large" color="#D1EEFE" rotate={15} width={340} height={340} />

      <SightLineTitle />

      {/* Pink star, right side. */}
      <Star left={294} top={180} variant="med" color="#FEEAF3" rotate={-20} width={100} height={100} />

      {/* "Connect Glasses" wide gradient button. */}
      <GradientPill left={87} top={295} width={205} height={43} path={svgPaths.pillWide} viewBox="0 0 205 43" />
      <Text style={[styles.connectText]}>Connect Glasses</Text>

      {/* Daily Recap Video pink card. */}
      <View style={styles.recapCard} />

      {/* Video placeholder text. */}
      <Text style={styles.videoPlaceholder}>[insert the video]</Text>
      <Text style={styles.videoLabel}>Daily Recap Video</Text>

      {/* Generate Recap button. */}
      <Pressable onPress={() => router.push('/recap')} style={styles.generateBtnWrap}>
        <View style={styles.generateBtnBg} />
        <Text style={styles.generateBtnText}>+ Generate Recap</Text>
      </Pressable>

      {/* Caption input (non-functional, matches original). */}
      <View style={styles.captionPill}>
        <Svg width={304} height={53} viewBox="0 0 304 53" preserveAspectRatio="none">
          <Path d={svgPaths.pill304} fill="white" />
        </Svg>
      </View>
      <TextInput
        style={styles.captionInput}
        placeholder="caption your video!"
        placeholderTextColor="rgba(69,45,45,0.5)"
      />

      {/* Gallery button. */}
      <GradientPill left={124} top={754} />
      <Text style={styles.galleryText}>Gallery</Text>

      {/* Decorative blue rectangle, right side. */}
      <Rect left={266} top={844} width={196.819} height={188.828} color="#D1EEFE" rotate={-10} />

      {/* Map bg, top-right. */}
      <MapLayer left={186} top={-557} width={670} height={293} rotate={-60} />

      {/* Pushpin, top-right. */}
      <Pushpin left={314} top={-20} />

      {/* Pushpin, left side, flipped. */}
      <Pushpin left={-22} top={354} rotate={180} flipY />

      {/* Small blue star, mid-right. */}
      <Star left={270} top={1107} variant="small" color="#D1EEFE" rotate={15} width={92} height={92} />

      {/* Polaroid photo card, bottom-left (rotated 12deg). */}
      <View style={[styles.polaroid, { left: 40, top: 1120, transform: [{ rotate: '12deg' }] }]}>
        <View style={styles.polaroidInnerPhoto} />
      </View>

      {/* Polaroid photo card, right (rotated -10deg). */}
      <View style={[styles.polaroid, { left: 200, top: 1375, transform: [{ rotate: '-10deg' }] }]}>
        <View style={styles.polaroidInnerPhoto} />
      </View>

      {/* Rotated map, bottom. */}
      <MapLayer left={-341} top={1355} width={1222} height={534} rotate={-8} />

      {/* Paperclips. */}
      <Paperclip left={72} top={1553} rotate={-90} />
      <Paperclip left={319} top={1608} rotate={100} />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  connectText: {
    position: 'absolute',
    left: 113,
    top: 302,
    width: 176,
    height: 50,
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 30,
    textAlign: 'center',
  },
  recapCard: {
    position: 'absolute',
    left: 26,
    top: 433,
    width: 344,
    height: 297,
    backgroundColor: '#FEEAF3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  videoPlaceholder: {
    position: 'absolute',
    left: 100,
    top: 510,
    width: 188,
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 30,
    opacity: 0.5,
  },
  videoLabel: {
    position: 'absolute',
    left: 104,
    top: 383,
    width: 188,
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 30,
  },
  generateBtnWrap: {
    position: 'absolute',
    left: 26,
    top: 396,
    height: 32,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  generateBtnBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FEEAF3',
  },
  generateBtnText: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 16,
    color: '#452d2d',
  },
  captionPill: {
    position: 'absolute',
    left: 46,
    top: 648,
    width: 304,
    height: 53,
  },
  captionInput: {
    position: 'absolute',
    left: 70,
    top: 658,
    width: 260,
    height: 40,
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 24,
    padding: 0,
  },
  galleryText: {
    position: 'absolute',
    left: 161,
    top: 760,
    width: 105,
    height: 50,
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 30,
    textAlign: 'center',
  },
  polaroid: {
    position: 'absolute',
    width: 148,
    height: 183,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#00000022',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  polaroidInnerPhoto: {
    flex: 1,
    backgroundColor: '#000',
  },
});
