import { MantineProvider } from '@mantine/core';

export default function LayoutReact({ children }) {
  return (
    <MantineProvider defaultColorScheme="light">
      {children}
    </MantineProvider>
  );
}
