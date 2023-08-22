import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import Dropdown from '@/Components/Dropdown'
import MuiAppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import CssBaseline from '@mui/material/CssBaseline'
import IconButton from '@mui/material/IconButton'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import MailIcon from '@mui/icons-material/Mail'
import ApplicationLogo from './ApplicationLogo'

import { styled } from '@mui/material/styles'

import { checkRole, route } from '@/Utils'
import { useState } from 'react'
import { Link, router } from '@inertiajs/react'

const drawerWidth = 280

const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
})

const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
})

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}))

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
    }),
}))

export default function MiniDrawer({ user, children }) {
    const [open, setOpen] = useState(true)

    const handleDrawerOpen = () => {
        setOpen(true)
    }

    const handleDrawerClose = () => {
        setOpen(false)
    }

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar position="fixed" open={open} sx={{ boxShadow: 'none', backgroundColor: 'white' }}>
                <Toolbar sx={{ display: 'flex', justifyContent: 'end' }} className="!mr-24">
                    {open && (
                        <IconButton onClick={handleDrawerClose} className="!absolute left-[-20px] !bg-white !rounded-full">
                            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    )}

                    {!open && (
                        <IconButton onClick={handleDrawerOpen} className="!absolute left-[42px] !bg-white !rounded-full">
                            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    )}

                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition ease-in-out duration-150">
                                    {user.nombre}

                                    <svg className="ml-2 -mr-0.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content>
                            <Dropdown.Link href={route('users.perfil')}>Perfil</Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Cerrar sesión
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={open}>
                <DrawerHeader>
                    <Link href="/">
                        <ApplicationLogo />
                    </Link>
                </DrawerHeader>
                <List className="!p-4">
                    <ListItem disablePadding sx={{ display: 'block' }}>
                        <ListItemButton
                            sx={{
                                borderRadius: '20px',
                                minHeight: 48,
                                justifyContent: open ? 'initial' : 'center',
                                px: 2.5,
                            }}
                            onClick={() => router.visit(route('convocatorias.index'))}>
                            <ListItemIcon
                                sx={{
                                    minWidth: 0,
                                    mr: open ? 3 : 'auto',
                                    justifyContent: 'center',
                                }}></ListItemIcon>
                            <ListItemText primary="Convocatorias" sx={{ opacity: open ? 1 : 0 }} />
                        </ListItemButton>

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('centros-formacion.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Centros de formación" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 4, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('grupos-investigacion.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Grupos de investigación" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('hubs-innovacion.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Hubs de innovación" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('laboratorios-servicios-tecnologicos.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Laboratorios ST" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('nodos-tecnoparque.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Nodos Tecnoparque" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('programas-formacion.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Programas de formación" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 2, 4, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('reportes.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Reportes" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('roles-sennova.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Roles SENNOVA" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('tecnoacademias.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Tecnoacademias" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}

                        {checkRole(user, [1, 2, 4, 21, 18, 19, 5, 17]) && (
                            <ListItemButton
                                sx={{
                                    borderRadius: '20px',
                                    minHeight: 48,
                                    justifyContent: open ? 'initial' : 'center',
                                    px: 2.5,
                                }}
                                onClick={() => router.visit(route('users.index'))}>
                                <ListItemIcon
                                    sx={{
                                        minWidth: 0,
                                        mr: open ? 3 : 'auto',
                                        justifyContent: 'center',
                                    }}></ListItemIcon>
                                <ListItemText primary="Usuarios" sx={{ opacity: open ? 1 : 0 }} />
                            </ListItemButton>
                        )}
                    </ListItem>
                </List>
            </Drawer>
            <Box component="main" sx={{ flexGrow: 1, padding: '80px 16px' }}>
                {children}
            </Box>
        </Box>
    )
}
