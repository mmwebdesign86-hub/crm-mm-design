import * as React from 'react';

interface ExpirationEmailProps {
    clientName: string;
    serviceName: string;
    expirationDate: string;
}

export const ExpirationEmailTemplate: React.FC<ExpirationEmailProps> = ({
    clientName,
    serviceName,
    expirationDate,
}) => (
    <div style={{ fontFamily: 'sans-serif', backgroundColor: '#f5f5f5', padding: '40px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ backgroundColor: '#0a0a0a', padding: '20px', textAlign: 'center' }}>
                <img
                    src="https://files.cdn-files-a.com/uploads/9116689/normal_68a01b0de6286.png"
                    alt="MM Design Web"
                    style={{ height: '50px', objectFit: 'contain' }}
                />
            </div>

            <div style={{ padding: '30px', color: '#333' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#000' }}>Hola {clientName},</h1>

                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Esperamos que estés muy bien.
                </p>

                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Te escribimos para recordarte que tu servicio de <strong>{serviceName}</strong> vence próximamente.
                </p>

                <div style={{ backgroundColor: '#f9f9f9', borderLeft: '4px solid #8B0000', padding: '15px', marginBottom: '20px' }}>
                    <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>Fecha de Vencimiento:</p>
                    <p style={{ margin: '5px 0 0 0', fontSize: '18px', fontWeight: 'bold' }}>{expirationDate}</p>
                </div>

                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '20px' }}>
                    Por favor, contáctanos para gestionar la renovación a tiempo y evitar interrupciones en el servicio.
                </p>

                <p style={{ fontSize: '16px', lineHeight: '1.5', marginBottom: '0' }}>
                    Un saludo,<br />
                    <strong>El equipo de MM Design Web</strong>
                </p>
            </div>

            <div style={{ backgroundColor: '#f0f0f0', padding: '15px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                &copy; {new Date().getFullYear()} MM Design Web. Todos los derechos reservados.
            </div>
        </div>
    </div>
);
