import ButtonMui from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { route, checkRole } from '@/Utils'
import { router } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ConvocatoriaLineasProgramaticas = ({ auth, convocatoria }) => {
    const auth_user = auth.user
    const is_super_admin = checkRole(auth_user, [1])

    return (
        <AuthenticatedLayout user={auth_user} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <Grid item md={12}>
                <h1 className="text-4xl text-center mb-8">A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.</h1>
            </Grid>
            {convocatoria.lineas_programaticas.map((linea_programatica) => (
                <Grid item md={3} key={linea_programatica.id}>
                    <ButtonMui
                        primary={false}
                        onClick={() => router.visit(route('convocatorias.lineas-programaticas.proyectos', [convocatoria.id, linea_programatica.id]))}
                        className="overflow-hidden z-[2] relative text-center !shadow-md rounded-lg px-6 py-2 flex justify-around items-center flex-col m-auto w-full h-96">
                        {linea_programatica.nombre + ' - ' + linea_programatica.codigo}
                    </ButtonMui>
                </Grid>
            ))}
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaLineasProgramaticas
