import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import AlertMui from '@/Components/Alert'
import ButtonMui from '@/Components/Button'

import { route, checkRole } from '@/Utils'
import { Link, router } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ConvocatoriaTiposFormulario = ({ auth, convocatoria, tipos_formulario_convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout user={auth_user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <h1 className="text-4xl text-center mb-8">A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.</h1>
            </Grid>

            {checkRole(auth_user, [1, 20, 18, 19, 5, 17]) && (
                <Grid item md={12}>
                    <AlertMui className="mt-10">
                        <p>Si desea modificar la convocatoria por favor de clic en el siguiente botón:</p>
                        <Link href={route('convocatorias.edit', [convocatoria.id])} className="my-4 bg-app-800 text-white py-2 px-4 rounded inline-block">
                            Modificar convocatoria
                        </Link>
                    </AlertMui>
                </Grid>
            )}

            {tipos_formulario_convocatoria.map((tipo_formulario_convocatoria) => (
                <Grid item md={3} key={tipo_formulario_convocatoria.id}>
                    <ButtonMui
                        primary={false}
                        onClick={() => router.visit(route('convocatorias.tipos-formulario-convocatoria.proyectos', [convocatoria.id, tipo_formulario_convocatoria.id]))}
                        className="overflow-hidden z-[2] relative text-center !shadow-md rounded-lg px-6 py-2 flex justify-around items-center flex-col m-auto w-full h-96">
                        {tipo_formulario_convocatoria.nombre + ' - Línea: ' + tipo_formulario_convocatoria.linea_programatica.codigo}
                    </ButtonMui>
                </Grid>
            ))}
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaTiposFormulario
