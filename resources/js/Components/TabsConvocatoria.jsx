import { router } from '@inertiajs/react'
import { Tab, Tabs } from '@mui/material'

const TabsConvocatoria = ({ convocatoria, tipo_formulario_convocatoria_id, value }) => {
    return (
        <Tabs value={value} centered={true}>
            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.tipos-formulario-convocatoria.proyectos', [convocatoria.id, tipo_formulario_convocatoria_id]))
                }}
                label="Proyectos"
                value="0"
            />
            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-roles-sennova.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                }}
                label="Roles SENNOVA"
                value="1"
            />

            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-rubros-presupuestales.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                }}
                label="Rubros presupuestales"
                value="2"
            />

            <Tab
                component="a"
                onClick={() => {
                    router.visit(route('convocatorias.convocatoria-anexos.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                }}
                label="Anexos"
                value="3"
            />

            {tipo_formulario_convocatoria_id == 17 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-tecnoparques.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 17 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-presupuestales-tecnoparque.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes presupuestales"
                    value="5"
                />
            )}
        </Tabs>
    )
}

export default TabsConvocatoria
