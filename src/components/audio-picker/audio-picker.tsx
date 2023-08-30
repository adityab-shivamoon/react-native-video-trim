// import * as FileSystem from 'expo-file-system';
import { Ionicons } from '@expo/vector-icons'
import { Audio, AVPlaybackStatus } from 'expo-av'
import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

// const audioUrl = "https://samplelib.com/lib/preview/mp3/sample-15s.mp3";

export default function AudioPicker() {
  const maxDbFS = 0 // as seen in expo docs (Decibel range from -160 to 0)
  const inputMin = 1e-8
  const inputMax = 1
  const outputMin = 3
  const outputMax = 100
  const [recording, setRecording] = useState<Audio.Recording | null>(null)
  const [recordingAudioUri, setRecordingAudioUri] = useState<string | null>(null)
  const [recordingStatus, setRecordingStatus] = useState<any>('idle')
  const [recordingDuration, setRecordingDuration] = useState<number>(0)
  const [playingAudioDuration, setPlayingAudioDuration] = useState<number>(0)
  const [audioPermission, setAudioPermission] = useState<boolean | null>(null)
  const [isAudioBeingPlayed, setIsAudioBeingPlayed] = useState<boolean>(false)
  const [audioSound, setAudioSound] = useState<Audio.Sound | null>(null)
  const [timerFlag, setTimerFlag] = useState<boolean>(false)
  const recordingTimer = 30000 //audio not greater than 30s
  const recordingTimerFunction = useRef<NodeJS.Timeout | null>(null)
  const [waveformAmplitudeArray, setWaveformAmplitudeArray] = useState<number[]>([])

  useEffect(() => {
    // Simply get recording permission upon first render
    async function getPermission() {
      await Audio.requestPermissionsAsync()
        .then((permission) => {
          // console.log("Permission Granted: " + permission.granted);
          setAudioPermission(permission.granted)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    // Call function to get permission
    getPermission()
    // Cleanup upon first render
    return () => {
      if (recording) {
        stopRecording()
      }
    }
  }, [])

  // function range 1e-8 to 1 (-160 to 0 Db values)
  const decibelToAmplitude = (decibelValue: number) => {
    return Math.pow(10, decibelValue / 20) * Math.pow(10, maxDbFS / 20)
  }

  // convert amp values in a particular range
  const scaleValueToRange = (value: number) => {
    const normalizedValue = (value - inputMin) / (inputMax - inputMin)
    const scaledValue = normalizedValue * (outputMax - outputMin) + outputMin
    return scaledValue
  }

  async function recordingStatusHandler(status: Audio.RecordingStatus) {
    if (status.canRecord) {
      if (status && status.metering) {
        const newValue = scaleValueToRange(decibelToAmplitude(status.metering))
        console.log('status:', status.metering, newValue)
        setWaveformAmplitudeArray((prevValues) => {
          return [...prevValues, newValue]
        })
      }
      // console.log("dur1 :", status.durationMillis);
      setRecordingDuration(Math.round(status.durationMillis / 1000))
    } else if (status.isDoneRecording) {
      // Done Recording
      // console.log("stats:", status.isDoneRecording, status);
    }
  }

  const startRecording = async () => {
    // clear waveform array
    setWaveformAmplitudeArray([])
    try {
      // needed for IoS
      if (audioPermission) {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true
        })
      }
      setAudioSound(null)
      const newRecording = new Audio.Recording()
      console.log('Starting Recording')
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY)
      await newRecording.startAsync()
      setRecordingStatus('recording')
      setRecording(newRecording)
      newRecording.setOnRecordingStatusUpdate(recordingStatusHandler)
      stopRecordingAfter30Seconds()
    } catch (error) {
      console.error('Failed to start recording', error)
    }
  }

  function stopRecordingAfter30Seconds() {
    // console.log("timer function is.........", recordingTimerFunction.current);
    if (recordingTimerFunction.current) {
      clearTimeout(recordingTimerFunction.current)
      recordingTimerFunction.current = null
    }
    // Using bind with a closure
    recordingTimerFunction.current = setTimeout(
      function (value: boolean) {
        if (!value) {
          // console.log("Timeout function executed");
          setTimerFlag(true)
        }
      }.bind(null, timerFlag),
      recordingTimer
    )
  }

  useEffect(() => {
    if (timerFlag) {
      setTimerFlag(false)
      stopRecording()
    } else {
      if (recordingTimerFunction.current) {
        // console.log(".......cleared Timeout 3...........")
        clearTimeout(recordingTimerFunction.current)
        recordingTimerFunction.current = null
      }
    }
  }, [timerFlag])

  const stopRecording = async () => {
    // clear timeout
    setTimerFlag(false)

    try {
      if (recording && recordingStatus === 'recording') {
        console.log('Stopping Recording')
        setRecordingDuration(0)
        await recording.stopAndUnloadAsync()
        const recordingUri = recording.getURI()
        if (recordingUri) {
          setRecordingAudioUri(recordingUri)
          const playbackObject = new Audio.Sound()
          await playbackObject.loadAsync({ uri: recordingUri })
          setAudioSound(playbackObject)
        } else {
          setRecordingAudioUri(null)
          setAudioSound(null)
        }
        // Create a file name for the recording
        // const fileName = `recording-${Date.now()}.caf`;

        // Move the recording to the new directory with the new file name
        // await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'recordings/', { intermediates: true });
        // await FileSystem.moveAsync({
        //   from: recordingUri,
        //   to: FileSystem.documentDirectory + 'recordings/' + `${fileName}`
        // });

        // resert our states to record again
        setRecording(null)
        setRecordingStatus('stopped')
        return recordingUri
      }
    } catch (error) {
      setAudioSound(null)
      console.error('Failed to stop recording', error)
      return null
    }
  }

  async function playbackStatusHandler(status: AVPlaybackStatus) {
    // console.log("playback status:", status);
    if (!status.isLoaded) {
      // Handle error or unloaded state if needed
      return
    }
    // how much is audio being played
    // console.log("dur:", status.positionMillis);
    setPlayingAudioDuration(Math.round(status.positionMillis / 1000))
    if (audioSound && !status.isPlaying && status.didJustFinish) {
      // Audio playback has finished, so reset the position to the beginning
      setIsAudioBeingPlayed(false)
      await audioSound.setPositionAsync(0)
    }
  }

  async function playRecording() {
    console.log('arr len:', waveformAmplitudeArray.length)
    if (recordingAudioUri && recordingStatus === 'stopped' && audioSound) {
      if (!isAudioBeingPlayed) {
        // await playbackObject.loadAsync({ uri: FileSystem.documentDirectory + 'recordings/' + `${fileName}` });
        // await playbackObject.loadAsync({ uri: audioUri });
        setIsAudioBeingPlayed(true)
        await audioSound.playAsync()
        audioSound.setOnPlaybackStatusUpdate(playbackStatusHandler)
      } else {
        // pause audio
        await audioSound.pauseAsync()
        setIsAudioBeingPlayed(false)
      }
    }
  }

  async function handleRecordButtonPress() {
    if (recording) {
      const audioUri = await stopRecording()
      if (audioUri) {
        console.log('Saved audio file to', audioUri)
      }
    } else {
      if (!isAudioBeingPlayed) {
        await startRecording()
      }
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={handleRecordButtonPress}>
        <Ionicons
          name={recording ? 'mic-outline' : 'mic-circle-outline'}
          color={'white'}
          size={64}
        />
      </TouchableOpacity>
      {recordingDuration > 0 ? (
        <Text style={styles.recordingStatusText}>{`${recordingDuration}s`}</Text>
      ) : (
        <Text style={styles.recordingStatusText}>Tap on the Mic to start Recording</Text>
      )}
      <View style={styles.playSoundView}>
        <TouchableOpacity style={styles.button2} onPress={playRecording}>
          <Ionicons
            name={isAudioBeingPlayed ? 'pause-outline' : 'play-outline'}
            color={'black'}
            size={24}
          />
        </TouchableOpacity>
        {/* <Text style={styles.recordingStatusText2}>
          {isAudioBeingPlayed ? "Pause" : "Play"}
        </Text> */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 10
          }}
        >
          {waveformAmplitudeArray.map((barHeight, index) => (
            <View key={index} style={[styles.soundBars, { height: barHeight }]} />
          ))}
        </View>
        {isAudioBeingPlayed && (
          <Text style={styles.recordingStatusText2}>{`${playingAudioDuration}s`}</Text>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: 'red'
  },
  button2: {
    alignItems: 'center',
    marginHorizontal: 10
  },
  recordingStatusText: {
    marginVertical: 16,
    textAlign: 'center',
    marginHorizontal: 10
  },
  recordingStatusText2: {
    textAlign: 'center',
    marginHorizontal: 10
  },
  playSoundView: {
    // minWidth: "100%",
    // maxWidth: "100%",
    height: 30,
    backgroundColor: '#d3d3d3',
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10
  },
  soundBars: {
    width: 3,
    margin: 1,
    backgroundColor: 'black'
  }
})
