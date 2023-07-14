import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

import Participantes from './Participantes'
import SemillerosInvestigacion from './SemillerosInvestigacion'

const Index = ({ convocatoria, nuevoParticipante, nuevoSemilleroInvestigacion, rolesSennova, proyecto, autorPrincipal }) => {
    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}>
            <div className="py-12">
                <Participantes autorPrincipal={autorPrincipal} convocatoria={convocatoria} rolesSennova={rolesSennova} proyecto={proyecto} nuevoParticipante={nuevoParticipante} />

                {proyecto.codigo_linea_programatica === 66 || proyecto.codigo_linea_programatica === 82 || proyecto.codigo_linea_programatica === 69 || proyecto.codigo_linea_programatica === 70 || proyecto.codigo_linea_programatica === 65 ? <SemillerosInvestigacion convocatoria={convocatoria} proyecto={proyecto} nuevoSemilleroInvestigacion={nuevoSemilleroInvestigacion} /> : null}
            </div>
        </AuthenticatedLayout>
    )
}

export default Index
