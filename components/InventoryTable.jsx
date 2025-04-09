import { useEffect, useState } from 'react'
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    TextField,
    Button,
    IconButton,
    MenuItem,
    Box,
    Grid,
    useMediaQuery,
    useTheme,
    Typography,
    Snackbar,
    Alert
} from '@mui/material'
import { Edit, Delete } from '@mui/icons-material'

const InventoryTable = () => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
    
    const [items, setItems] = useState([])
    const [newItem, setNewItem] = useState({ 
        item_name: '', 
        quantity: 0, 
        minimum_stock: 0,
        type: 'Outros'
    })
    const [editingItem, setEditingItem] = useState(null)
    const [editForm, setEditForm] = useState({
        item_name: '',
        quantity: 0,
        minimum_stock: 0,
        type: 'Outros'
    })

    // Toast state
    const [toast, setToast] = useState({
        open: false,
        message: '',
        severity: 'success' // 'success', 'error', 'warning', 'info'
    })

    const handleCloseToast = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setToast({...toast, open: false})
    }

    const showToast = (message, severity = 'success') => {
        setToast({
            open: true,
            message,
            severity
        })
    }

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/items')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json()
            setItems(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Fetch error:', error)
            setItems([])
            showToast('Falha ao carregar os itens.', 'error')
        }
    }

    useEffect(() => {
        fetchItems()
    }, [])

    const handleAddItem = async () => {
        // Basic validation
        if (!newItem.item_name.trim()) {
            showToast('Nome do item não pode estar vazio.', 'error')
            return
        }

        try {
            const response = await fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem)
            })

            if (!response.ok) {
                throw new Error(`Falha ao adicionar item: ${response.status}`)
            }

            await fetchItems()
            setNewItem({ item_name: '', quantity: 0, minimum_stock: 0, type: 'Outros' })
            showToast('Item adicionado com sucesso!')
        } catch (error) {
            console.error('Add error:', error)
            showToast('Falha ao adicionar item.', 'error')
        }
    }

    const handleDeleteItem = async (id) => {
        try {
            const response = await fetch(`/api/items?id=${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            })

            if (!response.ok) {
                throw new Error(`Falha ao excluir item: ${response.status}`)
            }

            await fetchItems()
            showToast('Item excluído com sucesso!')
        } catch (error) {
            console.error('Delete error:', error)
            showToast('Falha ao excluir item.', 'error')
        }
    }

    const handleUpdateItem = async () => {
        // Basic validation
        if (!editForm.item_name.trim()) {
            showToast('Nome do item não pode estar vazio.', 'error')
            return
        }

        try {
            const response = await fetch('/api/items', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...editForm, id: editingItem })
            })
        
            if (!response.ok) throw new Error('Falha na atualização')
            await fetchItems()
            setEditingItem(null)
            showToast('Item atualizado com sucesso!')
        } catch (err) {
            console.error(err)
            showToast('Falha ao atualizar item.', 'error')
        }
    }

    const handleEditClick = (item) => {
        setEditingItem(item.id)
        setEditForm({
            item_name: item.item_name,
            quantity: item.quantity,
            minimum_stock: item.minimum_stock,
            type: item.type
        })
    }

    return (
        <>
            <TableContainer component={Paper} sx={{ overflowX: 'hidden', p: isMobile ? 0 : 2, display: 'flex', flexDirection: 'column', alignContent: isMobile ? 'center' : 'flex-end' }}>
                {/* Formulário de Adição */}
                <Box sx={{ p: 2 }}>
                    <Grid container align="center" spacing={2}>
                        <Grid item size={{ xs: 12, md: 2, sm: 6 }}>
                            <TextField
                                label="Nome do Item"
                                value={newItem.item_name}
                                onChange={(e) => setNewItem({ ...newItem, item_name: e.target.value })}
                                fullWidth
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>
                        
                        <Grid item size={{ xs: 12, md: 2, sm: 6 }}>
                            <TextField
                                label="Quantidade"
                                type="number"
                                value={newItem.quantity}
                                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
                                fullWidth
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>
                        
                        <Grid item size={{ xs: 12, md: 2, sm: 6,  }}>
                            <TextField
                                label="Estoque Mín."
                                type="number"
                                value={newItem.minimum_stock}
                                onChange={(e) => setNewItem({ ...newItem, minimum_stock: parseInt(e.target.value) || 0 })}
                                fullWidth
                                size={isMobile ? 'small' : 'medium'}
                            />
                        </Grid>
                        
                        <Grid item size={{ xs: 12, md: 2, sm: 6 }}>
                            <TextField
                                label="Tipo"
                                value={newItem.type}
                                onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                                select
                                fullWidth
                                size={isMobile ? 'small' : 'medium'}
                            >
                                <MenuItem value="Outros">Outros</MenuItem>
                                <MenuItem value="Saco">Saco</MenuItem>
                                <MenuItem value="Lata">Lata</MenuItem>
                                <MenuItem value="Pacote">Pacote</MenuItem>
                            </TextField>
                        </Grid>
                        
                        <Grid size={{ xs: 12, sm: 12, md: 4 }}>
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleAddItem}
                                fullWidth
                                size={isMobile ? 'small' : 'large'}
                            >
                                Adicionar
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Lista de Itens */}
                {isMobile ? (
                    // Versão Mobile - Cards
                    <Box sx={{ p: 1 }}>
                        {items.map((item) => (
                            <Paper key={item.id} sx={{ mb: 2, p: 2, position: 'relative' }}>
                                {editingItem === item.id ? (
                                    // Modo Edição Mobile
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                label="Nome"
                                                value={editForm.item_name}
                                                onChange={(e) => setEditForm({ ...editForm, item_name: e.target.value })}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Qtd"
                                                type="number"
                                                value={editForm.quantity}
                                                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <TextField
                                                label="Mín."
                                                type="number"
                                                value={editForm.minimum_stock}
                                                onChange={(e) => setEditForm({ ...editForm, minimum_stock: parseInt(e.target.value) || 0 })}
                                                fullWidth
                                                size="small"
                                            />
                                        </Grid>
                                        <Grid item xs={8}>
                                            <TextField
                                                label="Tipo"
                                                value={editForm.type}
                                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                select
                                                fullWidth
                                                size="small"
                                            >
                                                <MenuItem value="Outros">Outros</MenuItem>
                                                <MenuItem value="Saco">Saco</MenuItem>
                                                <MenuItem value="Lata">Lata</MenuItem>
                                                <MenuItem value="Pacote">Pacote</MenuItem>
                                                <MenuItem value="Kilo">Kilo</MenuItem>
                                                <MenuItem value="Unidade">Unidade</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Button 
                                                onClick={handleUpdateItem}
                                                color="success"
                                                fullWidth
                                                size="small"
                                            >
                                                Salvar
                                            </Button>
                                            <Button 
                                                onClick={() => setEditingItem(null)}
                                                color="error"
                                                fullWidth
                                                size="small"
                                                sx={{ mt: 1 }}
                                            >
                                                Cancelar
                                            </Button>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    // Modo Visualização Mobile
                                    <>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {item.item_name}
                                            </Typography>
                                            <Box>
                                                <IconButton 
                                                    onClick={() => handleEditClick(item)}
                                                    size="small"
                                                >
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    onClick={() => handleDeleteItem(item.id)}
                                                    size="small"
                                                >
                                                    <Delete fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        
                                        <Box sx={{ 
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            mt: 1,
                                            gap: 1,
                                            flexWrap: 'wrap'
                                        }}>
                                            <Box sx={{ minWidth: '30%' }}>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Quantidade
                                                </Typography>
                                                <Typography>{item.quantity}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: '30%' }}>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Mínimo
                                                </Typography>
                                                <Typography>{item.minimum_stock}</Typography>
                                            </Box>
                                            <Box sx={{ minWidth: '30%' }}>
                                                <Typography variant="caption" display="block" color="text.secondary">
                                                    Tipo
                                                </Typography>
                                                <Typography>{item.type}</Typography>
                                            </Box>
                                        </Box>
                                    </>
                                )}
                            </Paper>
                        ))}
                    </Box>
                ) : (
                    // Versão Desktop - Tabela
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item</TableCell>
                                <TableCell align="right">Quantidade</TableCell>
                                <TableCell align="right">Estoque Mín.</TableCell>
                                <TableCell align="right">Tipo</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    {editingItem === item.id ? (
                                        // Modo Edição Desktop
                                        <>
                                            <TableCell>
                                                <TextField
                                                    value={editForm.item_name}
                                                    onChange={(e) => setEditForm({ ...editForm, item_name: e.target.value })}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={editForm.quantity}
                                                    onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 0 })}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    value={editForm.minimum_stock}
                                                    onChange={(e) => setEditForm({ ...editForm, minimum_stock: parseInt(e.target.value) || 0 })}
                                                    fullWidth
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    value={editForm.type}
                                                    onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                    select
                                                    fullWidth
                                                >
                                                    <MenuItem value="Outros">Outros</MenuItem>
                                                    <MenuItem value="Saco">Saco</MenuItem>
                                                    <MenuItem value="Lata">Lata</MenuItem>
                                                    <MenuItem value="Pacote">Pacote</MenuItem>
                                                </TextField>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Button onClick={handleUpdateItem} color="success">Salvar</Button>
                                                <Button onClick={() => setEditingItem(null)} color="error">Cancelar</Button>
                                            </TableCell>
                                        </>
                                    ) : (
                                        // Modo Visualização Desktop
                                        <>
                                            <TableCell>{item.item_name}</TableCell>
                                            <TableCell align="right">{item.quantity}</TableCell>
                                            <TableCell align="right">{item.minimum_stock}</TableCell>
                                            <TableCell align="right">{item.type}</TableCell>
                                            <TableCell align="center">
                                                <IconButton onClick={() => handleEditClick(item)}>
                                                    <Edit />
                                                </IconButton>
                                                <IconButton onClick={() => handleDeleteItem(item.id)}>
                                                    <Delete />
                                                </IconButton>
                                            </TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            {/* Toast/Snackbar Component */}
            <Snackbar 
                open={toast.open} 
                autoHideDuration={6000} 
                onClose={handleCloseToast}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert 
                    onClose={handleCloseToast} 
                    severity={toast.severity} 
                    sx={{ width: '100%' }}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </>
    )
}

export default InventoryTable