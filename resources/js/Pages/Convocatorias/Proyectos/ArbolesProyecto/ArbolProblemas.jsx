import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ArbolProblemasComponent from './ArbolProblemasComponent'

const ArbolProblemas = ({ auth, convocatoria, proyecto, efectosDirectos, causasDirectas }) => {
    return (
        <AuthenticatedLayout>
            <ArbolProblemasComponent auth={auth} convocatoria={convocatoria} proyecto={proyecto} efectosDirectos={efectosDirectos} causasDirectas={causasDirectas} />
        </AuthenticatedLayout>
    )
}

export default ArbolProblemas
