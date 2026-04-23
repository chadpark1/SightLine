import React from 'react';
import { Dimensions, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

/**
 * The original web designs are pixel-perfect for a 402x874 iPhone 17 viewport.
 * We preserve that by rendering everything inside a fixed-width 402 canvas and
 * uniformly scaling it (via transform) to fit the device screen width.
 */
export const FRAME_WIDTH = 402;
export const FRAME_HEIGHT = 874;

type Props = {
  children: React.ReactNode;
  /** Inner content height. Defaults to FRAME_HEIGHT (non-scrollable). */
  contentHeight?: number;
  /** If true, the inner area scrolls vertically (taller than FRAME_HEIGHT). */
  scrollable?: boolean;
  style?: ViewStyle;
};

export default function PhoneFrame({
  children,
  contentHeight = FRAME_HEIGHT,
  scrollable = false,
  style,
}: Props) {
  const { width: screenW, height: screenH } = Dimensions.get('window');
  // Scale the 402-wide canvas to fill the screen width (capped at 1 on tablets).
  const scale = Math.min(screenW / FRAME_WIDTH, screenH / FRAME_HEIGHT);
  const scaledWidth = FRAME_WIDTH * scale;
  const scaledHeight = FRAME_HEIGHT * scale;

  const inner = (
    <View style={{ width: FRAME_WIDTH, height: contentHeight, overflow: 'hidden' }}>
      {children}
    </View>
  );

  return (
    <View style={[styles.outer, style]}>
      <View
        style={{
          width: scaledWidth,
          height: scaledHeight,
          overflow: 'hidden',
          backgroundColor: '#fff',
        }}
      >
        <View
          style={{
            width: FRAME_WIDTH,
            height: FRAME_HEIGHT,
            transform: [{ scale }],
            transformOrigin: 'top left' as any,
          }}
        >
          {scrollable ? (
            <ScrollView
              style={{ width: FRAME_WIDTH, height: FRAME_HEIGHT }}
              contentContainerStyle={{ width: FRAME_WIDTH, height: contentHeight }}
              showsVerticalScrollIndicator={false}
            >
              {inner}
            </ScrollView>
          ) : (
            inner
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
