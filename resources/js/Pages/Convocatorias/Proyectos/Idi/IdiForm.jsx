import { useState } from 'react';
import { route } from '@/Utils';
import { Inertia } from '@inertiajs/inertia';

import Select from '@/Components/Select';
import MultipleSelect from '@/Components/MultipleSelect';
import Switch from '@/Components/Switch';
import Checkbox from '@smui/checkbox';
import FormField from '@smui/form-field';
import Radio from '@smui/radio';
import Input from '@/Components/Input';
import InputError from '@/Components/InputError';
import Label from '@/Components/Label';
import Textarea from '@/Components/Textarea';
import p from '@/Components/p';
import RecomendacionEvaluador from '@/Components/RecomendacionEvaluador';

const IdiEditForm = ({
  isSuperAdmin,
  idi,
  convocatoria,
  evaluacion,
  form,
  errors,
  redesConocimiento,
  areasConocimiento,
  subareasConocimiento,
  disciplinasSubareaConocimiento,
  actividadesEconomicas,
  tematicasEstrategicas,
  lineasInvestigacion,
  tecnoacademia,
  lineasTecnoacademia,
  tecnoacademias,
  municipios,
  areasTematicasEni,
  lineasInvestigacionEni,
  opcionesIDiDropdown,
  programasFormacionConRegistroCalificado,
  programasFormacionSinRegistroCalificado,
  tieneVideo,
  requiereJustificacionIndustria4,
  requiereJustificacionEconomiaNaranja,
  requiereJustificacionPoliticaDiscapacidad,
  requiereJustificacionAntencionPluralista,
  requiereJustificacionSectorAgricola,
  lineasProgramaticas,
  gruposInvestigacion,
  mesasSectoriales,
}) => {
  const [arrayLineasTecnoacademia, setArrayLineasTecnoacademia] = useState(
    lineasTecnoacademia.filter((obj) => obj.tecnoacademia_id === tecnoacademia?.id)
  );

  const selectLineasTecnoacademia = (event) => {
    const filteredLineasTecnoacademia = lineasTecnoacademia.filter((obj) => obj.tecnoacademia_id === event.detail?.value);
    setArrayLineasTecnoacademia(filteredLineasTecnoacademia);
  };

  const [arraySubareasConocimiento, setArraySubareasConocimiento] = useState(
    subareasConocimiento.filter((obj) => obj.area_conocimiento_id === form.area_conocimiento_id)
  );

  const selectAreaConocimiento = (event) => {
    const filteredSubareasConocimiento = subareasConocimiento.filter(
      (obj) => obj.area_conocimiento_id === event.detail?.value
    );
    setArraySubareasConocimiento(filteredSubareasConocimiento);
  };

  const [arrayDisciplinasSubareaConocimiento, setArrayDisciplinasSubareaConocimiento] = useState(
    disciplinasSubareaConocimiento.filter((obj) => obj.subarea_conocimiento_id === form.subarea_conocimiento_id)
  );

  const selectSubreaConocimiento = (event) => {
    const filteredDisciplinasSubareaConocimiento = disciplinasSubareaConocimiento.filter(
      (obj) => obj.subarea_conocimiento_id === event.detail?.value
    );
    setArrayDisciplinasSubareaConocimiento(filteredDisciplinasSubareaConocimiento);
  };

  const syncColumnLong = async (column, form) => {
    return new Promise((resolve) => {
      if (typeof column !== undefined && typeof form !== undefined && idi.proyecto.allowed.to_update) {
        //guardar
        Inertia.put(route('convocatorias.idi.updateLongColumn', [convocatoria.id, idi.id, column]), { [column]: form[column] }, {
          onError: (resp) => resolve(resp),
          onFinish: () => resolve({}),
          preserveScroll: true,
        });
      } else {
        resolve({});
      }
    });
  };

  return (
    <>
      <div className="py-24">
        <Label
          required
          disabled={evaluacion ? 'disabled' : undefined}
          labelFor="titulo"
          className="font-medium inline-block mb-10 text-center text-gray-700 text-sm w-full"
          value="Descripción llamativa que orienta el enfoque del proyecto, indica el cómo y el para qué. (Máximo 20 palabras)"
        />
        <Textarea
          label="Título"
          id="titulo"
          sinContador={true}
          error={errors.titulo}
          value={form.titulo}
          onInput={(e) => setData({ ...form, titulo: e.target.value })}
          classes={`bg-transparent block border-0 ${errors.titulo ? '' : 'outline-none-important'} mt-1 outline-none text-4xl text-center w-full`}
          required
          disabled={evaluacion ? 'disabled' : undefined}
        />
      </div>
      <div className="py-24">
        {idi.proyecto.allowed.to_update && <p className="text-center">Fecha de ejecución</p>}
        <small className="text-red-400 block text-center"> * Campo obligatorio </small>

        <div className="mt-4 flex items-start justify-around">
          <div className={`mt-4 flex ${errors.fecha_inicio ? '' : 'items-center'}`}>
            <Label
              required
              disabled={evaluacion ? 'disabled' : undefined}
              labelFor="fecha_inicio"
              className={errors.fecha_inicio ? 'top-3.5 relative' : ''}
              value="Del"
            />
            <div className="ml-4">
              <input
                id="fecha_inicio"
                type="date"
                className="mt-1 block w-full p-4"
                value={form.fecha_inicio}
                onInput={(e) => setData({ ...form, fecha_inicio: e.target.value })}
                required
                disabled={evaluacion ? 'disabled' : undefined}
              />
            </div>
          </div>
          <div className={`mt-4 flex ${errors.fecha_finalizacion ? '' : 'items-center'}`}>
            <Label
              required
              disabled={evaluacion ? 'disabled' : undefined}
              labelFor="fecha_finalizacion"
              className={errors.fecha_finalizacion ? 'top-3.5 relative' : ''}
              value="hasta"
            />
            <div className="ml-4">
              <input
                id="fecha_finalizacion"
                type="date"
                className="mt-1 block w-full p-4"
                value={form.fecha_finalizacion}
                onInput={(e) => setData({ ...form, fecha_finalizacion: e.target.value })}
                required
                disabled={evaluacion ? 'disabled' : undefined}
              />
            </div>
          </div>
        </div>
        {errors.fecha_inicio || errors.fecha_finalizacion || errors.max_meses_ejecucion ? (
          <div className="mb-20 flex justify-center mt-4">
            <InputError classes="text-center" message={errors.fecha_inicio} />
            <InputError classes="text-center" message={errors.fecha_finalizacion} />
            <InputError classes="text-center" message={errors.max_meses_ejecucion} />
          </div>
        ) : null}
      </div>
    </>
  );
};

export default IdiEditForm;
