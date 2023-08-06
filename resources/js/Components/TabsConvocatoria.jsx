import { router } from '@inertiajs/react'
import { Tab, Tabs } from '@mui/material'

const TabsConvocatoria = ({ convocatoria, linea_programatica_id, value }) => {
    return (
        <Tabs value={value} centered={true}>
            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.proyectos.index', [convocatoria.id, { linea_programatica_id: linea_programatica_id }]))
                }}
                label="Proyectos"
                value="0"
            />
            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-roles-sennova.index', [convocatoria.id, { linea_programatica_id: linea_programatica_id }]))
                }}
                label="Roles SENNOVA"
                value="1"
            />

            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-rubros-presupuestales.index', [convocatoria.id, { linea_programatica_id: linea_programatica_id }]))
                }}
                label="Rubros presupuestales"
                value="2"
            />

            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-anexos.index', [convocatoria.id, { linea_programatica_id: linea_programatica_id }]))
                }}
                label="Anexos"
                value="3"
            />
        </Tabs>
    )
}

export default TabsConvocatoria
