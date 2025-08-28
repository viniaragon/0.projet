import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, StatusBar } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useRoute, RouteProp } from '@react-navigation/native';
import * as ScreenOrientation from 'expo-screen-orientation';
import * as NavigationBar from 'expo-navigation-bar';

type Params = {
  youtubeId: string;
};

export default function VideoPlayer() {
  const { params } = useRoute<RouteProp<Record<string, Params>, string>>();
  const id = params?.youtubeId ?? '';

  useEffect(() => {
    const prepare = async () => {
      try {
        await ScreenOrientation.lockAsync(
          ScreenOrientation.OrientationLock.LANDSCAPE
        );
      } catch {}
      try {
        await NavigationBar.setVisibilityAsync('hidden');
      } catch {}
      StatusBar.setHidden(true);
    };
    prepare();
    return () => {
      ScreenOrientation.unlockAsync().catch(() => {});
      NavigationBar.setVisibilityAsync('visible').catch(() => {});
      StatusBar.setHidden(false);
    };
  }, []);

  if (Platform.OS === 'web') {
    return (
      <iframe
        style={styles.webPlayer}
        src={`https://www.youtube.com/embed/${id}?autoplay=1&playsinline=1`}
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    );
  }

  return (
    <View style={styles.container}>
      <YoutubePlayer height={300} width={'100%'} videoId={id} play />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  webPlayer: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
});
