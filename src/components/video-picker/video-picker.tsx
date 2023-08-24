import { Ionicons } from '@expo/vector-icons'
import { ResizeMode, Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { getThumbnailAsync } from 'expo-video-thumbnails'
import { useEffect, useRef, useState } from 'react'
import { FlatList, Image, Pressable, View } from 'react-native'

interface VideoPickerProps {
  handleResult: (result: any) => void
}

interface Thumbnail {
  uri: string
  time: number
}

function VideoPickerComponent({ handleResult }: VideoPickerProps) {
  const [result, setResult] = useState<ImagePicker.ImagePickerSuccessResult | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [frameThumbnails, setFrameThumbnails] = useState<any>([])

  const videoRef = useRef<any>(null)

  const pickVideoAsync = async () => {
    if (selectedVideo === '' || !selectedVideo) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 1
      })

      if (!result.canceled) {
        setSelectedVideo(result?.assets[0]?.uri)
        setResult(result)
        // pass to parent
        handleResult(result)
      } else {
        //   alert("Please select a Video.");
      }
    }
  }

  useEffect(() => {
    if (result) {
      handleExtractFrames()
    }
  }, [result])

  const handleExtractFrames = async () => {
    if (result && result.assets[0].duration) {
      const videoUri = selectedVideo
      const numFrames = 60
      const thumbnails: Thumbnail[] = []
      const interval = result.assets[0].duration / (numFrames - 1) // Subtracting 1 to get accurate intervals

      for (let i = 0; i < numFrames; i++) {
        try {
          const time = i * interval
          const thumbnail = await getThumbnailAsync(videoUri, {
            time: time
          })
          thumbnails.push({ uri: thumbnail.uri, time: time })
        } catch (error) {
          console.error('Error generating thumbnail:', error)
        }
      }
      console.log('thumbnails:', thumbnails.length)
      setFrameThumbnails(thumbnails)
    }
  }

  const handleThumbnailPress = (time) => {
    if (videoRef.current) {
      videoRef.current.setPositionAsync(time)
    }
  }

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Pressable onPress={pickVideoAsync}>
        <View
          style={{
            backgroundColor: 'gray',
            justifyContent: 'center',
            alignItems: 'center',
            width: 300,
            height: 300
          }}
        >
          {selectedVideo && (
            <Video
              ref={videoRef}
              style={{
                width: selectedVideo && '100%',
                height: selectedVideo && '100%'
              }}
              source={{ uri: selectedVideo }}
              useNativeControls
              resizeMode={ResizeMode.CONTAIN}
              // isLooping
              // onPlaybackStatusUpdate={status => setStatus(() => status)}
            />
          )}
          {!selectedVideo && <Ionicons name="image-outline" color={'white'} size={18} />}
        </View>
      </Pressable>
      <View style={{ width: '100%', marginVertical: 10, backgroundColor: 'gray' }}>
        {frameThumbnails.length > 0 && (
          <FlatList
            data={frameThumbnails}
            horizontal
            showsHorizontalScrollIndicator={true}
            renderItem={({ item }) => (
              <Pressable onPress={() => handleThumbnailPress(item.time)}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: 100, height: 60, marginRight: 10 }}
                />
              </Pressable>
            )}
            keyExtractor={(item: any) => item.uri}
          />
        )}
      </View>
    </View>
  )
}

export default VideoPickerComponent
