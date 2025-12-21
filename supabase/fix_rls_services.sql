-- 1. Habilitar RLS en la tabla services (si no lo está ya)
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;

-- 2. Crear política para permitir SELECT a usuarios autenticados
-- Esto permite que cualquier usuario logueado pueda VER todas las filas de servicios.
CREATE POLICY "Permitir lectura a usuarios autenticados"
ON "public"."services"
FOR SELECT
TO authenticated
USING (true);

-- OPCIONAL: Si también necesitas que editen o inserten, necesitarías más políticas.
-- Por ahora, esto soluciona que el dashboard se vea vacío.
