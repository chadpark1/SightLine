import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useFonts as useIrishGrover, IrishGrover_400Regular } from '@expo-google-fonts/irish-grover';
import { Inika_400Regular } from '@expo-google-fonts/inika';
import { JacquesFrancoisShadow_400Regular } from '@expo-google-fonts/jacques-francois-shadow';
import { SpecialElite_400Regular } from '@expo-google-fonts/special-elite';
import { Gugi_400Regular } from '@expo-google-fonts/gugi';
import { JollyLodger_400Regular } from '@expo-google-fonts/jolly-lodger';
import { Griffy_400Regular } from '@expo-google-fonts/griffy';
import { GermaniaOne_400Regular } from '@expo-google-fonts/germania-one';
import { HiMelody_400Regular } from '@expo-google-fonts/hi-melody';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [fontsLoaded] = useIrishGrover({
    IrishGrover_400Regular,
    Inika_400Regular,
    JacquesFrancoisShadow_400Regular,
    SpecialElite_400Regular,
    Gugi_400Regular,
    JollyLodger_400Regular,
    Griffy_400Regular,
    GermaniaOne_400Regular,
    HiMelody_400Regular,
  });

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (fontsLoaded) {
      setReady(true);
    }
  }, [fontsLoaded]);

  const onLayoutRootView = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync().catch(() => {});
    }
  }, [ready]);

  if (!ready) {
    return <View style={{ flex: 1, backgroundColor: '#fff' }} />;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#f3f4f6' } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="app" />
        <Stack.Screen name="recap" />
      </Stack>
    </View>
  );
}
