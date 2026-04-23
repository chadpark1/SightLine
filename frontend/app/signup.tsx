import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Link } from 'expo-router';
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
import { supabase } from '../lib/supabase';

/** Sign-up screen (was `SignUpPage.jsx` in the web project). */
export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    const { error: err } = await supabase.auth.signUp({ email, password });
    if (err) {
      setError(err.message);
    } else {
      setEmailSent(true);
    }
  };

  return (
    <PhoneFrame>
      <PaperBackground />

      {/* Large green star, top-left. */}
      <Star left={-50} top={-40} variant="large" color="#ACD8A7" opacity={0.533} rotate={15} width={340} height={340} />

      {/* Rotated map image, top-right. */}
      <MapLayer left={186} top={-557} width={670} height={293} rotate={-60} />

      <SightLineTitle />

      {/* Yellow star, top-right. */}
      <Star left={294} top={180} variant="med" color="#FFE9AE" opacity={0.596} rotate={-20} width={100} height={100} />

      {/* White sign-up form card. */}
      <View style={styles.formCard} />

      {/* Email. */}
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

      {/* Password. */}
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

      {/* Confirm password. */}
      <PillBackground left={49} top={427} />
      <TextInput
        style={[styles.input, { left: 70, top: 437, width: 270, height: 46 }]}
        placeholder="Confirm Password"
        placeholderTextColor="#9b8a8a"
        secureTextEntry
        autoCapitalize="none"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      {/* Sign-up gradient button. */}
      <GradientPill left={127} top={502} />
      <Pressable
        onPress={handleSignUp}
        style={{ position: 'absolute', left: 127, top: 502, width: 148, height: 53, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      {error !== '' && (
        <Text style={[styles.statusText, { color: '#d4183d' }]}>{error}</Text>
      )}
      {emailSent && (
        <Text style={[styles.statusText, { color: '#15803d' }]}>
          Check your email for a confirmation link!
        </Text>
      )}

      {/* Paperclip, right side. */}
      <Paperclip left={286} top={522} rotate={100} />

      {/* Map (bottom). */}
      <MapLayer left={-63} top={524} width={939} height={549.641} rotate={-8} />

      {/* "Sign In" link pill. */}
      <Link href="/signin" asChild>
        <Pressable style={styles.signInPill}>
          <Text style={styles.signInText}>Sign In</Text>
        </Pressable>
      </Link>

      {/* Small blue star, bottom-right. */}
      <Star left={295} top={609.5} variant="small2" color="#D1EEFE" rotate={15} width={99} height={94} />

      {/* Pushpin, top-right, tilted. */}
      <Pushpin left={311} top={111} rotate={-17.12} />

      {/* Pushpin, bottom-left, flipped. */}
      <Pushpin left={-18} top={652} rotate={180} flipY />

      {/* Decorative rectangles. */}
      <Rect left={-5} top={704} width={196.819} height={188.828} color="#D1EEFE" rotate={-10} />
      <Rect left={224} top={704} width={180} height={146} color="#FEEAF3" rotate={10} />
      <Rect left={116} top={780} width={227.803} height={171.644} color="#FFFCE9" rotate={-4} />
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  formCard: {
    position: 'absolute',
    left: 37,
    top: 227,
    width: 327,
    height: 333,
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
  statusText: {
    position: 'absolute',
    left: 49,
    top: 565,
    width: 304,
    textAlign: 'center',
    fontFamily: 'HiMelody_400Regular',
    fontSize: 16,
  },
  signInPill: {
    position: 'absolute',
    left: 76,
    top: 606,
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
  signInText: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 30,
    color: '#452d2d',
    textDecorationLine: 'underline',
  },
});
