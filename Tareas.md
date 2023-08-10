Tareas

1. Revisar centros de formación duplicados - Pasar datos relacionados y eliminar 1
2. Los MenuMui no cierran al dar clic
3. Si se selecciona varias veces Rubro concepto ministerio de hacienda se duplican los arrays y arroja un warn
4. Cómo ahora la evaluación es por url ?evaluacion_id=4296 se debe validar que esa evaluación sea del evaluador correspondiente
5. MEJORAR DESPLEGABLES
6. Revisar lineas tecnologicas de la línea 65 y 66
7. SelectMultiple required no funciona

CREATE TABLE public.tipos_proyectos_convocatoria
(
    id serial NOT NULL,
    tipo_proyecto character varying(255),
    linea_programatica_id integer,
    created_at timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY (id),
    CONSTRAINT linea_programatica_id_fkey FOREIGN KEY (linea_programatica_id)
        REFERENCES public.lineas_programaticas (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
        NOT VALID
);

ALTER TABLE IF EXISTS public.tipos_proyectos_convocatoria
    OWNER to postgres;
