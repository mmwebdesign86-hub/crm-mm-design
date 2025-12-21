-- ==============================================================================
-- SEGURIDAD V1.0: POLÍTICAS RLS PARA USUARIOS AUTENTICADOS (ADMIN)
-- ==============================================================================

-- 1. TABLA SERVICES (Ya tenía enable RLS y select, añadimos escritura)
-- Aseguramos que RLS esté activo
ALTER TABLE "public"."services" ENABLE ROW LEVEL SECURITY;

-- Política para INSERT
CREATE POLICY "Permitir insertar servicios a usuarios autenticados"
ON "public"."services"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para UPDATE
CREATE POLICY "Permitir actualizar servicios a usuarios autenticados"
ON "public"."services"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para DELETE
CREATE POLICY "Permitir eliminar servicios a usuarios autenticados"
ON "public"."services"
FOR DELETE
TO authenticated
USING (true);


-- 2. TABLA CLIENTS (Aplicamos todo el CRUD)
ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;

-- Política para SELECT (Lectura)
CREATE POLICY "Permitir ver clientes a usuarios autenticados"
ON "public"."clients"
FOR SELECT
TO authenticated
USING (true);

-- Política para INSERT (Creación)
CREATE POLICY "Permitir crear clientes a usuarios autenticados"
ON "public"."clients"
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política para UPDATE (Edición)
CREATE POLICY "Permitir editar clientes a usuarios autenticados"
ON "public"."clients"
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Política para DELETE (Borrado)
CREATE POLICY "Permitir borrar clientes a usuarios autenticados"
ON "public"."clients"
FOR DELETE
TO authenticated
USING (true);

-- 3. TABLA NOTIFICATIONS_LOG (Solo necesitamos que el CRON/Admin pueda escribir)
ALTER TABLE "public"."notifications_log" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acceso total a notifications_log a autenticados"
ON "public"."notifications_log"
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
