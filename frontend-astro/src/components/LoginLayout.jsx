import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { MemoryRouter } from 'react-router-dom';
import { useEffect } from 'react';
import { LoginHeroImageBackground } from '../components/LoginHeroImageBackground';
import { useAuthStore } from '../auth/store';

export function LoginLayout({ user}) {
  
  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <MemoryRouter>
      <MantineProvider>
        <Notifications /> 
        <LoginHeroImageBackground/>
      </MantineProvider>
    </MemoryRouter>
  );
}