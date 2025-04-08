import { Box, Typography, useTheme, useMediaQuery } from '@mui/material'
import LocalCafeIcon from '@mui/icons-material/LocalCafe'

const Footer = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm')) // Breakpoint para telas menores que 600px

    return (
        <Box
            component="footer"
            sx={{
            py: isMobile ? 1 : 2,
            px: isMobile ? 2 : 4,
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a1a' : '#f5f5f5',
            textAlign: 'center',
            position: isMobile ? 'static' : 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            mt: isMobile ? 4 : 0
            }}
        >
            <Typography 
            variant={isMobile ? 'caption' : 'body2'} 
            color="text.secondary"
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 0.5
            }}
            >
            Made with 
            <LocalCafeIcon 
                fontSize={isMobile ? 'small' : 'inherit'}
                sx={{ 
                color: theme.palette.mode === 'dark' ? '#ffd700' : '#6f4e37'
                }} 
            />
            <span>by <strong>Matheus Varela</strong></span>
            </Typography>
        </Box>
    )
}

export default Footer