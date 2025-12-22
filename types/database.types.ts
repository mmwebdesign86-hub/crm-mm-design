export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            clients: {
                Row: {
                    id: string
                    created_at: string
                    nombre_fiscal: string
                    cif_nif: string | null
                    direccion: string | null
                    poblacion: string | null
                    codigo_postal: string | null
                    nombre_contacto: string | null
                    email_contacto: string
                    telefono: string | null
                    notas: string | null
                    image_url: string | null
                    trade_name: string | null
                    mobile_phone: string | null
                    website_url: string | null
                    province: string | null
                }
                Insert: {
                    id?: string
                    created_at?: string
                    nombre_fiscal: string
                    cif_nif?: string | null
                    direccion?: string | null
                    poblacion?: string | null
                    codigo_postal?: string | null
                    nombre_contacto?: string | null
                    email_contacto: string
                    telefono?: string | null
                    notas?: string | null
                    image_url?: string | null
                    trade_name?: string | null
                    mobile_phone?: string | null
                    website_url?: string | null
                    province?: string | null
                }
                Update: {
                    id?: string
                    created_at?: string
                    nombre_fiscal?: string
                    cif_nif?: string | null
                    direccion?: string | null
                    poblacion?: string | null
                    codigo_postal?: string | null
                    nombre_contacto?: string | null
                    email_contacto?: string
                    telefono?: string | null
                    notas?: string | null
                    image_url?: string | null
                    trade_name?: string | null
                    mobile_phone?: string | null
                    website_url?: string | null
                    province?: string | null
                }
                Relationships: []
            }
            services: {
                Row: {
                    id: string
                    client_id: string
                    type: string
                    description: string | null
                    status: string | null
                    start_date: string | null
                    end_date: string | null
                    price: number | null
                    billing_cycle: string | null
                    auto_renew: boolean | null
                    avisos_activos: boolean | null
                }
                Insert: {
                    id?: string
                    client_id: string
                    type: string
                    description?: string | null
                    status?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    price?: number | null
                    billing_cycle?: string | null
                    auto_renew?: boolean | null
                    avisos_activos?: boolean | null
                }
                Update: {
                    id?: string
                    client_id?: string
                    type?: string
                    description?: string | null
                    status?: string | null
                    start_date?: string | null
                    end_date?: string | null
                    price?: number | null
                    billing_cycle?: string | null
                    auto_renew?: boolean | null
                    avisos_activos?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "services_client_id_fkey"
                        columns: ["client_id"]
                        referencedRelation: "clients"
                        referencedColumns: ["id"]
                    }
                ]
            }
            notifications_log: {
                Row: {
                    id: string
                    service_id: string
                    sent_at: string | null
                    tipo_aviso: string
                    email_enviado_a: string
                    estado_envio: string | null
                }
                Insert: {
                    id?: string
                    service_id: string
                    sent_at?: string | null
                    tipo_aviso: string
                    email_enviado_a: string
                    estado_envio?: string | null
                }
                Update: {
                    id?: string
                    service_id?: string
                    sent_at?: string | null
                    tipo_aviso?: string
                    email_enviado_a?: string
                    estado_envio?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "notifications_log_service_id_fkey"
                        columns: ["service_id"]
                        referencedRelation: "services"
                        referencedColumns: ["id"]
                    }
                ]
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
