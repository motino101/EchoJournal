import { Button, ButtonText } from '@gluestack-ui/themed';
import themeColors from '../../styles/themes';
/**
 * DiscardButton Component
 *
 * A reusable button component designed specifically for discarding edits.
 * This component is tailored to indicate a negative action, allowing users
 * to discard changes they've made.
 *
 * @param {object} discardButtonElementProps - Additional props to be spread onto the underlying Button element.
 * @param {object} discardButtonTextProps - Additional props to be spread onto the Text component representing the button text.
 * @returns {React.ReactElement} A React element representing the DiscardButton component.
 * @owner Anna Hudson
 */

export default function DiscardButton({
  discardButtonElementProps,
  discardButtonTextProps,
}) {
  return (
    <Button
      size='xs'
      width='20%'
      borderRadius='$full'
      variant='outline'
      // color={themeColors.main}
      style={{ borderColor: "white", color: "white"}}
      // action='negative'
      isDisabled={false}
      isFocusVisible={true}
      {...discardButtonElementProps}
    >
      <ButtonText color="white" {...discardButtonTextProps}>Discard</ButtonText>
    </Button>
  );
}
