import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Picker } from '@react-native-picker/picker';
import { Video, ResizeMode } from 'expo-av';
import { API_URL } from '../lib/config';

/** Video Recap generator (was `VideoRecapPage.jsx` in the web project). */
const CLASSIFIERS = ['eating', 'transit', 'exercise', 'social', 'work', 'other'] as const;
type Classifier = (typeof CLASSIFIERS)[number];

type LocalClip = {
  uri: string;
  name: string;
  mimeType: string;
  size?: number;
  classifier: Classifier;
  score: string;
};

type Status = null | 'uploading' | 'generating' | 'polling' | 'done' | 'error';

export default function RecapScreen() {
  const router = useRouter();
  const [clips, setClips] = useState<LocalClip[]>([]);
  const [status, setStatus] = useState<Status>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const isProcessing = status === 'uploading' || status === 'generating' || status === 'polling';

  async function pickFiles() {
    const res = await DocumentPicker.getDocumentAsync({
      multiple: true,
      type: 'video/*',
      copyToCacheDirectory: true,
    });
    if (res.canceled) return;
    const added: LocalClip[] = res.assets.map((a) => ({
      uri: a.uri,
      name: a.name,
      mimeType: a.mimeType ?? 'video/mp4',
      size: a.size,
      classifier: 'other',
      score: '0.5',
    }));
    setClips((prev) => [...prev, ...added]);
  }

  function updateClip<K extends keyof LocalClip>(index: number, field: K, value: LocalClip[K]) {
    setClips((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }

  function removeClip(index: number) {
    setClips((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleGenerate() {
    if (clips.length === 0) {
      setStatus('error');
      setStatusMessage('Please add at least one clip.');
      return;
    }
    try {
      setStatus('uploading');
      setStatusMessage('Uploading clips...');

      const formData = new FormData();
      clips.forEach((clip) => {
        // React Native's FormData accepts { uri, name, type }.
        formData.append('files', {
          uri: clip.uri,
          name: clip.name,
          type: clip.mimeType,
        } as any);
      });

      const uploadRes = await fetch(`${API_URL}/recap/upload`, {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Upload failed');
      }
      const { urls } = (await uploadRes.json()) as {
        urls: { url: string; filename: string }[];
      };

      const clipData = urls.map((item, i) => ({
        url: item.url,
        filename: item.filename,
        classifier: clips[i]?.classifier ?? 'other',
        score: parseFloat(clips[i]?.score ?? '0.5') || 0.5,
      }));

      setStatus('generating');
      setStatusMessage('Submitting to Shotstack for rendering...');
      const generateRes = await fetch(`${API_URL}/recap/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clips: clipData }),
      });
      if (!generateRes.ok) {
        const err = await generateRes.json().catch(() => ({}));
        throw new Error(err.detail || 'Render submission failed');
      }
      const { render_id } = (await generateRes.json()) as { render_id: string };

      setStatus('polling');
      setStatusMessage('Rendering your recap video...');
      await pollStatus(render_id);
    } catch (e: any) {
      setStatus('error');
      setStatusMessage(e?.message || 'Something went wrong.');
    }
  }

  async function pollStatus(renderId: string) {
    const maxAttempts = 60;
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise((r) => setTimeout(r, 5000));
      const res = await fetch(`${API_URL}/recap/status/${renderId}`);
      if (!res.ok) continue;
      const data = (await res.json()) as { status: string; url?: string };
      if (data.status === 'done') {
        setVideoUrl(data.url ?? null);
        setStatus('done');
        setStatusMessage('Your recap is ready!');
        return;
      }
      if (data.status === 'failed') {
        throw new Error('Shotstack render failed.');
      }
      const progress = Math.min(Math.round(((i + 1) / maxAttempts) * 100), 95);
      setStatusMessage(`Rendering your recap video... ${progress}%`);
    }
    throw new Error('Render timed out. Try again.');
  }

  return (
    <LinearGradient colors={['#FEEAF3', '#D1EEFE']} style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.card}>
          {/* Header. */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Daily Recap Generator</Text>
          </View>

          {/* Upload area. */}
          <Pressable
            onPress={() => !isProcessing && pickFiles()}
            style={[styles.uploadArea, isProcessing && { opacity: 0.6 }]}
          >
            <Text style={styles.uploadEmoji}>🎬</Text>
            <Text style={styles.uploadLabel}>Tap to add video clips</Text>
            <Text style={styles.uploadHint}>MP4, MOV, AVI supported</Text>
          </Pressable>

          {/* Clip list. */}
          {clips.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Your Clips ({clips.length})</Text>
              {clips.map((clip, i) => (
                <View key={`${clip.uri}-${i}`} style={styles.clipRow}>
                  <Video
                    source={{ uri: clip.uri }}
                    style={styles.clipThumb}
                    useNativeControls={false}
                    isMuted
                    resizeMode={ResizeMode.COVER}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clipName} numberOfLines={1}>
                      {clip.name}
                    </Text>
                    <View style={styles.fieldsRow}>
                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Classifier</Text>
                        <View style={styles.pickerWrap}>
                          <Picker
                            enabled={!isProcessing}
                            selectedValue={clip.classifier}
                            onValueChange={(v) => updateClip(i, 'classifier', v as Classifier)}
                            style={styles.picker}
                          >
                            {CLASSIFIERS.map((c) => (
                              <Picker.Item key={c} label={c} value={c} />
                            ))}
                          </Picker>
                        </View>
                      </View>
                      <View style={styles.field}>
                        <Text style={styles.fieldLabel}>Score (0–1)</Text>
                        <TextInput
                          editable={!isProcessing}
                          keyboardType="decimal-pad"
                          value={clip.score}
                          onChangeText={(v) => updateClip(i, 'score', v)}
                          style={styles.scoreInput}
                        />
                      </View>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => !isProcessing && removeClip(i)}
                    style={styles.removeBtn}
                  >
                    <Text style={styles.removeBtnText}>✕</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Status message. */}
          {status && status !== 'done' && (
            <View
              style={[
                styles.statusBox,
                status === 'error' ? styles.statusError : styles.statusInfo,
              ]}
            >
              {isProcessing && <ActivityIndicator size="small" color="#2980b9" />}
              <Text
                style={[
                  styles.statusText,
                  { color: status === 'error' ? '#c0392b' : '#2980b9' },
                ]}
              >
                {statusMessage}
              </Text>
            </View>
          )}

          {/* Result video. */}
          {status === 'done' && videoUrl && (
            <View style={{ marginBottom: 20 }}>
              <Text style={styles.sectionTitle}>Your Recap is Ready!</Text>
              <Video
                source={{ uri: videoUrl }}
                style={styles.resultVideo}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
              />
              <Pressable
                onPress={() => Linking.openURL(videoUrl)}
                style={styles.downloadBtn}
              >
                <LinearGradient
                  colors={['#FEEAF3', '#D1EEFE']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFillObject}
                />
                <Text style={styles.downloadBtnText}>Open / Download Video</Text>
              </Pressable>
            </View>
          )}

          {/* Generate button. */}
          <Pressable
            onPress={handleGenerate}
            disabled={isProcessing || clips.length === 0}
            style={[
              styles.generateBtn,
              (isProcessing || clips.length === 0) && styles.generateBtnDisabled,
            ]}
          >
            {!(isProcessing || clips.length === 0) && (
              <LinearGradient
                colors={['#FEEAF3', '#D1EEFE']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFillObject}
              />
            )}
            <Text
              style={[
                styles.generateBtnText,
                (isProcessing || clips.length === 0) && { color: '#aaa' },
              ]}
            >
              {isProcessing ? 'Processing...' : 'Generate Recap ✨'}
            </Text>
          </Pressable>

          <Text style={styles.footnote}>
            Clips are ranked by score and trimmed to fit ~60 seconds
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  scroll: {
    padding: 16,
    paddingTop: 48,
    paddingBottom: 32,
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  backArrow: { fontSize: 22, color: '#452d2d' },
  title: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 26,
    color: '#452d2d',
    flexShrink: 1,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: '#D1EEFE',
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#FAFEFF',
  },
  uploadEmoji: { fontSize: 36, marginBottom: 8 },
  uploadLabel: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 18,
    color: '#452d2d',
  },
  uploadHint: { color: '#aaa', fontSize: 12, marginTop: 4 },
  sectionTitle: {
    fontFamily: 'HiMelody_400Regular',
    color: '#452d2d',
    fontSize: 20,
    marginBottom: 10,
  },
  clipRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#EEE1D0',
    borderRadius: 14,
    padding: 10,
    backgroundColor: '#FFFCE9',
    marginBottom: 10,
  },
  clipThumb: {
    width: 72,
    height: 52,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  clipName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#452d2d',
    marginBottom: 6,
  },
  fieldsRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  field: { flexDirection: 'column', gap: 2 },
  fieldLabel: { fontSize: 11, color: '#888' },
  pickerWrap: {
    borderWidth: 1,
    borderColor: '#EEE1D0',
    borderRadius: 8,
    backgroundColor: '#fff',
    minWidth: 120,
    height: 36,
    justifyContent: 'center',
  },
  picker: { height: 36, color: '#452d2d' },
  scoreInput: {
    width: 70,
    borderWidth: 1,
    borderColor: '#EEE1D0',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
    color: '#452d2d',
    backgroundColor: '#fff',
  },
  removeBtn: { padding: 4 },
  removeBtnText: { color: '#aaa', fontSize: 18 },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
  },
  statusInfo: { backgroundColor: '#F0F8FF', borderColor: '#D1EEFE' },
  statusError: { backgroundColor: '#FFF0F0', borderColor: '#FFB3B3' },
  statusText: { fontSize: 14 },
  resultVideo: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 14,
    backgroundColor: '#000',
  },
  downloadBtn: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadBtnText: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 18,
    color: '#452d2d',
  },
  generateBtn: {
    paddingVertical: 14,
    borderRadius: 999,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  generateBtnDisabled: { backgroundColor: '#e0e0e0' },
  generateBtnText: {
    fontFamily: 'HiMelody_400Regular',
    fontSize: 22,
    color: '#452d2d',
  },
  footnote: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: 12,
    marginTop: 12,
  },
});
