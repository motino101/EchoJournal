import React, { useContext, useEffect, useState } from 'react';
import { Box, Text, Card, Divider, Heading, Badge, BadgeIcon, BadgeText, GlobeIcon, View, ScrollView } from '@gluestack-ui/themed';

import { AppContext } from '../AppContextProvider';
import { StyleSheet } from 'react-native';
import DefaultScreen from '../components/DefaultScreen';
import ReadonlyEntryTitle from '../components/ReadonlyEntryTitle';
import EditableEntryTitle from '../components/EditableEntryTitle';
import ReadonlyEntryDescription from '../components/ReadonlyEntryDescription';
import EditableEntryDescription from '../components/EditableEntryDescription';
import Spacer from '../components/Spacer';
import DiscardSaveButtonBar from '../components/Buttons/DiscardSaveButtonBar';
import BackEditButtonBar from '../components/Buttons/BackEditButtonBar';
import RecordingGroup from '../components/RecordingGroup';
import themeColors from '../styles/themes';
import { LinearGradient } from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  ECHO_ROOT_DIR,
  createDescriptionFileForEchoEntryInDirectory,
  createTitleFileForEchoEntryInDirectory,
  readEchoEntriesFromLocalStorage,
} from '../utils/localStorageUtils';
import summaryBox from '../components/summaryBox';


/**
 * EntryView Component
 *
 * A reusable card component with customizable styles.
 *
 * @owner Alex Zhang
 *
 * @param [props.route.params.selectedIndex] the index of the journal entry that was selected in ListView, for which we should render the entry
 *
 * @returns A React element representing the EntryView component.
 */
export default function EntryView({
  route: {
    params: { selectedIndex },
  },
}) {
  const { journalData, setJournalData } = useContext(AppContext);

  const navigation = useNavigation();

  const [isEditing, setIsEditing] = useState(false);

  const selectedEntry = journalData[selectedIndex].data;

  const [editedTitle, setEditedTitle] = useState(selectedEntry.title);
  const [editedDescription, setEditedDescription] = useState(
    selectedEntry.description
  );
  const [editedTranscript, setEditedTranscript] = useState(
    selectedEntry.transcript
  );
  const [editedSummary, setEditedSummary] = useState(selectedEntry.summary);
  const [editedQuote, setEditedQuote] = useState(selectedEntry.quote);
  const [editedSentiment, setEditedSentiment] = useState(
    selectedEntry.sentiment
  );

  // we need this because the component never gets destroyed, only called with new props, so react never bothers to set or refresh the state because it thinks it’s the same object. remember that useState only happens on initial mount. we must manually trigger a setState call by subscribing to changes to the prop.
  useEffect(() => {
    console.log("selectedIndex is: " + selectedIndex);
    console.log("selectedEntry is: " + selectedEntry);
    for (const [key, value] of Object.entries(selectedEntry)) {
      console.log(`${key}: ${value} (Type: ${typeof value})`);
    }
    setEditedTitle(selectedEntry.title);
    setEditedDescription(selectedEntry.description);
    setEditedTranscript(selectedEntry.transcript);
    setEditedSummary(selectedEntry.summary);
    setEditedQuote(selectedEntry.quote);
    setEditedSentiment(selectedEntry.sentiment);
  }, [selectedIndex]);

  const handleTitleChange = (text) => {
    setEditedTitle(text);
  };

  const handleDescriptionChange = (text) => {
    setEditedDescription(text);
  };

  const handleTranscriptChange = (text) => {
    setEditedTranscript(text);
  };

  const handleSummaryChange = (text) => {
    setEditedSummary(text);
  };

  const handleQuoteChange = (text) => {
    setEditedQuote(text);
  };

  const handleSentimentChange = (text) => {
    setEditedSentiment(text);
  };

  const handleSaveButtonPress = async () => {
    const updatedJournalData = [...journalData];
    updatedJournalData[selectedIndex].data = {
      ...selectedEntry,
      title: editedTitle,
      description: editedDescription,
    };

    directoryPath = ECHO_ROOT_DIR + journalData[selectedIndex].directory;
    console.log("directoryPath is: " + directoryPath);

    // write edited texts
    await createTitleFileForEchoEntryInDirectory(directoryPath, editedTitle);
    await createDescriptionFileForEchoEntryInDirectory(
      directoryPath,
      editedDescription
    );

    // set state
    const state = await readEchoEntriesFromLocalStorage();
    setJournalData(state);

    // the user is no longer editing
    setIsEditing(false);
  };

  const handleBackButtonPress = () => {
    navigation.navigate("ListView");
  };

  const handleEditButtonPress = () => {
    setIsEditing(!isEditing);
  };

  const TitleComponent = isEditing ? (
    <EditableEntryTitle onChangeText={handleTitleChange} value={editedTitle} />
  ) : (
    <ReadonlyEntryTitle text={editedTitle} />
  );

  const DescriptionComponent = isEditing ? (
    <EditableEntryDescription
      textareaInputProps={{
        onChangeText: handleDescriptionChange,
        value: editedDescription,
      }}
    />
  ) : (
    <ReadonlyEntryDescription text={editedDescription} />
  );

  const fetchTranscript = async (audioId) => {
    try {
      const response = await fetch(`${BACKEND_HOST}/get-transcript`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ audioId }),
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      return data.transcript;
    } catch (error) {
      console.error("Error fetching transcript:", error);
      return ""; // Return empty string or handle error appropriately
    }
  };

  const TranscriptComponent = isEditing ? (
    <EditableEntryDescription
      textareaInputProps={{
        onChangeText: handleTranscriptChange,
        value: editedTranscript,
      }}
    />
  ) : (
    <ReadonlyEntryDescription text={editedTranscript} />
  );

  const SummaryComponent = isEditing ? (
    <EditableEntryDescription
      textareaInputProps={{
        onChangeText: handleSummaryChange,
        value: editedSummary,
      }}
    />
  ) : (
    // <ReadonlyEntryDescription text={editedSummary} />
    summaryBox({ text: editedSummary })
  );

  const QuoteComponent = isEditing ? (
    <EditableEntryDescription
      textareaInputProps={{
        onChangeText: handleQuoteChange,
        value: editedQuote,
      }}
    />
  ) : (
    // <ReadonlyEntryDescription text={editedQuote} />
    <View style={styles.quoteBox}>
      <Text style={styles.quoteText}>
        " {editedQuote} "
      </Text>
      <Text style={styles.authorText}>
        - You
      </Text>
    </View>
  );

  const SentimentComponent = isEditing ? (
    <Badge size="md" variant="solid" borderRadius="$none" action="info">
      <BadgeText>New feature</BadgeText> // TODO: Add editable component
      <EditableEntryDescription
        textareaInputProps={{
          onChangeText: handleSentimentChange,
          value: editedSentiment,
        }}
      />
      <BadgeIcon as={GlobeIcon} ml="$2" />
    </Badge>
  ) : (
    <Badge size="md" variant="outline" borderRadius="$md" action="info" backgroundColor='transparent'>
      <BadgeText>{editedSentiment}</BadgeText>
      <BadgeIcon as={GlobeIcon} ml="$2" />
    </Badge>
  );

  const ButtonComponent = isEditing ? (
    <DiscardSaveButtonBar
      saveButtonProps={{ onPress: handleSaveButtonPress }}
    />
  ) : (
    <BackEditButtonBar
      backButtonProps={{ onPress: handleBackButtonPress }}
      editButtonProps={{ onPress: handleEditButtonPress }}
    />
  );

  return (
    <DefaultScreen>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          flex: 1,
          // justifyContent: 'space-between',
          paddingBottom: 100,
        }}
        >
      {ButtonComponent}
      <Spacer height="2%" />
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        {TitleComponent}
      </Box>
      <Spacer height='2%' />
      <Divider my="$0.5" bg="$trueGray600" />

      <Spacer height='2%' />
      <LinearGradient
      colors={[themeColors.darkBlue, themeColors.purple]} 
      // style={styles.gradient}
      start={{x: 0, y: 0}} // Gradient starts at the top-left corner
      end={{x: 1, y: 1}} // And ends at the bottom-left corner
      style={
        {
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: 10,
          backgroundColor: themeColors.main,
          padding: 10,
          margin: 8,
        }}
    >
        <Spacer height='2%' />
        {SentimentComponent}
        <Spacer height='2%' />
        {SummaryComponent}
        <Spacer height='2%' />
      </LinearGradient>

      <Spacer height='2%' />
      <Heading>About Your Day</Heading>

      <Spacer height='1%' />
      {DescriptionComponent}

      <Spacer height='2%' />
      <Divider my="$0.5" bg="$trueGray600" />

      <Spacer height='2%' />
      <Heading>Highlighted Quote</Heading>

      <Spacer height='1%' />
      {QuoteComponent}

      <Spacer height='2%' />
      <Divider my="$0.5" bg="$trueGray600" />

      <Spacer height='2%' />
      <Heading>Playback</Heading>

      <Spacer height='1%' />
      {TranscriptComponent}

      <RecordingGroup recordingUrl={selectedEntry.recording} />



      {/* <Spacer height='200%' /> */}
      </ScrollView>
    </DefaultScreen>
  );
}

const styles = StyleSheet.create({
  quoteBox: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // backgroundColor: '#004D40', // Changed the background color
    padding: 20,
    margin: 5,
    borderWidth: 1, // Added border width
    borderColor: 'lightblue', // Added border color for the outline
  },
  quoteText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic', // Make the quote italic
    fontWeight: 'bold', // Additionally, make the quote bold
  },
  authorText: {
    color: '#ddd',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic', // Make the author's name italic
  },
});