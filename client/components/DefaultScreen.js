import { VStack } from '@gluestack-ui/themed';
export default function DefaultScreen({ children, ...props }) {
  return (
    <VStack
      bg='$backgroundDark900'
      pt='10%'
      p='3%'
      h='100%'
      w='100%'
      {...props}
    >
      {children}
    </VStack>
  );
}
