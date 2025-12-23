import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Button,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface RenewalEmailProps {
    clientName: string;
    serviceName: string;
    renewalDate: string;
}

export const RenewalEmail = ({
    clientName,
    serviceName,
    renewalDate,
}: RenewalEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Aviso importante: Renovación de servicios próximos a vencer</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Header Logo */}
                    <Section style={header}>
                        <Text style={logoText}>
                            <span style={{ color: "#E50914" }}>MM</span>
                            <span style={{ color: "#000000" }}>DESIGN WEB</span>
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={content}>
                        <Heading style={h1}>Hola {clientName},</Heading>
                        <Text style={text}>
                            Esperamos que te encuentres bien.
                        </Text>
                        <Text style={text}>
                            Te informamos que tu servicio contratado está próximo a su fecha de renovación.
                            Para garantizar la continuidad de tu presencia online y evitar interrupciones,
                            es necesario gestionar la renovación antes de la fecha límite.
                        </Text>

                        {/* Info Box */}
                        <Section style={infoBox}>
                            <Text style={infoLabel}>SERVICIO A RENOVAR:</Text>
                            <Text style={infoValue}>{serviceName}</Text>
                            <Hr style={divider} />
                            <Text style={infoLabel}>FECHA DE VENCIMIENTO:</Text>
                            <Text style={dateValue}>{renewalDate}</Text>
                        </Section>

                        {/* CTAs */}
                        <Section style={btnContainer}>
                            <Button
                                style={button}
                                href="mailto:contacto@mmdesignweb.com?subject=Confirmación de Renovación"
                            >
                                CONFIRMAR POR EMAIL
                            </Button>
                        </Section>

                        <Section style={center}>
                            <Link href="https://wa.me/34656948148" style={secondaryLink}>
                                Contactar por WhatsApp
                            </Link>
                        </Section>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Hr style={footerDivider} />
                        <Text style={footerText}>
                            <strong>MM DESIGN WEB</strong>
                            <br />
                            C/ Sant Ramon, 29 Bajos, 08350, Arenys de Mar, Barcelona.
                        </Text>
                        <Text style={footerText}>
                            Email: <Link href="mailto:contacto@mmdesignweb.com" style={link}>contacto@mmdesignweb.com</Link>
                            <br />
                            Teléfono: <Link href="tel:+34656948148" style={link}>656948148</Link>
                        </Text>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} MM Design Web. Todos los derechos reservados.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default RenewalEmail;

const main = {
    backgroundColor: "#f6f9fc",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px 0 48px",
    marginBottom: "64px",
    maxWidth: "600px",
    borderRadius: "5px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
};

const header = {
    padding: "20px 48px",
    textAlign: "center" as const,
};

const logoText = {
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: "-1px",
    margin: "0",
};

const content = {
    padding: "0 48px",
};

const h1 = {
    color: "#333",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "40px 0",
    padding: "0",
};

const text = {
    color: "#333",
    fontSize: "16px",
    lineHeight: "26px",
    marginBottom: "20px",
};

const infoBox = {
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    padding: "24px",
    margin: "24px 0",
    border: "1px solid #e6e6e6",
};

const infoLabel = {
    color: "#666",
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: "1px",
    margin: "0 0 8px",
};

const infoValue = {
    color: "#000",
    fontSize: "18px",
    fontWeight: "500",
    margin: "0 0 16px",
};

const dateValue = {
    color: "#E50914",
    fontSize: "20px",
    fontWeight: "bold",
    margin: "0",
};

const divider = {
    borderColor: "#e6e6e6",
    margin: "16px 0",
};

const btnContainer = {
    textAlign: "center" as const,
    margin: "32px 0 24px",
};

const button = {
    backgroundColor: "#E50914",
    borderRadius: "4px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "block",
    padding: "16px 24px",
    width: "100%",
};

const center = {
    textAlign: "center" as const,
};

const secondaryLink = {
    color: "#25D366", // WhatsApp Green
    fontSize: "15px",
    textDecoration: "underline",
    fontWeight: "500",
};

const footer = {
    padding: "0 48px",
    marginTop: "32px",
};

const footerDivider = {
    borderColor: "#e6e6e6",
    margin: "24px 0",
};

const footerText = {
    color: "#8898aa",
    fontSize: "12px",
    lineHeight: "16px",
    marginBottom: "12px",
};

const link = {
    color: "#8898aa",
    textDecoration: "underline",
};

const copyright = {
    color: "#8898aa",
    fontSize: "12px",
    marginTop: "20px",
    textAlign: "center" as const,
};
