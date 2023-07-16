import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import PrimaryButton from '@/Components/PrimaryButton'
// import Stepper from '@/Components/Stepper';

import Form from './Form'

import { checkRole, route } from '@/Utils'
import { Grid, Paper } from '@mui/material'

const Edit = ({
    auth,
    convocatoria,
    idi,
    mesasSectoriales,
    centrosFormacion,
    lineasProgramaticas,
    redesConocimiento,
    disciplinasSubareaConocimiento,
    actividadesEconomicas,
    tematicasEstrategicas,
    lineasTecnoacademia,
    lineasInvestigacion,
    tecnoacademias,
    municipios,
    tecnoacademia,
    areasTematicasEni,
    lineasInvestigacionEni,
    gruposInvestigacion,
    proyectoMunicipios,
    proyectoAreasTematicasEni,
    proyectoLineasInvestigacionEni,
    programasFormacionConRegistroCalificado,
    programasFormacionSinRegistroCalificado,
    mesasSectorialesRelacionadas,
    lineasTecnoacademiaRelacionadas,
    programasFormacionConRegistroRelacionados,
    programasFormacionSinRegistroRelacionados,
}) => {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    const submit = (e) => {
        e.preventDefault()
        if (idi.proyecto.allowed.to_update) {
            put(route('convocatorias.idi.update', [convocatoria.id, idi.id]), {
                preserveScroll: true,
            })
        }
    }

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{idi.titulo}</h2>}>
            <Grid item md={3}></Grid>
            <Grid item md={9}>
                <Paper className="p-10">
                    <Form
                        submit={submit}
                        isSuperAdmin={isSuperAdmin}
                        method="editar"
                        idi={idi}
                        centrosFormacion={centrosFormacion}
                        lineasProgramaticas={lineasProgramaticas}
                        gruposInvestigacion={gruposInvestigacion}
                        mesasSectoriales={mesasSectoriales}
                        tecnoacademia={tecnoacademia}
                        convocatoria={convocatoria}
                        redesConocimiento={redesConocimiento}
                        disciplinasSubareaConocimiento={disciplinasSubareaConocimiento}
                        actividadesEconomicas={actividadesEconomicas}
                        tematicasEstrategicas={tematicasEstrategicas}
                        lineasTecnoacademia={lineasTecnoacademia}
                        lineasInvestigacion={lineasInvestigacion}
                        tecnoacademias={tecnoacademias}
                        municipios={municipios}
                        areasTematicasEni={areasTematicasEni}
                        lineasInvestigacionEni={lineasInvestigacionEni}
                        programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
                        programasFormacionSinRegistroCalificado={programasFormacionSinRegistroCalificado}
                        proyectoMunicipios={proyectoMunicipios}
                        proyectoAreasTematicasEni={proyectoAreasTematicasEni}
                        proyectoLineasInvestigacionEni={proyectoLineasInvestigacionEni}
                        mesasSectorialesRelacionadas={mesasSectorialesRelacionadas}
                        lineasTecnoacademiaRelacionadas={lineasTecnoacademiaRelacionadas}
                        programasFormacionConRegistroRelacionados={programasFormacionConRegistroRelacionados}
                        programasFormacionSinRegistroRelacionados={programasFormacionSinRegistroRelacionados}
                    />

                    {idi.proyecto?.allowed?.to_update && (
                        <div className="pt-8 pb-4 space-y-4">
                            <PrimaryButton type="submit" className="ml-auto">
                                Guardar
                            </PrimaryButton>
                        </div>
                    )}
                </Paper>
            </Grid>
        </AuthenticatedLayout>
    )
}

export default Edit
