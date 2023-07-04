import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { route, checkRole } from '@/Utils';

const ExampleComponent = ({auth, convocatoria, idi, errors, allowedToCreate }) => {
  const { data, post, put, reset, processing } = useForm({
    password: '',
  });

  const [proyectoId, setProyectoId] = useState(null);
  const [allowedToDestroy, setAllowedToDestroy] = useState(false);

  const authUser = auth.user;
  const isSuperAdmin = checkRole(authUser, [1]);

  return (
     <AuthenticatedLayout
      user={authUser}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}
    >

          <div slot="title">
          Investigación aplicada y semilleros de investigación en centros de formación - Línea 66
          <br />

          Actualización y modernización tecnológica de los centros de formación - Línea 23
          <br />

          Dotación tecnológica de ambientes de formación para las nuevas sedes - Línea 23
          <br />

          Fomento de la innovación y desarrollo tecnológico en las empresas - Línea 82

          <br />

          {convocatoria.tipo_convocatoria == 2 && (
            <>- Proyectos de ejercicio (DEMO)</>
          )}

          <p className="mt-10 text-xl">
            Ahora se listan únicamente los proyectos que usted ha creado y también en los que está asociado.
          </p>
        </div>

        <div slot="actions">
          {allowedToCreate && (
            <Link href={route('convocatorias.idi.create', [convocatoria.id])}
              variant="raised"
            >
              Crear proyecto I+D+i
            </Link>
          )}
        </div>
        
      <table
        className="mt-20"
      >


        <thead slot="thead">
          <tr className="text-left font-bold">
            <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">
              Código
            </th>
            <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">
              Título
            </th>
            <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">
              Fecha de ejecución
            </th>
            <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl w-full">
              Estado (Evaluación)
              {convocatoria.tipo_convocatoria == 2 && '(No aplica para proyectos demo)'}
            </th>
            <th className="px-6 pt-6 pb-4 sticky top-0 z-10 bg-white shadow-xl text-center th-actions">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody slot="tbody">
          {idi.data.map(({ id, proyecto, titulo, fecha_ejecucion }) => (
            <tr key={id} className="hover:bg-gray-100 focus-within:bg-gray-100">
              <td className="border-t">
                <p className="px-6 py-4 focus:text-app-500">
                  {proyecto?.codigo}
                  {proyecto?.mostrar_recomendaciones &&
                    proyecto?.mostrar_requiere_subsanacion &&
                    JSON.parse(proyecto?.estado)?.requiereSubsanar && (
                      <span className="bg-red-100 inline-block mt-2 p-2 rounded text-red-400">
                        Requiere ser subsanado
                      </span>
                    )}
                </p>
              </td>
              <td className="border-t">
                <p className="px-6 py-4 focus:text-app-500">{titulo}</p>
              </td>
              <td className="border-t">
                <p className="px-6 py-4">{fecha_ejecucion}</p>
              </td>
              <td className="border-t">
                {isSuperAdmin ||
                checkRole(authUser, [18]) ||
                (checkRole(authUser, [4, 6]) &&
                  proyecto?.mostrar_recomendaciones &&
                  convocatoria.tipo_convocatoria == 1) ||
                (checkRole(authUser, [4, 6]) &&
                  proyecto?.mostrar_recomendaciones &&
                  convocatoria.tipo_convocatoria == 3) ||
                (convocatoria.fase == 5 &&
                  proyecto?.mostrar_recomendaciones &&
                  convocatoria.tipo_convocatoria == 1) ||
                (convocatoria.fase == 5 &&
                  proyecto?.mostrar_recomendaciones &&
                  convocatoria.tipo_convocatoria == 3) ? (
                  <p className="px-6 py-4">
                    {proyecto?.estado_evaluacion_idi?.estado}
                    <small>
                      Puntaje: {proyecto?.estado_evaluacion_idi?.puntaje}
                    </small>
                    {isSuperAdmin || checkRole(authUser, [18]) ? (
                      <>
                        <br />
                        <small>
                          Número de recomendaciones:{' '}
                          {proyecto?.estado_evaluacion_idi?.numeroRecomendaciones}
                          <br />
                          Evaluaciones:{' '}
                          {proyecto?.estado_evaluacion_idi?.evaluacionesHabilitadas}{' '}
                          habilitada(s) /{' '}
                          {proyecto?.estado_evaluacion_idi?.evaluacionesFinalizadas}{' '}
                          finalizada(s)
                          <br />
                          {proyecto?.estado_evaluacion_idi?.alerta && (
                            <strong className="text-red-500">
                              Importante: {proyecto?.estado_evaluacion_idi?.alerta}
                            </strong>
                          )}
                        </small>
                      </>
                    ) : null}
                  </p>
                ) : (
                  <p className="px-6 py-4">
                    Aún no tiene permisos para ver el estado de evaluación de este proyecto.
                  </p>
                )}
              </td>

              <td className="border-t td-actions">
                {/* <DataTableMenu
                  className={idi.data.length < 3 ? 'z-50' : ''}
                >
                  <Item
                    onSMUIAction={() =>
                      Inertia.visit(
                        route('convocatorias.idi.edit', [convocatoria.id, id])
                      )
                    }
                    disabled={!proyecto?.allowed?.to_view}
                    className={!proyecto?.allowed?.to_view ? 'hidden' : ''}
                  >
                    <Text>Ver detalles</Text>
                  </Item>
                  <Separator
                    className={!proyecto?.allowed?.to_destroy ? 'hidden' : ''}
                  />
                  <Item
                    onSMUIAction={() => {
                      proyectoId = id;
                      dialogEliminar = true;
                      allowedToDestroy = proyecto?.allowed?.to_destroy;
                    }}
                    disabled={!proyecto?.allowed?.to_destroy}
                    className={!proyecto?.allowed?.to_destroy ? 'hidden' : ''}
                  >
                    <Text>Eliminar</Text>
                  </Item>
                </DataTableMenu> */}
              </td>
            </tr>
          ))}

          {idi.data.length === 0 && (
            <tr>
              <td className="border-t px-6 py-4" colspan="5">
                Sin información registrada
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {/* <Pagination links={idi.links} /> */}


    </AuthenticatedLayout>
  );
};

export default ExampleComponent;
