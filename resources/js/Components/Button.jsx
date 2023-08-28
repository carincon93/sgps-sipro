import Button from '@mui/material/Button'
import { createTheme, ThemeProvider } from '@mui/material/styles'

export default function ButtonMui({ children, primary = true, className, variant = 'contained', disabled = false, ...props }) {
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
            <Button
                variant={variant}
                className={disabled ? '!bg-app-100 !mt-1 !text-left !normal-case !text-app-300 !text-[12px] rounded-md my-4 p-2 block  w-full' : className}
                disabled={disabled}
                {...props}>
                {children}
            </Button>
        </ThemeProvider>
    )
}
