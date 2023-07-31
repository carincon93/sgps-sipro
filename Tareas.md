Tareas

1. Revisar centros de formación duplicados - Pasar datos relacionados y eliminar 1
2. Los MenuMui no cierran al dar clic
3. Si se selecciona varias veces Rubro concepto ministerio de hacienda se duplican los arrays y arroja un warn
4. Cómo ahora la evaluación es por url ?evaluacion_id=4296 se debe validar que esa evaluación sea del evaluador correspondiente
5. roles_sennova quitar el sumar_al_presupuesto 10.revisar roles de sistema por tipo de usuario

68

Agregar campo de programas de formación con registro calificado Revisar los anexos a habilitar

66 Agregar TRL en productos donde se despliegue minciencias

ALTER TABLE IF EXISTS public.idi ADD COLUMN aporta_a_campesena boolean;

ALTER TABLE IF EXISTS public.idi ADD COLUMN relacionado_estrategia_campesena boolean;

ALTER TABLE IF EXISTS public.idi ADD COLUMN justificacion_relacion_campesena text;

ALTER TABLE IF EXISTS public.idi ADD COLUMN lineas_estrategicas_convocatoria json;

ALTER TABLE IF EXISTS public.idi ADD COLUMN justificacion_lineas_estrategicas text;

ALTER TABLE IF EXISTS public.idi ADD COLUMN impacto_regional boolean;

ALTER TABLE IF EXISTS public.idi ADD COLUMN justificacion_impacto_regional text;

ALTER TABLE IF EXISTS public.idi ADD COLUMN justificacion_mesas_sectoriales text;

ALTER TABLE IF EXISTS public.idi ADD COLUMN areas_cualificacion_mnc json;

ALTER TABLE IF EXISTS public.idi ADD COLUMN lineas_estrategicas_beneficiadas json;

ALTER TABLE IF EXISTS public.idi ADD COLUMN justificacion_lineas_estrategicas_beneficiadas text;

ALTER TABLE IF EXISTS public.idi ADD COLUMN veredas_corregimientos json;
