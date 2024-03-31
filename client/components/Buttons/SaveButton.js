import { Button, ButtonText } from '@gluestack-ui/themed';

/**
 * SaveButton Component
 *
 * A reusable button meant for discarding edits.
 *
 * @owner Anna Hudson
 *
 * @returns A React element representing the SaveButton component.
 */
export default function SaveButton(props) {
  return (
    <Button
      size='xs'
      width='20%'
      borderRadius='$full'
      variant='outline'
      action='primary'
      style={{ borderColor: "white", color: "white"}}
      isDisabled={false}
      isFocusVisible={true}
      {...props}
    >
      <ButtonText color="white">Save</ButtonText>
    </Button>
  );
}
