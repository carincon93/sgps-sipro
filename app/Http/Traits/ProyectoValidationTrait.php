<?php

namespace App\Http\Traits;

use App\Models\Anexo;
use App\Models\Proyecto;
use Illuminate\Support\Facades\Log;

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
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->problema_central == '':
                return false;
                break;
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->problema_central == '':
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
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            if ($efectoDirecto->descripcion != '') {
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
        $countEfectoIndirecto = 0;
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            if ($efectoDirecto->descripcion != '' && $efectoDirecto->efectosIndirectos()->count() == 0) {
                $countEfectoIndirecto++;
            }
        }

        return $countEfectoIndirecto == 0 ? true : false;
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
        foreach ($proyecto->causasDirectas as $causaDirecta) {
            if ($causaDirecta->descripcion != '') {
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
        $countCausaIndirecta = 0;
        foreach ($proyecto->causasDirectas as $causaDirecta) {
            if ($causaDirecta->descripcion != '' && $causaDirecta->causasIndirectas()->count() == 0) {
                $countCausaIndirecta++;
            }
        }

        return $countCausaIndirecta == 0 ? true : false;
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
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->objetivo_general == '':
                return false;
                break;
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->objetivo_general == '':
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
        $countResultado = 0;

        if ($proyecto->lineaProgramatica->codigo == 68) {
            return true;
        }
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            if ($efectoDirecto->descripcion != '' && $efectoDirecto->resultado->descripcion == '') {
                $countResultado++;
            }
        }

        return $countResultado == 0 ? true : false;
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
        $countObjetivoEspecifico = 0;
        foreach ($proyecto->causasDirectas as $causaDirecta) {
            if ($causaDirecta->descripcion != '' && $causaDirecta->objetivoEspecifico && $causaDirecta->objetivoEspecifico->descripcion == '') {
                $countObjetivoEspecifico++;
            }
        }

        return $countObjetivoEspecifico == 0 ? true : false;
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
        $countActividad = 0;
        foreach ($proyecto->causasDirectas as $causaDirecta) {
            foreach ($causaDirecta->causasIndirectas as $causaIndirecta) {
                if ($causaIndirecta && $causaIndirecta->descripcion != '' && $causaIndirecta->actividad && $causaIndirecta->actividad->descripcion == null) {
                    $countActividad++;
                }
            }
        }

        return $countActividad == 0 ? true : false;
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
        $countImpacto = 0;
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            foreach ($efectoDirecto->efectosIndirectos as $efectoIndirecto) {
                if ($efectoIndirecto->descripcion != '' && $efectoIndirecto->impacto && $efectoIndirecto->impacto->descripcion == null) {
                    $countImpacto++;
                }
            }
        }

        return $countImpacto == 0 ? true : false;
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
        $countActividadPresupuesto = 0;
        foreach ($proyecto->causasDirectas as $causaDirecta) {
            foreach ($causaDirecta->causasIndirectas as $causaIndirecta) {
                if ($causaIndirecta->descripcion != '' && $causaIndirecta->actividad && $causaIndirecta->actividad->proyectoPresupuesto()->count() == 0) {
                    $countActividadPresupuesto++;
                }
            }
        }

        return $countActividadPresupuesto == 0 ? true : false;
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
        $countProductoActividad = 0;
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            foreach ($efectoDirecto->resultado->productos as $producto) {
                if ($producto->actividades()->count() == 0) {
                    $countProductoActividad++;
                }
            }
        }

        return $countProductoActividad == 0 ? true : false;
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
        $countResultadoProducto = 0;
        foreach ($proyecto->efectosDirectos as $efectoDirecto) {
            if ($efectoDirecto->resultado->descripcion != '' && $efectoDirecto->resultado->productos()->count() == 0) {
                $countResultadoProducto++;
            }
        }

        return $countResultadoProducto == 0 ? true : false;
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
        $countAnalisisObjetivo = 0;
        $countAnalisisProducto = 0;
        $countAnalisisActividad = 0;
        foreach ($proyecto->analisisRiesgos as $analisisRiesgo) {
            if ($analisisRiesgo->nivel == 'A nivel del objetivo general') {

                $countAnalisisObjetivo++;
            }

            if ($analisisRiesgo->nivel == 'A nivel de productos') {
                $countAnalisisProducto++;
            }

            if ($analisisRiesgo->nivel == 'A nivel de actividades') {
                $countAnalisisActividad++;
            }
        }


        return $countAnalisisObjetivo > 0 && $countAnalisisProducto > 0 && $countAnalisisActividad > 0 ? true : false;
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
        $anexos = Anexo::select('anexos.*')->join('anexo_lineas_programaticas', 'anexos.id', 'anexo_lineas_programaticas.anexo_id')->where('anexos.obligatorio', true)->where('anexo_lineas_programaticas.linea_programatica_id', $proyecto->lineaProgramatica->id)->get();

        $count = 0;
        foreach ($anexos as $anexo) {
            if ($proyecto->proyectoAnexo()->where('proyecto_anexo.anexo_id', $anexo->id)->first() && $proyecto->proyectoAnexo()->where('proyecto_anexo.anexo_id', $anexo->id)->first()->exists()) {
                $count++;
            }
        }

        return $count == count($anexos) ? true : false;
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
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->bibliografia == '':
                return false;
                break;
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->bibliografia == '':
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
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->metodologia_local == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->metodologia == '':
                return false;
                break;
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->metodologia == '':
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
            case $proyecto->proyectoLinea66()->exists() && $proyecto->proyectoLinea66->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea70()->exists() && $proyecto->proyectoLinea70->propuesta_sostenibilidad_social == '':
                return false;
                break;
            case $proyecto->proyectoLinea69()->exists() && $proyecto->proyectoLinea69->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea68()->exists() && $proyecto->proyectoLinea68->propuesta_sostenibilidad == '':
                return false;
                break;
            case $proyecto->proyectoLinea65()->exists() && $proyecto->proyectoLinea65->propuesta_sostenibilidad == '':
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
        $rubrosRequierenEstudioMercado = true;

        $countSoportes = 0;
        foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
            $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get()->pluck(['requiere_estudio_mercado']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubrosRequierenEstudioMercado = false;
                    break;
                }
            }

            if ($rubrosRequierenEstudioMercado && $presupuesto->soportesEstudioMercado()->count() < 2) {
                $countSoportes++;
            }
        }

        return $countSoportes > 0 ? false : true;
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
        $rubrosRequierenEstudioMercado = true;
        $countSoportes = 0;
        foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
            $data = $presupuesto->convocatoriaProyectoRubrosPresupuestales()->select('convocatoria_presupuesto.id', 'convocatoria_presupuesto.requiere_estudio_mercado')->get()->pluck(['requiere_estudio_mercado']);

            foreach ($data as $item) {
                if (!$item) {
                    $rubrosRequierenEstudioMercado = false;
                    break;
                }
            }

            if (!$rubrosRequierenEstudioMercado && $presupuesto->formato_estudio_mercado == null) {
                $countSoportes++;
            }
        }

        return $countSoportes > 0 ? false : true;
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

        $countEdt = 0;
        if ($proyecto->proyectoLinea70()->exists()) {
            foreach ($proyecto->proyectoPresupuesto as $presupuesto) {
                if ($presupuesto->convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo == 20202008005096 && !$presupuesto->edt()->exists()) {
                    $countEdt++;
                }
            }
        }

        return $countEdt > 0 ? false : true;
    }
}
