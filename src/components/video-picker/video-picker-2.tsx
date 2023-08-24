import { Ionicons } from '@expo/vector-icons'
import { ResizeMode, Video } from 'expo-av'
import * as ImagePicker from 'expo-image-picker'
import { useRef, useState } from 'react'
import { Pressable, View } from 'react-native'
import { Button } from 'react-native'
import { Configuration, ForceTrimMode, Tool, VESDK } from 'react-native-videoeditorsdk'

interface VideoPickerProps {
  handleResult: (result: any) => void
}

function VideoPickerComponent2({ handleResult }: VideoPickerProps) {
  const [result, setResult] = useState<ImagePicker.ImagePickerSuccessResult | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<any>(
    'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4'
  )

  const videoRef = useRef<any>(null)

  const pickVideoAsync = async (): Promise<void> => {
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

  // useEffect(() => {
  //   if (selectedVideo != '') {
  //     showVideoEditorExample()
  //   }
  // }, [result])

  const showVideoEditorExample = async (): Promise<void> => {
    try {
      // Add a video from the assets directory.
      const video = selectedVideo

      let config: Configuration = {
        tools: [Tool.TRIM],
        trim: {
          minimumDuration: 10,
          maximumDuration: 15,
          forceMode: ForceTrimMode.ALWAYS
        }
      }
      // Open the video editor and handle the export as well as any occuring errors.
      const result = await VESDK.openEditor(video, config)

      if (result != null) {
        // The user exported a new video successfully and the newly generated video is located at `result.video`.
        console.log(result?.video)
        setSelectedVideo(result?.video)
      } else {
        // The user tapped on the cancel button within the editor.
        return
      }
    } catch (error) {
      // There was an error generating the video.
      console.log(error)
    }
  }

  function editVideoHandler() {
    showVideoEditorExample()
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
      <Button title="Edit Video" onPress={editVideoHandler} />
    </View>
  )
}

export default VideoPickerComponent2
