<?php

namespace App\Http\Traits;

use Illuminate\Support\Facades\Storage;

trait PresupuestoValidationTrait
{
    /**
     * totalSegundoGrupoPresupuestalProyecto
     *
     * Obtiene el total de un grupo presupuestal dado el código del segundo grupo presupuestal
     * 
     * @param  mixed $proyecto
     * @param  mixed $codigo
     * @return int
     */
    public static function totalSegundoGrupoPresupuestalProyecto($proyecto, $codigo)
    {
        $total = 0;

        foreach ($proyecto->proyectoPresupuesto as $proyectoPresupuesto) {
            $codigoSegundoPresupuestal = $proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo;
            if ($proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->sumar_al_presupuesto) {
                if ($codigoSegundoPresupuestal == $codigo) {
                    $total += $proyectoPresupuesto->valor_total;
                }
            }
        }

        return $total;
    }

    /**
     * viaticosValidation
     *
     * REQ-LINEA-66 Para el proyecto solo se podrá destinar hasta $4.594.000 de viáticos, lo cual comprende la sumatoria de todos los rubros que tengan esta finalidad. 
     * 
     * @param  mixed $proyecto
     * @param  mixed $codigoSegundoPresupuestal
     * @param  mixed $valor
     * @param  mixed $numeroItems
     * @param  mixed $valorGuardado
     * @param  mixed $numeroItemsGuardado
     * @return void
     */
    public static function viaticosValidation($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal, $valorMaximo)
    {
        $codigoSegundoPresupuestal = $convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo;
        if ($codigoSegundoPresupuestal == '2042186' || $codigoSegundoPresupuestal == '2041101' || $codigoSegundoPresupuestal == '2041102' || $codigoSegundoPresupuestal == '2041104') {
            if ($proyecto->lineaProgramatica->codigo == 66 && $codigoSegundoPresupuestal == '2041101') {
                return false;
            }

            $total = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2042186') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2041101') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2041102') + +self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2041104');
            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoria_presupuesto_id == $convocatoriaPresupuesto->id) {
                $total = $total - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $total += $valorTotal;
            }

            return ($total > $valorMaximo) ? true : false;
        }

        return false;
    }

    /**
     * serviciosEspecialesConstruccionValidation
     *
     * REQ-LINEA-66 "El valor no debe superar el 5% del rubro de "MAQUINARIA INDUSTRIAL" y no lo debe dejar guardar hasta que se cumpla esa regla.
     * Dejar el siguiente mensaje para este rubro: Antes de diligenciar este rubro de "SERVICIOS ESPECIALES DE CONSTRUCCIÓN - ADECUACIONES Y CONSTRUCCIONES" tenga en cuenta que el valor total NO debe superar el 5% del total del rubro "MAQUINARIA INDUSTRIAL".
     * 
     * @param  mixed $proyecto
     * @param  mixed $proyectoPresupuesto
     * @param  mixed $metodo
     * @param  mixed $primerValor
     * @param  mixed $segundoValor
     * @param  mixed $tercerValor
     * @return boolean
     */
    public static function serviciosEspecialesConstruccionValidation($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        $porcentajeMaquinariaIndustrial             = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040115') * 0.05;
        $totalAdecuacionesYConstruccionesProyecto   = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2045110');

        if ($porcentajeMaquinariaIndustrial == 0) {
            return false;
        }

        if ($convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo == '2045110') {
            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->id == $convocatoriaPresupuesto->id) {
                $totalAdecuacionesYConstruccionesProyecto = $totalAdecuacionesYConstruccionesProyecto - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $totalAdecuacionesYConstruccionesProyecto += $valorTotal;
            }

            return ($totalAdecuacionesYConstruccionesProyecto > $porcentajeMaquinariaIndustrial)  ? true : false;
        }

        return false;
    }

    /**
     * serviciosMantenimientoValidation
     *
     * REQ-LINEA-23 Antes de diligenciar este rubro en el aplicativo SGPS – SIPRO tenga en cuenta que NO debe superar el 5% del valor total del proyecto, sin incluir el valor de los contratos de aprendizaje.
     * 
     * @param  mixed $proyecto
     * @param  mixed $proyectoPresupuesto
     * @param  mixed $metodo
     * @param  mixed $primerValor
     * @param  mixed $segundoValor
     * @param  mixed $tercerValor
     * @return boolean
     */
    public static function serviciosMantenimientoValidation($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        if ($proyecto->getPrecioProyectoAttribute() == 0) {
            return false;
        }

        $totalMantenimientoMaquinaria = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040516');

        if ($convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo == '2040516') {
            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->id == $convocatoriaPresupuesto->id) {
                $totalMantenimientoMaquinaria = $totalMantenimientoMaquinaria - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $totalMantenimientoMaquinaria += $valorTotal;
            }

            return $totalMantenimientoMaquinaria > ($proyecto->getPrecioProyectoAttribute() * 0.05) ? true : false;
        }

        return false;
    }

    /**
     * adecuacionesYContruccionesValidation
     *
     * REQ-LINEA-23 Antes de diligenciar la información en el aplicativo SGPS - SIPRO tenga en cuenta que el total a formular NO debe superar el valor de 100 salarios mínimos (debe ser menor o igual a $90.852.600).
     * 
     * @param  mixed $proyecto
     * @param  mixed $proyectoPresupuesto
     * @param  mixed $metodo
     * @param  mixed $primerValor
     * @param  mixed $segundoValor
     * @param  mixed $tercerValor
     * @return void
     */
    public static function adecuacionesYContruccionesValidation($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        $salarioMinimo = json_decode(Storage::get('json/salario-minimo.json'), true);

        $codigoUsoPresupuestal = $convocatoriaPresupuesto->presupuestoSennova->usoPresupuestal->codigo;

        $total = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2045110');

        if ($codigoUsoPresupuestal == '2020200500406' || $codigoUsoPresupuestal == '2020200500407' || $codigoUsoPresupuestal == '2020200500405' || $codigoUsoPresupuestal == '20202005004023') {
            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->id == $convocatoriaPresupuesto->id) {
                $total = $total - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $total += $valorTotal;
            }

            if ($total > ($salarioMinimo['value'] * 100)) {
                return true;
            }
        }

        return false;
    }

    public static function primerReglaTp($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        $codigoSegundoPresupuestal = $convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo;

        if ($codigoSegundoPresupuestal == '2045110' || $codigoSegundoPresupuestal == '2040106' || $codigoSegundoPresupuestal == '2040516' || $codigoSegundoPresupuestal == '2040115' || $codigoSegundoPresupuestal == '2040125' || $codigoSegundoPresupuestal == '2040108') {

            // Calcula el promedio entre lo que viene del form + los estudios de mercado de todos los rubros adecuaciones y construcciones, equipo de sistemas, mantenimiento de maquinaria y equipo, transporte y sofware, maquinaria industrial, otras compras de equipos, software
            $total = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2045110') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040106') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040516') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040115') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040125') + self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040108');

            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo == $codigoSegundoPresupuestal) {
                $total = $total - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $total += $valorTotal;
            }

            if ($total > 250000000) {
                return true;
            }
        }

        return false;
    }

    public static function segundaReglaTp($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        $codigoSegundoPresupuestal = $convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo;

        if ($codigoSegundoPresupuestal == '2040424') {

            // Calcula el promedio entre lo que viene del form + los estudios de mercado de todos los rubros de "materiales para la formación"
            $total = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2040424');

            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo == $codigoSegundoPresupuestal) {
                $total = $total - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $total += $valorTotal;
            }

            if ($total > 120000000) {
                return true;
            }
        }

        return false;
    }

    public static function bienestarAlumnos($proyecto, $convocatoriaPresupuesto, $proyectoPresupuesto, $valorTotal)
    {
        $codigoSegundoPresupuestal = $convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo;

        if ($codigoSegundoPresupuestal == '2042186') {
            $total = self::totalSegundoGrupoPresupuestalProyecto($proyecto, '2042186');
            if ($proyectoPresupuesto && $proyectoPresupuesto->convocatoriaPresupuesto->presupuestoSennova->segundoGrupoPresupuestal->codigo == $codigoSegundoPresupuestal) {
                $total = $total - $proyectoPresupuesto->valor_total + $valorTotal;
            } else {
                $total += $valorTotal;
            }

            return ($total > $proyecto->tecnoacademiaLineasTecnoacademia()->first()->tecnoacademia->max_valor_bienestar_alumnos) ? true : false;
        }

        return false;
    }
}
