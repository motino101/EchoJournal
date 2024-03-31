import { useContext, useEffect, useState } from 'react';
import { Audio } from 'expo-av';
import themeColors from '../styles/themes';
import {
  VStack,
  Heading,
  CircleIcon,
} from '@gluestack-ui/themed';
import DiscardSaveButtonBar from '../components/Buttons/DiscardSaveButtonBar';
import { useNavigation } from '@react-navigation/native';
import DefaultScreen from '../components/DefaultScreen';
import {
  ECHO_ROOT_DIR,
  BACKEND_HOST,
  createDescriptionFileForEchoEntryInDirectory,
  createEchoJournalDirectory,
  createTitleFileForEchoEntryInDirectory,
  moveFileForEchoEntry,
  readEchoEntriesFromLocalStorage,
  createTranscriptFileForEchoEntryInDirectory,
  createSummaryFileForEchoEntryInDirectory,
  createQuoteFileForEchoEntryInDirectory,
  createSentimentFileForEchoEntryInDirectory,
} from '../utils/localStorageUtils';
import EditableEntryDescription from '../components/EditableEntryDescription';
import RecordButton from '../components/Buttons/RecordButton';
import { AppContext } from '../AppContextProvider';
import { getRandomJournalingPrompt } from '../utils/journalPromptUtils';
import Spacer from '../components/Spacer';



/**
 * RecordScreen Component
 *
 * A screen meant to allow users to record a new journal entry.
 *
 * @owner Anna Hudson
 *
 * @returns None
 */
export default function RecordScreen() {
  // state for the current recording object
  const [recording, setRecording] = useState(undefined);

  // state for the URI of the latest finished recording that should be saved if the user hits "Save"
  const [recordingToBeSavedUri, setRecordingToBeSavedUri] = useState('');

  // state for whether the user is currently recording
  const [isRecording, setIsRecording] = useState(false);

  // state for the text the user might want to type
  const [editedDescription, setEditedDescription] = useState('');

  const [journalPrompt, setJournalPrompt] = useState('');

  const { journalData, setJournalData } = useContext(AppContext);

  // whenever journalData changes (after the user saves a new entry), we should change the journal prompt
  useEffect(() => {
    setJournalPrompt(getRandomJournalingPrompt());
  }, [journalData]); 

  // navigation object
  const navigation = useNavigation();

  // handles changes to the text the user might want to type
  const handleDescriptionChange = (text) => {
    setEditedDescription(text);
  };

  // handles when the discard button is pressed
  const handleDiscardButtonPress = () => {
    setRecording(undefined);
    setIsRecording(false);
    setEditedDescription('');
    setRecordingToBeSavedUri('');
    navigation.navigate('ListView');
  };

  const { setLoadingEntries, loadingEntries} = useContext(AppContext);

  /**
   * handles when the save button is pressed
   *
   * 1) we should create a folder with the current timestamp,
   * 2) we should save the recording to that folder
   * 3) we should save a title to that folder
   * 4) we should save a description to that folder
   * 5) we should upload the recording to the backend
   * 6) we should reset the state of the recording screen
   * 7) we should navigate to ListView
   */
  const handleSaveButtonPress = async () => {

    console.log("handleSaveButtonPress entered...")

    setLoadingEntries([...loadingEntries, Date.now()]);

    try {
    // echo entries are stored in a directory named as the time of creation (Date.now())
    const directoryPath = ECHO_ROOT_DIR + Date.now();

    // create a folder with the current timestamp,
    await createEchoJournalDirectory(directoryPath);
    // move the recording to the correct folder
    const recordingDestinationUri = directoryPath + '/recording.m4a';
    await moveFileForEchoEntry(recordingToBeSavedUri, recordingDestinationUri);
    console.log("recording moved to " + recordingDestinationUri);

    const entryTitle = new Date().toLocaleDateString(); // Creates a string of the current date

    // Write title.txt
    await createTitleFileForEchoEntryInDirectory(
      directoryPath,
      "Entry on " + entryTitle
    );
    // Write description.txt
    await createDescriptionFileForEchoEntryInDirectory(
      directoryPath,
      editedDescription
    );
    console.log("title and description written to " + directoryPath);

    // re-fetch state and get state again
    const state = await readEchoEntriesFromLocalStorage();
    setJournalData(state);

    // the save button is disabled if either the description and the recordingURI are empty strings
    // clear both states to disable the save button the next time the user comes back this screen
    setRecordingToBeSavedUri('');
    setEditedDescription('');

    // navigate to ListView
    navigation.navigate('ListView');

    // send post request to backend, receive trascription
    let formData = new FormData();
    formData.append('file', {
      uri: recordingDestinationUri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    });
    formData.append('description', editedDescription)
    console.log("formData: " + formData)

    // fetch transcript, summary, quote, and sentiment for entry
    await fetch(BACKEND_HOST + '/analyze', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then(async(entry_analysis) => {
        console.log("entry_analysis: " + entry_analysis)
        for (const [key, value] of Object.entries(entry_analysis)) {
          console.log(`${key}: ${value} (Type: ${typeof value})`);
        }
        createTranscriptFileForEchoEntryInDirectory(directoryPath, entry_analysis.transcript)
        createSummaryFileForEchoEntryInDirectory(directoryPath, entry_analysis.summary)
        createQuoteFileForEchoEntryInDirectory(directoryPath, entry_analysis.quote)
        createSentimentFileForEchoEntryInDirectory(directoryPath, entry_analysis.sentiment)

        // re-fetch state and get state again
        const state = await readEchoEntriesFromLocalStorage();
        setJournalData(state);
      })
      .catch((err) => console.log("Error in fetching analysis: " + err));
    
      // remove loading state
      setLoadingEntries(loadingEntries.filter((entry) => entry !== Date.now()));
    } catch(error) {
      console.error("Error in handleSaveButtonPress: " + error);
      setLoadingEntries(loadingEntries.filter((entry) => entry !== Date.now()));
    }
  };

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status === 'granted') {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setRecording(recording);
      }
    } catch (err) {}
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();
    setRecordingToBeSavedUri(uri);
    console.log("the latest recording's URI is " + uri);
  }

  // TODO: currently not used
  const pickImage = async () => {
    let image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      selecteds: ["spag.jpg"],
    });

    if (!image.cancelled) {
      setSelectedImage(image);
      
      // Move file to echo_entries folder, named by timestamp
      try {
        image_file_uri = image.assets[0].uri;
        if (!(await FileSystem.getInfoAsync(directoryPath)).exists) {
          await FileSystem.makeDirectoryAsync(directoryPath);
        }
        new_image_file_uri = directoryPath + '/image.jpg';
        moveFileForEchoEntry(image_file_uri, new_image_file_uri)
      }
      catch (err) {
        console.log("Error in storing image: " + err);
      }
    }
  };

  return (
    <DefaultScreen>
      <VStack alignItems='flex-start'>
        <Spacer height='8%' />
        <VStack
          id='header-and-entry'
          space='md'
          w='100%'
        >
          <DiscardSaveButtonBar
            discardButtonProps={{
              discardButtonElementProps: { onPress: handleDiscardButtonPress },
              discardButtonTextProps: { fontSize: 10 },
            }}
            saveButtonProps={{
              // enable only if audio and text are both entered
              isDisabled:
                editedDescription === '' && recordingToBeSavedUri === '',
              onPress: handleSaveButtonPress,
            }}
          />

        
        <Spacer height='5%' />
          <Heading
            fontWeight='$semibold'
            fontSize='$3xl'
          >
            How was your day?
          </Heading>
          {/* {getRecordingLines()} */}
          <EditableEntryDescription
            textareaInputProps={{
              placeholder: journalPrompt,
              color: '$textDark600',
              value: editedDescription,
              onChangeText: handleDescriptionChange,
            }}
          ></EditableEntryDescription>
        </VStack>
        <RecordButton
          buttonProps={{
            bgColor: isRecording ? themeColors.darkBlue : themeColors.main,
            onPress: () => {
              if (isRecording) {
                stopRecording();
                setIsRecording(false);
              } else {
                startRecording();
                setIsRecording(true);
              }
            },
          }}
          buttonIconProps={{
            as: CircleIcon,
          }}
        />
      </VStack>
    </DefaultScreen>
  );
}
