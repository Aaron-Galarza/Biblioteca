import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { LoginForm } from '../components/auth/LoginForm';

export function LoginLayout() {
  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications />
      <LoginForm />
    </MantineProvider>
  );
}
