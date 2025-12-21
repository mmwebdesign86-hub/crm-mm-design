-- Add avisos_activos column to services table
-- Default is TRUE so all existing services continue to get notifications
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS avisos_activos BOOLEAN DEFAULT TRUE;

-- Comment for documentation
COMMENT ON COLUMN services.avisos_activos IS 'Si es true, el servicio recibirá correos automáticos de vencimiento.';
