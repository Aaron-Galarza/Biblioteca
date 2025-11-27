// src/components/MantineLayout.jsx
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { useEffect } from 'react';

import { HeaderMegaMenu } from './HeaderMegaMenu';
import { HeroImageBackground } from './HeroImageBackground';
import { useAuthStore } from '../auth/store';

export function MantineLayout({ user }) {
  const { setUser } = useAuthStore();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS>
      <HeaderMegaMenu />
      <HeroImageBackground />
    </MantineProvider>
  );
}
