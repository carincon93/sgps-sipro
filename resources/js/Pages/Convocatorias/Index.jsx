import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import MenuMui from '@/Components/Menu'
import EditIcon from '@mui/icons-material/Edit'
import { checkRole } from '@/Utils'
import { Link, router } from '@inertiajs/react'
import { Divider, Grid, MenuItem } from '@mui/material'
import ButtonMui from '@/Components/Button'
import AlertMui from '@/Components/Alert'

export default function Dashboard({ auth, convocatorias }) {
    const authUser = auth.user
    const isSuperAdmin = checkRole(authUser, [1])

    return (
        <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de convocatorias</h2>}>
            <Grid item md={6}>
                <h1 className="font-bold text-5xl">Lista de convocatorias</h1>
            </Grid>

            <Grid item md={6}>
                <figure>
                    <img src={'/images/dashboard.png'} alt="" />
                </figure>
            </Grid>

            {isSuperAdmin && (
                <Grid item md={12}>
                    <AlertMui hiddenIcon={true} className="my-20">
                        <p>A continuación, se listan todas las convocatorias, si desea crear una nueva de clic en el siguiente botón.</p>
                        <Link href={route('convocatorias.create')} className="mt-8 mb-20">
                            Crear convocatoria
                        </Link>
                    </AlertMui>
                </Grid>
            )}

            {isSuperAdmin || checkRole(authUser, [11]) || checkPermission(authUser, [1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 17, 18, 19, 14, 15, 16, 20, 21])
                ? convocatorias.data.map((convocatoria) =>
                      (convocatoria.visible) || isSuperAdmin || checkRole(authUser, [5, 17, 18, 19, 20]) ? (
                          <Grid item md={4} key={convocatoria.id} className="mb-20 relative">
                              {isSuperAdmin && (
                                  <MenuMui className="!min-w-0 !absolute right-0 z-10" text={<EditIcon />}>
                                      <MenuItem onClick={() => router.visit(route('convocatorias.edit', convocatoria.id))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                          Editar convocatoria
                                      </MenuItem>

                                      <MenuItem onClick={() => router.visit(route('convocatorias.convocatoria-rol-sennova.index', convocatoria.id))}>Roles SENNOVA</MenuItem>

                                      <MenuItem onClick={() => router.visit(route('convocatorias.convocatoria-presupuesto.index', convocatoria.id))}>Rúbrica presupuestal SENNOVA</MenuItem>

                                      <Divider />
                                      <MenuItem onClick={() => ((convocatoria_id = convocatoria.id), (dialogEliminar = true), (allowedToDestroy = isSuperAdmin))} disabled={!isSuperAdmin} className={!isSuperAdmin ? 'hidden' : ''}>
                                          Eliminar convocatoria
                                      </MenuItem>
                                  </MenuMui>
                              )}
                              <ButtonMui
                                  onClick={(e) => {
                                      e.stopPropagation, router.visit(route('convocatorias.lineas-programaticas.index', convocatoria.id))
                                  }}
                                  className="w-full relative overflow-hidden !shadow-md px-6 py-2 h-72 flex justify-center items-center flex-col"
                              >
                                  <h1 className="text-2xl text-center my-4">
                                      {convocatoria.tipo_convocatoria == 1 ? (
                                          <>
                                              {convocatoria.descripcion}
                                              <br />
                                              {convocatoria.year}
                                          </>
                                      ) : convocatoria.tipo_convocatoria == 2 ? (
                                          <>Proyectos de ejercicio (DEMO)</>
                                      ) : (
                                          <>Nuevas TecnoAcademias - Nuevos Tecnoparques</>
                                      )}
                                  </h1>

                                  <div className="bg-gray-700 text-white p-2 rounded-sm mt-4 flex">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 mr-2">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                      </svg>

                                      <small>
                                          {' '}
                                          Convocatoria {convocatoria.esta_activa ? 'activa' : 'inactiva'} {convocatoria.visible && isSuperAdmin ? ' y visible' : convocatoria.visible == false && isSuperAdmin ? 'y oculta' : ''}
                                      </small>
                                  </div>
                              </ButtonMui>
                          </Grid>
                      ) : null,
                  )
                : null}
        </AuthenticatedLayout>
    )
}
