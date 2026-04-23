import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter, Link } from 'expo-router';
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

/** Sign-in screen (was `LandingPage.jsx` in the web project). */
export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = () => {
    // Matches old behaviour: unconditionally go to the main app page.
    router.push('/app');
  };

  return (
    <PhoneFrame>
      <PaperBackground />

      {/* Large blue decorative star, top-left. */}
      <Star left={-50} top={-40} variant="large" color="#D1EEFE" rotate={15} width={340} height={340} />

      {/* Rotated map image, top-right. */}
      <MapLayer left={186} top={-557} width={670} height={293} rotate={-60} />

      <SightLineTitle />

      {/* Pink star, right side. */}
      <Star left={294} top={180} variant="med" color="#FEEAF3" rotate={-20} width={100} height={100} />

      {/* Paperclip, rotated to point down-left. */}
      <Paperclip left={30} top={220} rotate={-90} />

      {/* White login-form card. */}
      <View style={styles.formCard} />

      {/* Email input pill. */}
      <PillBackground left={49} top={270} />
      <TextInput
        style={[styles.input, { left: 70, top: 283, width: 270, height: 46 }]}
        placeholder="Email"
        placeholderTextColor="#9b8a8a"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      {/* Password input pill. */}
      <PillBackground left={49} top={353} />
      <TextInput
        style={[styles.input, { left: 70, top: 366, width: 270, height: 46 }]}
        placeholder="Password"
        placeholderTextColor="#9b8a8a"
        secureTextEntry
        autoCapitalize="none"
        value={password}
        onChangeText={setPassword}
      />

      {/* Log-in gradient button. */}
      <GradientPill left={127} top={430} />
      <Pressable onPress={handleSignIn} style={{ position: 'absolute', left: 127, top: 430, width: 148, height: 53, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>

      {/* Map background (bottom), rotated slightly. */}
      <MapLayer left={-301} top={440} width={1222} height={534} rotate={-8} />

      {/* New-account link pill. */}
      <Link href="/signup" asChild>
        <Pressable style={styles.newAccountPill}>
          <Text style={styles.newAccountText}>new account</Text>
        </Pressable>
      </Link>

      {/* Small blue star, bottom-left. */}
      <Star left={31} top={566} variant="small" color="#D1EEFE" rotate={15} width={92} height={92} />

      {/* Paperclip, bottom-right, rotated horizontally-ish. */}
      <Paperclip left={286} top={522} rotate={100} />

      {/* Pushpin, top-right. */}
      <Pushpin left={314} top={-20} />

      {/* Pushpin, bottom-left, flipped vertically. */}
      <Pushpin left={-9} top={681} rotate={180} flipY />

      {/* Decorative pink / blue / yellow rectangles behind the bottom edge. */}
      <Rect left={-2} top={760} width={180} height={146} color="#FEEAF3" rotate={10} />
      <Rect left={230} top={730} width={196.819} height={188.828} color="#D1EEFE" rotate={-10} />
      <Rect left={123.75} top={830} width={227.803} height={171.644} color="#FFFCE9" rotate={-4} />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  formCard: {
    position: 'absolute',
    left: 37,
    top: 227,
    width: 327,
    height: 270,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  input: {
    position: 'absolute',
    backgroundColor: 'transparent',
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 26,
    padding: 0,
  },
  buttonText: {
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 30,
    lineHeight: 34,
  },
  newAccountPill: {
    position: 'absolute',
    left: 76,
    top: 560,
    width: 250,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  newAccountText: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 30,
    color: '#452d2d',
    textDecorationLine: 'underline',
  },
});
