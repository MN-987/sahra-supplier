import merge from 'lodash/merge';
import { useMemo } from 'react';
// @mui
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider as MuiThemeProvider, ThemeOptions } from '@mui/material/styles';
// components
import { useSettingsContext } from 'src/components/settings';
// system
import { palette } from './palette';
import { shadows } from './shadows';
import { typography } from './typography';
import { customShadows } from './custom-shadows';
import { componentsOverrides } from './overrides';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeProvider({ children }: Props) {
  const settings = useSettingsContext();

  const baseOption = useMemo(
    () => ({
      palette: palette(),
      shadows: shadows(),
      customShadows: customShadows(),
      typography,
      shape: { borderRadius: 8 },
    }),
    []
  );

  const themeOptions = useMemo(
    () => merge(baseOption),
    [baseOption]
  );

  const theme = createTheme(themeOptions);

  theme.components = componentsOverrides(theme);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
