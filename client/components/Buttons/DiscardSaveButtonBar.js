import DiscardButton from './DiscardButton';
import SaveButton from './SaveButton';
import { Box } from '@gluestack-ui/themed';

/**
 * DiscardSaveButtonBar Component
 *
 * A reusable component that combines a Discard button and a Save button, arranged horizontally.
 * This component provides a convenient way to display both buttons in a single bar, commonly used
 * in forms and editing interfaces.
 *
 * @param {object} discardButtonProps - Additional props to be spread onto the DiscardButton component.
 * @param {object} saveButtonProps - Additional props to be spread onto the SaveButton component.
 * @returns {React.ReactElement} A React element representing the DiscardSaveButtonBar component.
 * @owner Anna Hudson
 */
export default function DiscardSaveButtonBar({
  discardButtonProps,
  saveButtonProps,
}) {
  return (
    <Box
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
    >
      <DiscardButton {...discardButtonProps} />
      <SaveButton {...saveButtonProps} />
    </Box>
  );
}
