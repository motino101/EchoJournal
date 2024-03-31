import { Heading, Button, ButtonText, set } from '@gluestack-ui/themed';
import DefaultScreen from '../components/DefaultScreen';
import { BACKEND_HOST, clearEchoEntries, readEchoEntriesFromLocalStorage } from '../utils/localStorageUtils';
import { useState, useEffect } from 'react';
import ReadonlyEntryDescription from '../components/ReadonlyEntryDescription';
import Spacer from '../components/Spacer';
import themeColors from '../styles/themes';
import { LinearGradient } from 'react-native-linear-gradient';

export default function WidgetView() {

  const [highlightSummaryComponent, setHighlightSummaryComponent] = useState('');
  const [highlightQuoteComponent, setHighlightQuoteComponent] = useState('');

  const handleHighlight = async () => {
    const entries = await readEchoEntriesFromLocalStorage();
    console.log("ENTRIES", entries)
    let summaries = []
    let quotes = []
    for (const entry of entries) {
      summaries.push(entry["data"]["summary"])
      quotes.push(entry["data"]["quote"])
    }

    let formData = new FormData();
    console.log("Summaries: ", summaries);
    formData.append("summaries", JSON.stringify(summaries));
    formData.append("quotes", JSON.stringify(quotes));

    await fetch(BACKEND_HOST + '/highlight', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then(data => {
        console.log("Highlight:", data)
        setHighlightSummaryComponent(<ReadonlyEntryDescription text={data["summary"]} />);
        setHighlightQuoteComponent(<ReadonlyEntryDescription text={data["quote"]} />);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

  }

  // when navigate to this page, do handleHighlight
  useEffect(() => {
    handleHighlight();
  }
    , []); // Empty dependency array ensures the useEffect runs only once on mount


  const gradientBox = {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: themeColors.main,
    padding: 10,
    margin: 8,
  }

  return (
    <DefaultScreen>
      <Spacer height='5%' />
      <Heading>Your Week</Heading>
      <Spacer height='1%' />
      <LinearGradient
        colors={[themeColors.darkBlue, themeColors.purple]}
        // style={styles.gradient}
        start={{ x: 0, y: 0 }} // Gradient starts at the top-left corner
        end={{ x: 1, y: 1 }} // And ends at the bottom-left corner
        style={gradientBox}
      >
        <Heading>Highlight from Your Week ☀️</Heading>
        {highlightSummaryComponent
          ? highlightSummaryComponent
          : <ReadonlyEntryDescription text="Loading..." />
        }
      </LinearGradient>
      <LinearGradient
        colors={[themeColors.darkBlue, themeColors.purple]}
        // style={styles.gradient}
        start={{ x: 0, y: 0 }} // Gradient starts at the top-left corner
        end={{ x: 1, y: 1 }} // And ends at the bottom-left corner
        style={gradientBox}
      >
        <Heading>Quote from You 📝</Heading>
        {highlightQuoteComponent
          ? highlightQuoteComponent
          : <ReadonlyEntryDescription text="Loading..." />
        }
      </LinearGradient>
      <Spacer height='5%' />

      <Spacer height='5%' />
      {/* <Button onPress={() => clearEchoEntries()}>
        <ButtonText>DELETE ECHO ENTRIES FOLDER</ButtonText>
      </Button> */}
    </DefaultScreen>
  );
}
