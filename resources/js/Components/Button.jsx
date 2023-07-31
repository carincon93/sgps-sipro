import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function ButtonMui({ children, primary = true, variant = 'contained', ...props }) {
    const theme = createTheme({
        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        boxShadow: 'none',
                        backgroundColor: primary ? '#374151' : 'white',
                        color: primary ? 'white' : '#374151',
                        '&:hover': {
                            boxShadow: 'none',
                            color: primary ? '#374151' : 'white',
                            backgroundColor: primary ? 'white' : '#374151',
                        },
                    },
                },
            },
        },
    })
    return (
        <ThemeProvider theme={theme}>
            <Button variant={variant} {...props}>
                {children}
            </Button>
        </ThemeProvider>
    )
}
