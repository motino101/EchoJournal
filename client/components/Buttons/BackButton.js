import { Button, ButtonIcon } from '@gluestack-ui/themed';
import { ChevronLeft } from 'lucide-react-native';

/**
 * BackButton Component
 *
 * A reusable button meant for going back to the previous page.
 *
 * @owner Anna Hudson
 *
 * @returns A React element representing the BackButton component.
 */
export default function DiscardButton(props) {
  return (
    <Button
      size='xl'
      variant='link'
      // action='primary'
      color='white'
      isDisabled={false}
      isFocusVisible={false}
      {...props}
    >
      <ButtonIcon as={ChevronLeft} />
    </Button>
  );
}
