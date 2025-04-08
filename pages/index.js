import Head from 'next/head'
import InventoryTable from '../components/InventoryTable'
import { Container, CssBaseline, Typography } from '@mui/material'

export default function Home() {
  return (
    <>
      <Head>
        <title>Inventário Pizzaria</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <CssBaseline />
      <Container maxWidth="md" sx={{ 
        py: { xs: 2, sm: 3 },
        px: { xs: 1, sm: 2 },
        minHeight: 'calc(100vh - 64px)' // Ajuste para o footer
      }}>
        <Typography variant="h4" sx={{ 
          fontSize: { xs: '1.75rem', sm: '2.125rem' },
          mb: { xs: 1, sm: 2 },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          Controle de Estoque
        </Typography>
        <InventoryTable />
      </Container>
    </>
  )
}