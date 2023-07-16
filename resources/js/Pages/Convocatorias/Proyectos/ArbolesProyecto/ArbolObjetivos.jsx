import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import ArbolObjetivosComponent from './ArbolObjetivosComponent'

const ArbolObjetivos = ({ auth, convocatoria, proyecto, efectosDirectos, causasDirectas, tiposImpacto, resultados, objetivosEspecificos }) => {
    return (
        <AuthenticatedLayout>
            <ArbolObjetivosComponent auth={auth} convocatoria={convocatoria} proyecto={proyecto} efectosDirectos={efectosDirectos} causasDirectas={causasDirectas} tiposImpacto={tiposImpacto} resultados={resultados} objetivosEspecificos={objetivosEspecificos} />
        </AuthenticatedLayout>
    )
}

export default ArbolObjetivos
