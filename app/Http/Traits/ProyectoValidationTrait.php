<?php

namespace App\Http\Traits;

use App\Models\ConvocatoriaAnexo;
use App\Models\Proyecto;
use Illuminate\Support\Facades\Log;
use Symfony\Component\ErrorHandler\Debug;

trait ProyectoValidationTrait
{
    /**
     *
     * Valida que haya información en el problema central
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function problemaCentral(Proyecto $proyecto)
    {
        switch ($proyecto) {
             case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoHubLinea69()->exists() && $proyecto->proyectoHubLinea69->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea83()->exists() && $proyecto->proyectoLinea83->problema_central == '':
                return false;
                break;

            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que haya mínimo 1 instructor investigador
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function minInstructoresInvestigadores(Proyecto $proyecto)
    {
        $numero = 0;
        switch ($proyecto) {
            case $proyecto->proyectoLinea66()->exists():
                foreach ($proyecto->participantes as $participante) {
                    if ($participante->pivot->rol_sennova == 3) {
                        $numero++;
                    }
                }
                return $numero < 1 ? false : true;
                break;
            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que hayan mínimo 2 aprendices en semillero de investigación
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function minAprendicesEnSemilleros(Proyecto $proyecto)
    {
        $numero = 0;
        switch ($proyecto) {
            case $proyecto->proyectoLinea66()->exists():
                foreach ($proyecto->participantes as $participante) {
                    if ($participante->pivot->rol_sennova == 4) {
                        $numero++;
                    }
                }
                return $numero < 1 ? false : true;
                break;
            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que hayan al menos dos efectos directos con descripción
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function efectosDirectos(Proyecto $proyecto)
    {
        $count = 0;
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->descripcion != '') {
                $count++;
            }
        }

        return $count >= 2 ? true : false;
    }

    /**
     *
     * Valida que hayan al menos un efecto indirecto con descripción por efecto directo
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function efectosIndirectos(Proyecto $proyecto)
    {
        $count_efecto_indirecto = 0;
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->descripcion != '' && $efecto_directo->efectosIndirectos()->count() == 0) {
                $count_efecto_indirecto++;
            }
        }

        return $count_efecto_indirecto == 0 ? true : false;
    }

    /**
     *
     * Valida que hayan al menos dos causas directas con descripción
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function causasDirectas(Proyecto $proyecto)
    {
        $count = 0;
        foreach ($proyecto->causasDirectas as $causa_directa) {
            if ($causa_directa->descripcion != '') {
                $count++;
            }
        }

        return $count >= 2 ? true : false;
    }

    /**
     *
     * Valida que hayan al menos una causas indirecta con descripción por causa directa
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function causasIndirectas(Proyecto $proyecto)
    {
        $count_causa_indirecta = 0;
        foreach ($proyecto->causasDirectas as $causa_directa) {
            if ($causa_directa->descripcion != '' && $causa_directa->causasIndirectas()->count() == 0) {
                $count_causa_indirecta++;
            }
        }

        return $count_causa_indirecta == 0 ? true : false;
    }

    /**
     *
     * Valida que haya información en el objetivo general
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function objetivoGeneral(Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoHubLinea69()->exists() && $proyecto->proyectoHubLinea69->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea83()->exists() && $proyecto->proyectoLinea83->objetivo_general == '':
                return false;
                break;


            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que haya información en cada resultado
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function resultados(Proyecto $proyecto)
    {
        $count_resultado = 0;

        if ($proyecto->lineaProgramatica->codigo == 68) {
            return true;
        }
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->descripcion != '' && $efecto_directo->resultado->descripcion == '') {
                $count_resultado++;
            }
        }

        return $count_resultado == 0 ? true : false;
    }

    /**
     *
     * Valida que haya información en cada objetivo específico
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function objetivosEspecificos(Proyecto $proyecto)
    {
        $count_objetivo_especifico = 0;
        foreach ($proyecto->causasDirectas as $causa_directa) {
            if ($causa_directa->descripcion != '' && $causa_directa->objetivoEspecifico && $causa_directa->objetivoEspecifico->descripcion == '') {
                $count_objetivo_especifico++;
            }
        }

        return $count_objetivo_especifico == 0 ? true : false;
    }

    /**
     *
     * Valida que hayan al menos una actividad con descripción por causa indirecta
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function actividades(Proyecto $proyecto)
    {
        $count_actividad = 0;
        foreach ($proyecto->causasDirectas as $causa_directa) {
            foreach ($causa_directa->causasIndirectas as $causa_indirecta) {
                if ($causa_indirecta && $causa_indirecta->descripcion != '' && $causa_indirecta->actividad && $causa_indirecta->actividad->descripcion == null) {
                    $count_actividad++;
                }
            }
        }

        return $count_actividad == 0 ? true : false;
    }

    /**
     *
     * Valida que hayan al menos un impacto con descripción por efecto indirecto
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function impactos(Proyecto $proyecto)
    {
        $count_impacto = 0;
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            foreach ($efecto_directo->efectosIndirectos as $efecto_indirecto) {
                if ($efecto_indirecto->descripcion != '' && $efecto_indirecto->impacto && $efecto_indirecto->impacto->descripcion == null) {
                    $count_impacto++;
                }
            }
        }

        return $count_impacto == 0 ? true : false;
    }

    /**
     *
     * Valida que las actividades tengan presupuesto asignado
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function actividadesPresupuesto(Proyecto $proyecto)
    {
        $count_actividad_presupuesto = 0;
        foreach ($proyecto->causasDirectas as $causa_directa) {
            foreach ($causa_directa->causasIndirectas as $causa_indirecta) {
                if ($causa_indirecta->descripcion != '' && $causa_indirecta->actividad && $causa_indirecta->actividad->proyectoPresupuesto()->count() == 0) {
                    $count_actividad_presupuesto++;
                }
            }
        }

        return $count_actividad_presupuesto == 0 ? true : false;
    }

    /**
     *
     * Valida que las actividades tengan presupuesto asignado
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function productosActividades(Proyecto $proyecto)
    {
        $count_producto_actividad = 0;
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->resultado) {
                foreach ($efecto_directo->resultado->productos as $producto) {
                    if ($producto->actividades()->count() == 0) {
                        $count_producto_actividad++;
                    }
                }
            }
        }

        return $count_producto_actividad == 0 ? true : false;
    }

    /**
     *
     * Valida que los resultados tengan al menos un producto asignado
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function resultadoProducto(Proyecto $proyecto)
    {
        $count_resultado_producto = 0;
        foreach ($proyecto->efectosDirectos as $efecto_directo) {
            if ($efecto_directo->resultado && $efecto_directo->resultado->descripcion != '' && $efecto_directo->resultado->productos()->count() == 0) {
                $count_resultado_producto++;
            }
        }

        return $count_resultado_producto == 0 ? true : false;
    }

    /**
     *
     * Valida que haya al menos un riesgo por nivel de riesgo
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function analisisRiesgo(Proyecto $proyecto)
    {
        $count_analisis_objetivo = 0;
        $count_analisis_producto = 0;
        $count_analisis_actividad = 0;
        foreach ($proyecto->analisisRiesgos as $analisis_riesgo) {
            if ($analisis_riesgo->nivel == 1) {
                $count_analisis_objetivo++;
            }

            if ($analisis_riesgo->nivel == 2) {
                $count_analisis_producto++;
            }

            if ($analisis_riesgo->nivel == 3) {
                $count_analisis_actividad++;
            }
        }

        return $count_analisis_objetivo > 0 && $count_analisis_producto > 0 && $count_analisis_actividad > 0 ? true : false;
    }

    /**
     *
     * Valida que hayan anexos cargados
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function anexos(Proyecto $proyecto)
    {
        $linea_programatica_id = $proyecto->linea_programatica_id;

        $convocatoria_anexos = ConvocatoriaAnexo::where('convocatoria_id', $proyecto->convocatoria_id)
                    ->with('anexo', 'lineasProgramaticas')
                    ->whereHas('lineasProgramaticas', function ($query) use ($linea_programatica_id) {
                        $query->where('lineas_programaticas.id', $linea_programatica_id);
                    })
                    ->get();

        $count = 0;
        foreach ($convocatoria_anexos as $convocatoria_anexo) {
            if ($proyecto->proyectoAnexo()->where('proyecto_anexo.anexo_id', $convocatoria_anexo->id)->first() && $proyecto->proyectoAnexo()->where('proyecto_anexo.anexo_id', $convocatoria_anexo->id)->first()->exists()) {
                $count++;
            }
        }

        return $count == count($convocatoria_anexos) ? true : false;
    }

    /**
     *
     * Valida que generalidades se este completo
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function generalidades(Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoHubLinea69()->exists() && $proyecto->proyectoHubLinea69->bibliografia == '':
                return false;
                break;
             case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea83()->exists() && $proyecto->proyectoLinea83->bibliografia == '':
                return false;
                break;
            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que la metodología este completa
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function metodologia(Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoHubLinea69()->exists() && $proyecto->proyectoHubLinea69->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->metodologia_local == '':
                return false;
                break;
            case $proyecto->proyectoLinea83()->exists() && $proyecto->proyectoLinea83->metodologia_local == '':
                return false;
                break;
            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que la propuesta de sostenibilidad este completa
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function propuestaSostenibilidad(Proyecto $proyecto)
    {
        switch ($proyecto) {
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoHubLinea69()->exists() && $proyecto->proyectoHubLinea69->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->propuesta_sostenibilidad_social == '':
                return false;
                break;
            case $proyecto->proyectoLinea83()->exists() && $proyecto->proyectoLinea83->propuesta_sostenibilidad_social == '':
                return false;
                break;

            default:
                break;
        }

        return true;
    }

    /**
     *
     * Valida que la articulación SENNOvA este completa
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function articulacionSennova(Proyecto $proyecto)
    {
        return $proyecto->lineasInvestigacion()->count() > 0 ? true : false;
    }

    /**
     *
     * Valida que cada estudio de mercado tengan al menos dos soportes
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function soportesEstudioMercado(Proyecto $proyecto)
    {
        $rubros_requieren_estudio_mercado = true;

        $count_soportes = 0;
        foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
            $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get()->pluck(['requiere_estudio_mercado']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_requieren_estudio_mercado = false;
                    break;
                }
            }

            if ($rubros_requieren_estudio_mercado && $presupuesto->soportesEstudioMercado()->count() < 2) {
                $count_soportes++;
            }
        }

        return $count_soportes > 0 ? false : true;
    }

    /**
     *
     * Valida que el formato de estudio de mercado este cargado
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function estudiosMercadoArchivo(Proyecto $proyecto)
    {
        $rubros_requieren_estudio_mercado = true;
        $count_soportes = 0;
        foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
            $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get();

            foreach ($data as $item) {
                if (!$item) {
                    $rubros_requieren_estudio_mercado = false;
                    break;
                }
            }

            if (!$rubros_requieren_estudio_mercado && $presupuesto->formato_estudio_mercado == null) {
                $count_soportes++;
            }
        }

        return $count_soportes > 0 ? false : true;
    }

    /**
     *
     * Valida que haya un edt por uso presupuestal 'servicios de organización y asistencia de convenciones y ferias'
     *
     * @param  mixed $proyecto
     * @return bool
     */
    public static function edt(Proyecto $proyecto)
    {
        return true;

        $count_edt = 0;
        if ($proyecto->proyectoLinea70()->exists()) {
            foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
                if ($presupuesto->convocatoriaPresupuesto->rubroPresupuestal->usoPresupuestal->codigo == 20202008005096 && !$presupuesto->edt()->exists()) {
                    $count_edt++;
                }
            }
        }

        return $count_edt > 0 ? false : true;
    }
}
