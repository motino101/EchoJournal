import BackButton from './BackButton';
import EditButton from './EditButton';
import { Box } from '@gluestack-ui/themed';

/**
 * BackEditButtonBar Component
 *
 * A reusable group of a Back button and Edit button, stacked horizontally.
 *
 * @owner Anna Hudson
 *
 * @returns A React element representing the BackEditButtonBar component.
 */
export default function BackEditButtonBar({
  backButtonProps,
  editButtonProps,
}) {
  return (
    <Box
      flexDirection='row'
      justifyContent='space-between'
      alignItems='center'
    >
      <BackButton {...backButtonProps} />
      <EditButton {...editButtonProps} />
    </Box>
  );
}
