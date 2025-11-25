import { Fieldset, TextInput } from '@mantine/core';

function FieldsetDemo() {
  return (
    <Fieldset legend="Personal information" radius="lg">
      <TextInput label="Your name" placeholder="Your name" />
      <TextInput label="Email" placeholder="Email" mt="md" />
    </Fieldset>
  );
}