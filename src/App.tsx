import { StatusBar } from 'expo-status-bar'
import { ReactElement, useEffect, useState } from 'react'
import { Button, Dimensions, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import AudioPicker from './components/audio-picker/audio-picker'

// import VideoPickerComponent2 from './components/video-picker/video-picker-2'
// Custom Modules
import CustomModule1 from './CustomModules'

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

export default function App(): ReactElement {
  const [deviceId, setDeviceId] = useState('')

  // function handleResult(result: any) {
  //   console.log("result:", result)
  // }

  useEffect(() => {
    const fetchDeviceId = async () => {
      const id = await CustomModule1.getDeviceId()
      setDeviceId(id)
    }
    fetchDeviceId()
  }, [])

  function androidToastHandler() {
    CustomModule1.showToast()
  }

  return (
    // <SafeAreaProvider>
    <>
      <StatusBar />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>OneLife.City! - {deviceId}</Text>
        <Button title="Android Toast" onPress={androidToastHandler} />
        <AudioPicker />
        {/* <VideoPickerComponent2 handleResult={handleResult} /> */}
        {/* <Text style={styles.emoji}>😻</Text> */}
      </SafeAreaView>
    </>
    // </SafeAreaProvider>
  )
}
