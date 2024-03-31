import {
  Button,
  ButtonText,
  ButtonIcon,
} from '@gluestack-ui/themed';

/**
 * RecordButton Component
 *
 * A reusable button meant for recording audio.
 *
 * @owner Jason Lin
 *
 * @returns A React element representing the RecordButton component.
 */
export default function RecordButton({ buttonProps, buttonIconProps }) {
  return (
    <Button
      mt='$10'
      size='lg'
      variant='solid'
      action='primary'
      isDisabled={false}
      isFocusVisible={false}
      {...buttonProps}
    >
      <ButtonText>Record </ButtonText>
      <ButtonIcon {...buttonIconProps} />
    </Button>
  );
}
