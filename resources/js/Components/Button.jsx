import Button from '@mui/material/Button';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function ButtonMui({children, backgroundColor = 'white', backgroundColorHover = '#374151', color = '#374151', colorHover = 'white', variant = 'contained', ...props}) {
    const theme = createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        backgroundColor: backgroundColor,
                        color: color,
                        '&:hover': {
                            boxShadow: 'none',
                            color: colorHover,
                            backgroundColor: backgroundColorHover,
                        },
                    },
                },
            },
        },
    });
  return (
    <ThemeProvider theme={theme}>
        <Button variant={variant} {...props}>{children}</Button>
    </ThemeProvider>
  );
}
