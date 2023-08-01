Tareas

1. Revisar centros de formación duplicados - Pasar datos relacionados y eliminar 1
2. Los MenuMui no cierran al dar clic
3. Si se selecciona varias veces Rubro concepto ministerio de hacienda se duplican los arrays y arroja un warn
4. Cómo ahora la evaluación es por url ?evaluacion_id=4296 se debe validar que esa evaluación sea del evaluador correspondiente
5. roles_sennova quitar el sumar_al_presupuesto 10.revisar roles de sistema por tipo de usuario

68

Agregar campo de programas de formación con registro calificado Revisar los anexos a habilitar

69

1. Subir el Archivo del Plan Tecnológico del Centro
2. Faltan productos de minciencias



ALTER SEQUENCE productos_linea_69_id_seq RENAME TO productos_minciencias_linea_69_id_seq;
nextval('productos_minciencias_linea_69_id_seq'::regclass)

productos_minciencias_linea_69_pkey

CREATE TABLE public.productos_minciencias_linea_69
(
    id serial NOT NULL,
    tipo character(255),
    subtipologia_minciencias_id integer,
    producto_id integer,
    trl character,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    CONSTRAINT productos_minciencias_linea_69 PRIMARY KEY (id),
    CONSTRAINT producto_id_fkey FOREIGN KEY (producto_id)
        REFERENCES public.productos (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID,
    CONSTRAINT subtipologia_minciencias_id_fkey FOREIGN KEY (subtipologia_minciencias_id)
        REFERENCES public.subtipologias_minciencias (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public.productos_minciencias_linea_69
    OWNER to postgres;

83 "Inventario de equipos actualizado

" "Anexo 9 – Portafolio de servicios prestados actualizado

" "Anexo 2. Ficha técnica para maquinaria y equipos "
