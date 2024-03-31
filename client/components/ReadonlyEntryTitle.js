import { Text } from '@gluestack-ui/themed';

export default function ReadonlyEntryTitle({ text }) {
  return (
    <Text
      fontWeight='bold'
      size='2xl'
    >
      {text}
    </Text>
  );
}
