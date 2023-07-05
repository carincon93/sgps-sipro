import { useState } from 'react';
import { useForm } from '@inertiajs/react';

import AuthenticatedLayout from '@/Layouts/Authenticated';
import { checkRole, checkPermission, route } from '@/Utils';
import PrimaryButton from '@/Components/PrimaryButton';
import Stepper from '@/Components/Stepper';
import IdiForm from './IdiForm';

const IdiEdit = ({
    auth,
  convocatoria,
  idi,
  mesasSectoriales,
  lineasProgramaticas,
  redesConocimiento,
  areasConocimiento,
  subareasConocimiento,
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
  opcionesIDiDropdown,
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
  const { data, setData, put, processing, errors, reset } = useForm({
    centro_formacion_id: idi.proyecto?.centro_formacion_id,
    linea_investigacion_id: idi.linea_investigacion_id,
    area_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento.area_conocimiento_id,
    subarea_conocimiento_id: idi.disciplina_subarea_conocimiento.subarea_conocimiento_id,
    disciplina_subarea_conocimiento_id: idi.disciplina_subarea_conocimiento_id,
    tematica_estrategica_id: idi.tematica_estrategica_id,
    red_conocimiento_id: idi.red_conocimiento_id,
    linea_programatica_id: idi.proyecto?.linea_programatica_id,
    actividad_economica_id: idi.actividad_economica_id,
    grupo_investigacion_eni_id: { value: idi.grupo_investigacion_eni_id, label: gruposInvestigacion.find((item) => item.value == idi.grupo_investigacion_eni_id)?.label },
    titulo: idi.titulo,
    fecha_inicio: idi.fecha_inicio,
    fecha_finalizacion: idi.fecha_finalizacion,
    max_meses_ejecucion: idi.max_meses_ejecucion,
    video: idi.video,
    numero_aprendices: idi.numero_aprendices,
    municipios: proyectoMunicipios.length > 0 ? proyectoMunicipios : null,
    area_tematica_eni_id: proyectoAreasTematicasEni.length > 0 ? proyectoAreasTematicasEni : null,
    linea_investigacion_eni_id: proyectoLineasInvestigacionEni.length > 0 ? proyectoLineasInvestigacionEni : null,
    programas_formacion: programasFormacionConRegistroRelacionados.length > 0 ? programasFormacionConRegistroRelacionados : null,
    programas_formacion_articulados: programasFormacionSinRegistroRelacionados.length > 0 ? programasFormacionSinRegistroRelacionados : null,
    muestreo: idi.muestreo,
    actividades_muestreo: idi.actividades_muestreo,
    objetivo_muestreo: idi.objetivo_muestreo,
    recoleccion_especimenes: idi.recoleccion_especimenes,
    relacionado_plan_tecnologico: idi.relacionado_plan_tecnologico,
    relacionado_agendas_competitividad: idi.relacionado_agendas_competitividad,
    relacionado_mesas_sectoriales: idi.relacionado_mesas_sectoriales,
    relacionado_tecnoacademia: idi.relacionado_tecnoacademia,
    tecnoacademia_id: tecnoacademia?.id,
    proyecto_investigacion_pedagogica: idi.proyecto_investigacion_pedagogica,
    articulacion_eni: idi.articulacion_eni,
    justificacion_proyecto_investigacion_pedagogica: idi.justificacion_proyecto_investigacion_pedagogica,

    linea_tecnologica_id: lineasTecnoacademiaRelacionadas,
    mesa_sectorial_id: mesasSectorialesRelacionadas,

    resumen: idi.resumen,
    antecedentes: idi.antecedentes,
    marco_conceptual: idi.marco_conceptual,
    justificacion_industria_4: idi.justificacion_industria_4,
    justificacion_economia_naranja: idi.justificacion_economia_naranja,
    justificacion_politica_discapacidad: idi.justificacion_politica_discapacidad,
    atencion_pluralista_diferencial: idi.atencion_pluralista_diferencial,
    impacto_sector_agricola: idi.impacto_sector_agricola,
    bibliografia: idi.bibliografia,
    impacto_municipios: idi.impacto_municipios,
    impacto_centro_formacion: idi.impacto_centro_formacion,
  });

  const [tieneVideo, setTieneVideo] = useState(idi.video !== null);
  const [requiereJustificacionIndustria4, setRequiereJustificacionIndustria4] = useState(idi.justificacion_industria_4 !== null);
  const [requiereJustificacionEconomiaNaranja, setRequiereJustificacionEconomiaNaranja] = useState(idi.justificacion_economia_naranja !== null);
  const [requiereJustificacionPoliticaDiscapacidad, setRequiereJustificacionPoliticaDiscapacidad] = useState(idi.justificacion_politica_discapacidad !== null);
  const [requiereJustificacionAntencionPluralista, setRequiereJustificacionAntencionPluralista] = useState(idi.atencion_pluralista_diferencial !== null);
  const [requiereJustificacionSectorAgricola, setRequiereJustificacionSectorAgricola] = useState(idi.impacto_sector_agricola !== null);

  const submit = (e) => {
    e.preventDefault();
    if (idi.proyecto.allowed.to_update) {
      if (data.relacionado_tecnoacademia?.value !== 1) {
        data.tecnoacademia_id = {};
        arrayLineasTecnoacademia = [];
      }
      fput(route('convocatorias.idi.update', [convocatoria.id, idi.id]), {
        onFinish: () => {
          setDialogGuardar(false);
        },
        preserveScroll: true,
      });
    }
  };

  useEffect(() => {
    if (data.proyecto_investigacion_pedagogica === false || data.articulacion_eni === false) {
      data.grupo_investigacion_eni_id = null;
      data.linea_investigacion_eni_id = null;
      data.area_tematica_eni_id = null;
    }
  }, [data.proyecto_investigacion_pedagogica, data.articulacion_eni]);

  const handleDialogGuardar = () => {
    setDialogGuardar(true);
  };

  const handleCloseDialogGuardar = () => {
    setDialogGuardar(false);
  };

  const authUser = auth.user;
  const isSuperAdmin = checkRole(authUser, [1]);

  const arrayLineasTecnoacademia = [];

  return (
    <AuthenticatedLayout
      user={authUser}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">{idi.titulo}</h2>}
    >
      <header className="pt-[8rem]" slot="header">
        <Stepper convocatoria={convocatoria} proyecto={idi} />
      </header>

      <form onSubmit={submit} id="idi-form">
        <fieldset className="p-8 divide-y" disabled={idi.proyecto.allowed.to_update ? undefined : true}>
          <IdiForm
            isSuperAdmin={isSuperAdmin}
            lineasProgramaticas={lineasProgramaticas}
            gruposInvestigacion={gruposInvestigacion}
            mesasSectoriales={mesasSectoriales}
            tecnoacademia={tecnoacademia}
            idi={idi}
            convocatoria={convocatoria}
            form={form}
            errors={errors}
            redesConocimiento={redesConocimiento}
            areasConocimiento={areasConocimiento}
            subareasConocimiento={subareasConocimiento}
            disciplinasSubareaConocimiento={disciplinasSubareaConocimiento}
            actividadesEconomicas={actividadesEconomicas}
            tematicasEstrategicas={tematicasEstrategicas}
            lineasTecnoacademia={lineasTecnoacademia}
            lineasInvestigacion={lineasInvestigacion}
            tecnoacademias={tecnoacademias}
            municipios={municipios}
            areasTematicasEni={areasTematicasEni}
            lineasInvestigacionEni={lineasInvestigacionEni}
            opcionesIDiDropdown={opcionesIDiDropdown}
            programasFormacionConRegistroCalificado={programasFormacionConRegistroCalificado}
            programasFormacionSinRegistroCalificado={programasFormacionSinRegistroCalificado}
            tieneVideo={tieneVideo}
            requiereJustificacionIndustria4={requiereJustificacionIndustria4}
            requiereJustificacionEconomiaNaranja={requiereJustificacionEconomiaNaranja}
            requiereJustificacionPoliticaDiscapacidad={requiereJustificacionPoliticaDiscapacidad}
            requiereJustificacionAntencionPluralista={requiereJustificacionAntencionPluralista}
            requiereJustificacionSectorAgricola={requiereJustificacionSectorAgricola}
            setTieneVideo={setTieneVideo}
            setRequiereJustificacionIndustria4={setRequiereJustificacionIndustria4}
            setRequiereJustificacionEconomiaNaranja={setRequiereJustificacionEconomiaNaranja}
            setRequiereJustificacionPoliticaDiscapacidad={setRequiereJustificacionPoliticaDiscapacidad}
            setRequiereJustificacionAntencionPluralista={setRequiereJustificacionAntencionPluralista}
            setRequiereJustificacionSectorAgricola={setRequiereJustificacionSectorAgricola}
            setProyectoDialogOpen={setProyectoDialogOpen}
            arrayLineasTecnoacademia={arrayLineasTecnoacademia}
          />

          {idi.proyecto?.allowed?.to_update && (
            <div className="pt-8 pb-4 space-y-4">
              <PrimaryButton onClick={handleDialogGuardar} type="button" className="w-full">
                Guardar
              </PrimaryButton>
            </div>
          )}
        </fieldset>
      </form>
    </AuthenticatedLayout>
  );
};

export default IdiEdit;
