import React, { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  youtubeId: string;
}

const ChildFeed = () => {
  const navigation = useNavigation();
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'approved_videos'));
        const items: Video[] = snapshot.docs.map(doc => {
          const data = doc.data() as Omit<Video, 'id'>;
          return { id: doc.id, ...data };
        });
        setVideos(items);
      } catch (err) {
        console.error('Failed to load videos', err);
      }
    };
    fetchVideos();
  }, []);

  const renderItem = ({ item }: { item: Video }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => navigation.navigate('VideoPlayer' as never, { youtubeId: item.youtubeId } as never)}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={videos}
      keyExtractor={item => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  item: {
    marginBottom: 24,
  },
  thumbnail: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  title: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ChildFeed;
