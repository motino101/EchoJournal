import { Input, InputField } from '@gluestack-ui/themed';

export default function EditableEntryTitle({ value, onChangeText }) {
  return (
    <Input width='83%'>
      <InputField
        onChangeText={onChangeText}
        fontWeight='bold'
        value={value}
        size='2xl'
        placeholder='Edit Title'
      />
    </Input>
  );
}
