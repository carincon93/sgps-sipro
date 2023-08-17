import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import { checkRole } from '@/Utils'
import { router } from '@inertiajs/react'
import { Grid, Paper, Tab, Tabs } from '@mui/material'

const Show = ({ auth, grupo_investigacion }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{grupo_investigacion.nombre}</h2>}>
            <Grid container>
                <Grid item md={12} className="!mb-32">
                    <Tabs value="0" centered={true}>
                        <Tab component="a" label={grupo_investigacion.nombre} value="0" />
                        <Tab
                            component="a"
                            onClick={() => {
                                router.visit(route('grupos-investigacion.lineas-investigacion.index', [grupo_investigacion.id]))
                            }}
                            label="Líneas de investigación"
                            value="1"
                        />

                        <Tab component="button" label="Semilleros de investigación" value="2" disabled={true} />
                    </Tabs>
                </Grid>
                <Grid item md={4} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 2 }}>
                        <h1 className="text-2xl text-center my-20">{grupo_investigacion.nombre}</h1>
                    </Paper>
                </Grid>
                <Grid item md={8} className="drop-shadow-lg">
                    <Paper elevation={0} sx={{ padding: 8 }}>
                        <Grid container rowSpacing={10}>
                            <Grid item md={4}>
                                <p className="text-gray-400">Nombre</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.nombre}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Acrónimo</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.acronimo}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Correo electrónico</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.email}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">GrupLAC</p>
                            </Grid>
                            <Grid item md={8}>
                                <a href={grupo_investigacion?.enlace_gruplac} target="_blank">
                                    Ir al GrupLAC
                                </a>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Código Minciencias</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.codigo_minciencias}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Categoría Minciencias</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.categoria_minciencias}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Fecha de creación del grupo</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.fecha_creacion_grupo}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Líder del grupo</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.nombre_lider_grupo}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Correo electrónico de contacto</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.email_contacto}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Reconocimientos del grupo de investigación</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.reconocimientos_grupo_investigacion}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Programa Nal. CTeI (Principal)</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.programa_nal_ctei_principal}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Programa Nal. CTeI (Secundaria)</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.programa_nal_ctei_secundaria}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Visión</p>
                            </Grid>
                            <Grid item md={8}>
                                <p className="whitespace-pre-wrap text-justify">{grupo_investigacion?.vision}</p>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Misión</p>
                            </Grid>
                            <Grid item md={8}>
                                <p className="whitespace-pre-wrap text-justify">{grupo_investigacion?.mision}</p>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Objetivo general</p>
                            </Grid>
                            <Grid item md={8}>
                                <p className="whitespace-pre-wrap text-justify">{grupo_investigacion?.objetivo_general}</p>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Objetivos específicos</p>
                            </Grid>
                            <Grid item md={8}>
                                <p className="whitespace-pre-wrap text-justify">{grupo_investigacion?.objetivos_especificos}</p>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Link del grupo de investigación</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.link_propio_grupo}
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Redes de conocimiento</p>
                            </Grid>
                            <Grid item md={8}>
                                <ul className="list-disc ml-6">
                                    {grupo_investigacion?.redes_conocimiento.map((item) => (
                                        <li>{item.nombre}</li>
                                    ))}
                                </ul>
                            </Grid>
                            <Grid item md={4}>
                                <p className="text-gray-400">Centro de formación</p>
                            </Grid>
                            <Grid item md={8}>
                                {grupo_investigacion?.centro_formacion.nombre}
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Show
