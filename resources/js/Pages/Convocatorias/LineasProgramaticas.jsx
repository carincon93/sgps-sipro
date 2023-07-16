import ButtonMui from '@/Components/Button'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { route, checkRole } from '@/Utils'
import { router } from '@inertiajs/react'
import { Grid } from '@mui/material'

const ConvocatoriaLineasProgramaticas = ({ auth, convocatoria, lineasProgramaticas }) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    return (
        <AuthenticatedLayout user={authUser} header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <h1 className="text-4xl text-center mb-8">A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.</h1>
            {lineasProgramaticas.map((lineaProgramatica) => {
                if (JSON.parse(convocatoria.lineas_programaticas_activas)?.includes(lineaProgramatica.id)) {
                    return (
                        <Grid item md="3">
                            <ButtonMui key={lineaProgramatica.id} onClick={() => router.visit(route('convocatorias.lineas-programaticas.proyectos', [convocatoria.id, lineaProgramatica.id]))} className="overflow-hidden z-[2] relative text-center !shadow-md rounded-lg px-6 py-2 flex justify-around items-center flex-col m-auto w-full h-96">
                                {lineaProgramatica.nombre + ' - ' + lineaProgramatica.codigo}
                            </ButtonMui>
                        </Grid>
                    )
                }
                return null
            })}
        </AuthenticatedLayout>
    )
}

export default ConvocatoriaLineasProgramaticas
