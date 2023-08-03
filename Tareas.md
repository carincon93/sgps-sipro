Tareas

1. Revisar centros de formación duplicados - Pasar datos relacionados y eliminar 1
2. Los MenuMui no cierran al dar clic
3. Si se selecciona varias veces Rubro concepto ministerio de hacienda se duplican los arrays y arroja un warn
4. Cómo ahora la evaluación es por url ?evaluacion_id=4296 se debe validar que esa evaluación sea del evaluador correspondiente
5. roles_sennova quitar el sumar_al_presupuesto 10.revisar roles de sistema por tipo de usuario

68

1. Revisar los anexos a habilitar

69

1. Subir el Archivo del Plan Tecnológico del Centro

83 "Inventario de equipos actualizado

" "Anexo 9 – Portafolio de servicios prestados actualizado

" "Anexo 2. Ficha técnica para maquinaria y equipos "


ALTER TABLE IF EXISTS public.convocatorias DROP COLUMN IF EXISTS lineas_programaticas_activas;
ALTER TABLE IF EXISTS public.anexos DROP COLUMN IF EXISTS obligatorio;

ALTER TABLE IF EXISTS public.anexos DROP COLUMN IF EXISTS habilitado;

ALTER TABLE IF EXISTS public.convocatoria_anexos
    ADD COLUMN created_at timestamp without time zone;

ALTER TABLE IF EXISTS public.convocatoria_anexos
    ADD COLUMN updated_at timestamp without time zone;


