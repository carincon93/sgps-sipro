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

            {tipo_formulario_convocatoria_id == 1 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.montos-maximos-formulario1-regional.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Montos máximos por regional"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 4 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-tecnoacademias.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 7 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-presupuestales-formulario-7.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - presupuestales"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 13 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-formulario-13.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 15 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-formulario-15.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 16 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-formulario-16.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

            {tipo_formulario_convocatoria_id == 10 && (
                <Tab
                    component="a"
                    onClick={() => {
                        router.visit(route('convocatorias.topes-roles-sennova-hubs-innovacion.index', [convocatoria.id, { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id }]))
                    }}
                    label="Topes - Roles SENNOVA"
                    value="4"
                />
            )}

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

            <Tab
                component="a"
                onClick={() => {
                    router.visit(
                        route('convocatorias.tipos-formulario-convocatoria.formulario-evaluacion', [
                            convocatoria.id,
                            tipo_formulario_convocatoria_id,
                            { tipo_formulario_convocatoria_id: tipo_formulario_convocatoria_id },
                        ]),
                    )
                }}
                label="Formulario de evaluación"
                value="6"
            />
        </Tabs>
    )
}

export default TabsConvocatoria
