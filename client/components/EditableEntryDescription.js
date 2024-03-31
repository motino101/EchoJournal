import { Textarea, TextareaInput } from '@gluestack-ui/themed';

export default function EditableEntryDescription({
  textareaProps,
  textareaInputProps,
}) {
  return (
    <Textarea
      size='md'
      isReadOnly={false}
      isInvalid={false}
      isDisabled={false}
      w='100%'
      {...textareaProps}
    >
      <TextareaInput
        placeholder='Edit Description'
        {...textareaInputProps}
      />
    </Textarea>
  );
}
