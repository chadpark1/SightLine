import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { StyleSheet, Text, View } from 'react-native';
import { Rect } from './Decorations';

/**
 * The "SightLinE" scrapbook-style header.
 * Each letter sits on its own tan sticky-note card and uses a different
 * Google Font. The sticky notes and letters are absolutely positioned to
 * match the original Figma export.
 */
export default function SightLineTitle() {
  return (
    <>
      {/* Tan sticky-note backgrounds behind each letter. */}
      <Rect left={22} top={69} width={81.752} height={86.112} color="#eee1d0" rotate={-10} />
      <Rect left={72} top={73} width={80} height={90} color="#eee1d0" />
      <Rect left={133} top={50} width={80} height={90} color="#eee1d0" />
      <Rect left={181} top={79} width={70} height={80} color="#eee1d0" rotate={10} />
      <Rect left={219} top={62} width={80} height={80} color="#eee1d0" />
      {/* Rotated card via SVG so corners don't clip. */}
      <View
        style={{
          position: 'absolute',
          left: 267,
          top: 86,
          width: 71.5,
          height: 79.5,
          transform: [{ rotate: '-10deg' }],
        }}
      >
        <Svg width={71.5} height={79.5} viewBox="0 0 75.9128 83.8324" preserveAspectRatio="none">
          <Path d="M4 0H71.9128V75.8324H4V0Z" fill="#EEE1D0" />
        </Svg>
      </View>
      <Rect left={301} top={66} width={81.159} height={81.032} color="#eee1d0" rotate={10} />

      {/* The 9 stylised letters. */}
      <Text style={[styles.letter, { left: 42, top: 75, fontFamily: 'IrishGrover_400Regular' }]}>S</Text>
      <Text style={[styles.letter, { left: 84, top: 89, fontFamily: 'Inika_400Regular', width: 33 }]}>I</Text>
      <Text style={[styles.letter, { left: 112, top: 63, fontFamily: 'JacquesFrancoisShadow_400Regular' }]}>g</Text>
      <Text style={[styles.letter, { left: 150, top: 74, fontFamily: 'SpecialElite_400Regular' }]}>h</Text>
      <Text style={[styles.letter, { left: 190, top: 89, fontFamily: 'Gugi_400Regular' }]}>t</Text>
      <Text style={[styles.letter, { left: 215, top: 64, fontFamily: 'JacquesFrancoisShadow_400Regular' }]}>L</Text>
      <Text style={[styles.letter, { left: 263, top: 76, fontFamily: 'JollyLodger_400Regular' }]}>i</Text>
      <Text style={[styles.letter, { left: 280, top: 81, fontFamily: 'Griffy_400Regular' }]}>N</Text>
      <Text style={[styles.letter, { left: 330, top: 72, fontFamily: 'GermaniaOne_400Regular' }]}>E</Text>
    </>
  );
}

const styles = StyleSheet.create({
  letter: {
    position: 'absolute',
    color: '#452d2d',
    fontSize: 60,
    lineHeight: 68,
    width: 55,
    height: 70,
    includeFontPadding: false,
  } as any,
});
