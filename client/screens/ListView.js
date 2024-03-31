import {
  Input,
  InputField,
  VStack,
  Image,
  Text,
  Spinner,
  ScrollView,
  InputSlot,
  HStack,
  InputIcon,
  SearchIcon,
} from "@gluestack-ui/themed";
import { useContext } from "react";
import { AppContext } from "../AppContextProvider";
import Spacer from "../components/Spacer";
import ListViewItem from "../components/ListViewItem";
import DefaultScreen from "../components/DefaultScreen";
import { Scroll } from "lucide-react-native";

export default function ListView({ navigation }) {
  const { journalData, loadingEntries } = useContext(AppContext);

  const handleEntryPress = (index) => {
    navigation.navigate("EntryView", { selectedIndex: index });
  };

  console.log("loading entries:", loadingEntries);

  return (
    <DefaultScreen>
      <Spacer height="5%" />
      {/* <Text fontWeight="$semibold" fontSize="$2xl">
        Echo
      </Text> */}



      <Spacer height="2%" />
      <VStack>
        <HStack >
          <Image
            size="xs" borderRadius="$none"
            source={require('../assets/echologo1.png')}
          />
          <Spacer width="5%" />
          <Input
            variant="outline"
            size="md"
            flex={1}
            borderRadius={50}
            isDisabled={false}
            isInvalid={false}
            isReadOnly={false}

          >
            <InputSlot pl="$3">
              <InputIcon as={SearchIcon} />
            </InputSlot>
            <InputField placeholder="Search Memories" />
          </Input>
        </HStack>

        <Spacer height="2%" />
        <ScrollView>
          {loadingEntries.length > 0 ? (
            <VStack alignItems="center" h="100%" gap={5}>
              <Spacer height="5%" />
              <Spinner />
              <Text>Analyzing your entry...</Text>
            </VStack>
          ) : (
            journalData.map((entry, index) => (
              <ListViewItem
                entry={entry.data}
                index={index}
                handleEntryPress={handleEntryPress}
                key={index}
              />
            ))
          )}
        </ScrollView>
      </VStack>
    </DefaultScreen>
  );
}
