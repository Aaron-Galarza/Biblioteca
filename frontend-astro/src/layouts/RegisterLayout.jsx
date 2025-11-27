import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { RegisterForm } from '../components/auth/RegisterForm';

export function RegisterLayout() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <RegisterForm />
    </MantineProvider>
  );
}
