import { Text, Card, Heading } from "@gluestack-ui/themed";

export default function summaryBox({ text }) {
    return <Heading mb="$1" size="md">
    {text}
  </Heading>
}