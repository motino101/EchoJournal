import React, { useState, useEffect } from 'react';
import {
  ButtonIcon,
  ButtonText,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Button,
  Text,
  HStack,
} from '@gluestack-ui/themed';
import { Pause, Play, RotateCcw } from 'lucide-react-native';
import { Audio } from 'expo-av';
import Spacer from './Spacer';
import DefaultScreen from './DefaultScreen';
import themeColors from '../styles/themes';

/**
 * RecordingGroup Component
 *
 * A component for playing audio recordings with playback controls and a seek bar.
 *
 * @owner Alex Zhang
 *
 * @param {string} recordingUrl The URL of the audio recording to be played.
 *
 * @returns A React element representing the RecordingGroup component.
 */
export default function RecordingGroup({ recordingUrl }) {
  const [soundAndStatus, setSoundAndStatus] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);

  useEffect(() => {
    const loadSound = async () => {
      const { sound, status } = await Audio.Sound.createAsync({
        uri: recordingUrl,
      });
      setSoundAndStatus({ sound, status });
      console.log('loaded sound at ' + recordingUrl);
      console.log(status.durationMillis);

      sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate); // Set playback status update listener
    };

    loadSound();

    return () => {
      if (soundAndStatus.sound) {
        soundAndStatus.sound.unloadAsync();
      }
    };
  }, [recordingUrl]);

  const togglePlayback = async () => {
    if (!soundAndStatus.sound) return;

    if (!isPlaying) {
      const { sound, status } = soundAndStatus;

      // Check if playback reached the end
      if (status.positionMillis >= status.durationMillis) {
        // Rewind to the beginning
        await sound.setPositionAsync(0);
      }

      // Start playing
      await sound.playAsync();
    } else {
      // Pause playback
      await soundAndStatus.sound.pauseAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded && !status.isBuffering) {
      setPlaybackPosition(
        (status.positionMillis / status.durationMillis) * 100
      );
    }

    // Check if playback reached the end
    if (status.positionMillis >= status.durationMillis) {
      // Pause playback and set isPlaying to false
      setIsPlaying(false);
    }
  };

  // value is an integer ranging from [0, 100]
  const handleSliderChange = (value) => {
    setPlaybackPosition(value);
  };

  // seek to the beginning of the recording and set state to paused.
  const seekToBeginning = async () => {
    await soundAndStatus.sound.pauseAsync();
    soundAndStatus.sound.setPositionAsync(0);
    setIsPlaying(false);
  };

  return (
    <DefaultScreen alignItems='center'>
      <Slider
        defaultValue={0}
        size='md'
        orientation='horizontal'
        isDisabled={false}
        isReversed={false}
        value={playbackPosition}
        onChange={handleSliderChange}
        bgColor='gray'
      >
        <SliderTrack bg="gray">
          <SliderFilledTrack/>
        </SliderTrack>
        <SliderThumb bg={themeColors.main} />
      </Slider>
      <Spacer height='5%' />
      <HStack
        style={{ container: { flex: 1 } }}
        space='lg'
      >
        <Button onPress={seekToBeginning} bgColor={themeColors.main}>
          <ButtonIcon as={RotateCcw} />
        </Button>
        <Button onPress={togglePlayback} bgColor={themeColors.main}>
          <ButtonIcon as={isPlaying ? Pause : Play} />
        </Button>
      </HStack>
    </DefaultScreen>
  );
}
