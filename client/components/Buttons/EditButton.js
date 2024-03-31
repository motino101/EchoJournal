import { Button, ButtonIcon } from '@gluestack-ui/themed';
import { Pencil } from 'lucide-react-native';
import themeColors from '../../styles/themes';

/**
 * EditButton Component
 *
 * A reusable button meant for editing content.
 *
 * @owner Alex Zhang
 *
 * @returns A React element representing the EditButton component.
 */
export default function EditButton(props) {
  return (
    <Button
      borderRadius='$full'
      size='xs'
      width='13%'
      bgColor={themeColors.main}
      p='$3.5'
      {...props}
    >
      <ButtonIcon
        size='lg'
        as={Pencil}
      />
    </Button>
  );
}
