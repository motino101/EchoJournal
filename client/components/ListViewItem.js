import { Pressable, Box, HStack, Text } from "@gluestack-ui/themed";

export default function ListViewItem({ entry, index, handleEntryPress }) {
  if (entry === undefined) return null;
  return (
    <Pressable key={index} onPress={() => handleEntryPress(index)}>
      <Box
        bg="$backgroundDark800"
        borderRadius={10}
        padding={10}
        marginVertical={5}
      >
        <HStack justifyContent="space-between">
          <Text fontWeight="$bold">{entry.title}</Text>
          {/* <Text color="$textDark500">{entry.date}</Text> */}
        </HStack>
        <Text fontWeight="$light">
          {entry.description.length > 50
            ? entry.description.substring(0, 50) + "..."
            : entry.description}
        </Text>
      </Box>
    </Pressable>
  );
}
