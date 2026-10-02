import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    primary: { main: '#194c3b', dark: '#123a2e', light: '#e6f0e8' },
    secondary: { main: '#c36a45' },
    background: { default: '#f5f3ed', paper: '#ffffff' },
    text: { primary: '#203b31', secondary: '#738077' },
    divider: '#e4e8e0',
  },
  typography: {
    fontFamily: '"DM Sans", Arial, sans-serif',
    h1: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.045em',
    },
    h2: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.035em',
    },
    h3: {
      fontFamily: '"Manrope", sans-serif',
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    button: { textTransform: 'none', fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 11, boxShadow: 'none', minHeight: 38 },
      },
    },
    MuiPaper: { styleOverrides: { root: { boxShadow: 'none' } } },
    MuiTextField: { defaultProps: { size: 'small' } },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#e8ebe5' },
        head: {
          fontSize: '0.68rem',
          fontWeight: 800,
          letterSpacing: '0.07em',
          color: '#738077',
        },
      },
    },
  },
})
