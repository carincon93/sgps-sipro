import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import BasicMenu from "@/Components/Menu"
import { Divider, MenuItem } from "@mui/material"
import { route, checkRole } from '@/Utils';
import { Link } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

const ConvocatoriaLineasProgramaticas = ({ auth, convocatoria, lineasProgramaticas }) => {
  const authUser = auth.user;
  const isSuperAdmin = checkRole(authUser, [1]);

  return (
    <AuthenticatedLayout
      user={authUser}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Líneas programáticas</h2>}
    >
      <div className="py-12">
        <h1 className="text-4xl text-center">
          A continuación, se listan las líneas programáticas de la vigencia {convocatoria.year} en las que puede formular proyectos.

          {isSuperAdmin &&
            <span>
                <BasicMenu className="!min-w-0" text="Modificar convocatoria">
                    <MenuItem onClick={() => Inertia.visit(route('convocatorias.edit', convocatoria.id))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                        Editar convocatoria
                    </MenuItem>

                    <MenuItem onClick={() => Inertia.visit(route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id))}>
                        Roles SENNOVA
                    </MenuItem>

                    <MenuItem onClick={() => Inertia.visit(route('convocatorias.convocatoria-presupuesto.index', convocatoria.id))}>
                        Rúbrica presupuestal SENNOVA
                    </MenuItem>

                    <Divider />
                    <MenuItem onClick={() => ((convocatoria_id = convocatoria.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                        Eliminar convocatoria
                    </MenuItem>
                </BasicMenu>
            </span>
        }
        </h1>
        <div className="flex justify-around flex-wrap mt-24 gap-4 mb-12">
          {lineasProgramaticas.map((lineaProgramatica) => {
            if (JSON.parse(convocatoria.lineas_programaticas_activas)?.includes(lineaProgramatica.id)) {
              return (
                <div className="w-80 h-96" key={lineaProgramatica.id}>
                  <Link
                    href={route('convocatorias.lineas-programaticas.proyectos', [convocatoria.id, lineaProgramatica.id])}
                    className="bg-white overflow-hidden z-[2] relative text-center shadow-sm sm:rounded-lg px-6 py-2 hover:bg-app-500 hover:text-white flex justify-around items-center flex-col m-auto h-96"
                  >
                    {lineaProgramatica.nombre}
                  </Link>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default ConvocatoriaLineasProgramaticas;
