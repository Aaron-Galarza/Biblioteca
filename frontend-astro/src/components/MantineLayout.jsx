import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { MemoryRouter } from 'react-router-dom';

import { HeaderMegaMenu } from './HeaderMegaMenu';
import { HeroImageBackground } from './HeroImageBackground';

export function MantineLayout() {
  return (
    <MemoryRouter>
      <MantineProvider>
        <HeaderMegaMenu/>
        <HeroImageBackground/>
      </MantineProvider>
    </MemoryRouter>
  );
}