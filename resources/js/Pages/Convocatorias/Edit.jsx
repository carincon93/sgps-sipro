import { useForm } from '@inertiajs/react';
import { route, checkRole } from '@/Utils';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Label from '@/Components/Label';
// import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import Textarea from '@/Components/Textarea';
import Switch from '@/Components/Switch';
import Autocomplete from '@/Components/Autocomplete';
import MultipleSelect from '@/Components/MultipleSelect';

const EditConvocatoria = ({ auth, errors, convocatoria, lineas_programaticas, lineas_programaticas_activas_relacionadas, fases }) => {

  // Validar si el usuario autenticado es SuperAdmin
  const authUser = auth.user;
  const isSuperAdmin = checkRole(authUser, [1]);

    const submitFase = (e) => {
        e.preventDefault();

        postFase(route('convocatorias.update-fase', convocatoria.id))
    };

const { data: dataFase, setData: setDataFase, post: postFase, processing: processingFase, errors: errorsFase, reset: resetFase } = useForm({
    fase: convocatoria.fase,
    fecha_finalizacion_fase: convocatoria.fecha_finalizacion_fase,
    hora_finalizacion_fase: convocatoria.hora_finalizacion_fase,
  });

  const { data: dataConvocatoria, setData: setDataConvocatoria, post: postConvocatoria, processing: processingConvocatoria, errors: errorsConvocatoria, reset: resetConvocatoria } = useForm({
    descripcion: convocatoria.descripcion,
    esta_activa: convocatoria.esta_activa,
    visible: convocatoria.visible,
    mostrar_recomendaciones: convocatoria.mostrar_recomendaciones,
    lineas_programaticas_activas: lineas_programaticas_activas_relacionadas.length > 0 ? lineas_programaticas_activas_relacionadas : null,
  });

  const submitInfo = () => {
    if (isSuperAdmin) {
      postConvocatoria(route('convocatorias.update', convocatoria.id), {
        preserveScroll: true,
      });
    }
  };

  return (
    <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}
    >
      <header className="pt-[8rem]" slot="header">
        <div className="flex items-center justify-between lg:px-8  px-4 py-6">
          <div>
            <h1 className="overflow-ellipsis overflow-hidden w-breadcrumb-ellipsis whitespace-nowrap">
              <a href={route('convocatorias.index')} className="text-app-400 hover:text-app-600">Convocatorias</a>
              <span className="text-app-400 font-medium">/</span>
              <a href={route('convocatorias.lineas-programaticas.index', convocatoria.id)} className="text-app-400 hover:text-app-600">
                {convocatoria.descripcion}
              </a>
            </h1>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3">
        <div>
          <h1 className="font-black text-4xl uppercase">Editar convocatoria</h1>
        </div>
        <div className="col-span-2">
          {convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3 ? (
            <form onSubmit={submitFase} className="bg-white rounded shadow">
              <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
                <div className="grid grid-cols-2">
                  <div>
                    <Label required className="mb-4" labelFor="fase" value="Fase" />
                  </div>
                  <div>
                    <Autocomplete id="fase" items={fases} value={dataFase.fase} onChange={(e) => setDataFase('fase', e.target.value)} error={errors.fase} autoComplete={false} placeholder="Seleccione una fase" required />
                  </div>

                  {dataFase.fase?.label && (
                    <>
                      <div>
                        <Label required labelFor="fecha_finalizacion_fase" value={`Fecha de finalización de la fase: ${dataFase.fase.label.toLowerCase()}`} />
                      </div>
                      <div>
                        <input id="fecha_finalizacion_fase" type="date" className="mt-1 p-2" value={dataFase.fecha_finalizacion_fase} onChange={(e) => setDataFase('fecha_finalizacion_fase', e.target.value)} required />
                      </div>
                    </>
                  )}

                  <div>
                    <Label required labelFor="hora_finalizacion_fase" value="Hora límite" />
                  </div>
                  <div>
                    <input id="hora_finalizacion_fase" type="time" step="1" className="mt-1 p-2 border rounded border-gray-300" value={dataFase.hora_finalizacion_fase} onChange={(e) => setDataFase('hora_finalizacion_fase', e.target.value)} required />
                  </div>
                </div>

                <p className="mt-10">
                  {dataFase.fase?.value === 1 && (
                    <>
                      <strong>Tenga en cuenta:</strong> La fase de {dataFase.fase.label.toLowerCase()} permitirá a los formuladores crear, modificar y eliminar proyectos.
                    </>
                  )}
                  {dataFase.fase?.value === 2 && (
                    <>
                      <strong>Tenga en cuenta:</strong> La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores las acciones de crear, modificar y eliminar proyectos.
                    </>
                  )}
                  {dataFase.fase?.value === 3 && (
                    <>
                      <strong>Tenga en cuenta:</strong> La fase de {dataFase.fase.label.toLowerCase()} permitirá a los formuladores modificar aquellos proyectos que pueden ser subsanados y a los evaluadores se le bloqueará la acción de modificar las evaluaciones.
                    </>
                  )}
                  {dataFase.fase?.value === 4 && (
                    <>
                      <strong>Tenga en cuenta:</strong> La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores la acción de modificar aquellos proyectos que pasaron a etapa de subsanación y a los evaluadores se le habilitarán aquellas evaluaciones de proyectos subsanados.
                    </>
                  )}
                  {dataFase.fase?.value === 5 && (
                    <>
                      <strong>Tenga en cuenta:</strong> La fase de {dataFase.fase.label.toLowerCase()} bloqueará a los formuladores la modificación de proyectos y a los evaluadores la modificación de las evaluaciones.
                    </>
                  )}
                </p>
              </fieldset>
              <div className="shadow-inner bg-app-200 border-app-400 bottom-0 flex items-center justify-between mt-14 px-8 py-4 sticky">
                {isSuperAdmin && (
                  <PrimaryButton className="ml-auto" type="submit" disabled={processingFase}>
                    Editar fase
                  </PrimaryButton>
                )}
              </div>
            </form>
          ) : null}
        </div>

        <div className="bg-white rounded shadow">
          <form onSubmit={submitInfo}>
            <fieldset className="p-8" disabled={isSuperAdmin ? undefined : true}>
              <div className="mt-8">
                <Textarea label="Descripción" maxlength="40000" id="descripcion" error={errors.descripcion} value={dataConvocatoria.descripcion} onChange={(e) => setDataConvocatoria('descripcion', e.target.value)} required />
              </div>

              <div className="mt-10 mb-20">
                <Label required labelFor="esta_activa" value="¿Desea activar esta convocatoria? (Si la opción está habilitada permite a los usuarios formular proyectos. Tenga en cuenta que solo puede activar una convocatoria por tipo --Proyectos de convocatoria - Proyectos de ejecicio DEMO)" className="inline-block mb-4" />
                <br />
                <Switch checked={dataConvocatoria.esta_activa} onChange={(e) => setDataConvocatoria('esta_activa', e.target.checked)} />
              </div>

              <div>
                <div className="mt-10 mb-20">
                  <Label required labelFor="lineas_programaticas_activas" className="mb-4" value="Seleccione las líneas programáticas las cuales quiere activar" />
                  <MultipleSelect id="lineas_programaticas_activas" selectedValue={dataConvocatoria.lineas_programaticas_activas} onChange={(e) => setDataConvocatoria('lineas_programaticas_activas', e.target.value)} items={lineas_programaticas} isMulti={true} error={errors.lineas_programaticas_activas} placeholder="Seleccione las líneas programáticas" required />
                </div>
              </div>

              <div className="mt-10 mb-20">
                <Label required labelFor="visible" value="Defina la visibilidad de la convocatoria. (Si la opción está habilitada permite a los usuarios visualizar la convocatoria)" className="inline-block mb-4" />
                <br />
                <Switch checked={dataConvocatoria.visible} onChange={(e) => setDataConvocatoria('visible', e.target.checked)} onMessage="Visible" offMessage="Oculta" />
              </div>

              {(convocatoria.tipo_convocatoria == 1 || convocatoria.tipo_convocatoria == 3) && (
                <div className="mt-4 mb-20">
                  <Label required labelFor="mostrar_recomendaciones" value="¿Desea que el formulador visualice las recomendaciones hechas por los evaluadores?" className="inline-block mb-4" />
                  <br />
                  <Switch checked={dataConvocatoria.mostrar_recomendaciones} onChange={(e) => setDataConvocatoria('mostrar_recomendaciones', e.target.checked)} />
                </div>
              )}
            </fieldset>
            <div className="shadow-inner bg-app-200 border-app-400 flex items-center justify-between mt-14 px-8 py-4">
              {convocatoria && (
                <small className="flex items-center text-app-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Si no desea hacer cambios en los datos, puede dejar el formulario en blanco.
                </small>
              )}

              {isSuperAdmin && (
                <PrimaryButton type="submit" disabled={processingConvocatoria}>
                  Editar convocatoria
                </PrimaryButton>
              )}
            </div>
          </form>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default EditConvocatoria;
