import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { LoginHeroImageBackground } from '../components/LoginHeroImageBackground';
import { useAuthStore } from '../auth/store';

export function LoginLayout({ user }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <Notifications /> 
      <LoginHeroImageBackground/>
    </MantineProvider>
  );
}