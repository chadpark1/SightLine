import React from 'react';
import { Image, ImageStyle, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { svgPaths } from '../lib/svgPaths';

/* ========================================================================
 * A paper-scrapbook decoration kit shared by the signin/signup/app screens.
 * Everything is absolutely positioned inside the 402x874 PhoneFrame.
 * ===================================================================== */

const paperclipSrc = require('../assets/images/paperclip.png');
const pushpinSrc = require('../assets/images/pushpin.png');
const mapSrc = require('../assets/images/map.png');
const paperSrc = require('../assets/images/paper.png');

/** Tiled paper texture that sits behind every scrapbook screen. */
export function PaperBackground() {
  return (
    <Image
      source={paperSrc}
      resizeMode="repeat"
      style={{
        position: 'absolute',
        left: -599,
        top: -1059,
        width: 1668,
        height: 2157,
      } as ImageStyle}
    />
  );
}

type StarProps = {
  left: number;
  top: number;
  /** Which star SVG path to use. */
  variant: 'small' | 'small2' | 'med' | 'large';
  color: string;
  opacity?: number;
  rotate?: number;
  width: number;
  height: number;
};

const STAR_VB: Record<StarProps['variant'], { w: number; h: number; d: string }> = {
  small: { w: 92.9653, h: 91.3196, d: svgPaths.starSmall },
  small2: { w: 102.146, h: 93.6806, d: svgPaths.starSmall2 },
  med: { w: 102.884, h: 98.4025, d: svgPaths.starMed },
  large: { w: 329.016, h: 326.044, d: svgPaths.starLarge },
};

export function Star({ left, top, variant, color, opacity = 1, rotate = 0, width, height }: StarProps) {
  const vb = STAR_VB[variant];
  return (
    <View
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        transform: [{ rotate: `${rotate}deg` }],
      }}
    >
      <Svg width={width} height={height} viewBox={`0 0 ${vb.w} ${vb.h}`}>
        <Path d={vb.d} fill={color} opacity={opacity} />
      </Svg>
    </View>
  );
}

type RectProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  rotate?: number;
  shadow?: boolean;
};

/** A flat colored rectangle sticky-note card with optional drop-shadow. */
export function Rect({ left, top, width, height, color, rotate = 0, shadow = true }: RectProps) {
  return (
    <View
      style={[
        {
          position: 'absolute',
          left,
          top,
          width,
          height,
          backgroundColor: color,
          transform: [{ rotate: `${rotate}deg` }],
        },
        shadow && styles.cardShadow,
      ]}
    />
  );
}

/** Paperclip image — 91x36 native, positioned & rotated around its center. */
export function Paperclip({
  left,
  top,
  rotate = 0,
  width = 91,
  height = 36,
}: {
  left: number;
  top: number;
  rotate?: number;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      source={paperclipSrc}
      resizeMode="cover"
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        transform: [{ rotate: `${rotate}deg` }],
      } as ImageStyle}
    />
  );
}

/** Pushpin image — 109x109 by default. */
export function Pushpin({
  left,
  top,
  rotate = 0,
  flipY = false,
  size = 109,
}: {
  left: number;
  top: number;
  rotate?: number;
  flipY?: boolean;
  size?: number;
}) {
  return (
    <Image
      source={pushpinSrc}
      resizeMode="cover"
      style={{
        position: 'absolute',
        left,
        top,
        width: size,
        height: size,
        transform: [{ rotate: `${rotate}deg` }, { scaleY: flipY ? -1 : 1 }],
      } as ImageStyle}
    />
  );
}

/** Semi-transparent map image used as a decorative layer. */
export function MapLayer({
  left,
  top,
  width,
  height,
  rotate = 0,
  opacity = 0.4,
}: {
  left: number;
  top: number;
  width: number;
  height: number;
  rotate?: number;
  opacity?: number;
}) {
  return (
    <View
      style={{
        position: 'absolute',
        left,
        top,
        width,
        height,
        opacity,
        overflow: 'hidden',
        transform: [{ rotate: `${rotate}deg` }],
      }}
    >
      <Image source={mapSrc} style={{ width, height }} resizeMode="cover" />
    </View>
  );
}

/**
 * The pill-shaped yellow cream background used behind input fields.
 * Matches svgPaths.pill304 (304 x 53).
 */
export function PillBackground({
  left,
  top,
  width = 304,
  height = 53,
  color = '#FFFCE9',
}: {
  left: number;
  top: number;
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <View style={{ position: 'absolute', left, top, width, height }}>
      <Svg width={width} height={height} viewBox="0 0 304 53" preserveAspectRatio="none">
        <Path d={svgPaths.pill304} fill={color} />
      </Svg>
    </View>
  );
}

/**
 * Pink-to-blue gradient pill button (152x43 native).
 * Tapping this should be handled by a transparent overlay from the parent.
 */
export function GradientPill({
  left,
  top,
  width = 148,
  height = 43,
  path = svgPaths.pillBtn,
  viewBox = '0 0 152 43',
}: {
  left: number;
  top: number;
  width?: number;
  height?: number;
  path?: string;
  viewBox?: string;
}) {
  return (
    <View style={[{ position: 'absolute', left, top, width, height }, styles.buttonShadow]}>
      <Svg width={width} height={height} viewBox={viewBox} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="pillGradient" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0" stopColor="#FEEAF3" />
            <Stop offset="1" stopColor="#D1EEFE" />
          </LinearGradient>
        </Defs>
        <Path d={path} fill="url(#pillGradient)" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  cardShadow: {
    // iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    // Android
    elevation: 4,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
});
