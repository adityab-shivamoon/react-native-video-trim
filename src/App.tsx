import { StatusBar } from 'expo-status-bar'
import { ReactElement } from 'react'
import { Dimensions, StyleSheet, Text } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import AudioPicker from './components/audio-picker/audio-picker'

// import VideoPickerComponent2 from './components/video-picker/video-picker-2'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: Dimensions.get('window').width,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    marginBottom: 8
  },
  emoji: {
    fontSize: 82,
    marginBottom: 24
  }
})

function handleResult(result: any) {
  // console.log("result:", result)
}

export default function App(): ReactElement {
  return (
    // <SafeAreaProvider>
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        {/* <Text style={styles.text}>OneLife.City!</Text> */}
        <AudioPicker />
        {/* <VideoPickerComponent2 handleResult={handleResult} /> */}
        {/* <Text style={styles.emoji}>😻</Text> */}
      </SafeAreaView>
    </>
    // </SafeAreaProvider>
  )
}
