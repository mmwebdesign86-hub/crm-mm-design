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
    Row,
    Column,
} from "@react-email/components";
import * as React from "react";

interface RenewalEmailProps {
    clientName: string;
    serviceName: string;
    renewalDate: string;
}

export const RenewalEmail = ({
    clientName: rawClientName,
    serviceName,
    renewalDate,
}: RenewalEmailProps) => {
    const clientName = rawClientName || "Cliente";

    return (
        <Html>
            <Head />
            <Preview>Aviso de Renovación: {serviceName}</Preview>
            <Body style={main}>
                {/* Full width styling hack: Container is constrained, but we want full width bars.
            In standard react-email, it's hard to break out of Container if we wrap everything in it.
            So we will use Sections for full width feel where possible or just design the Container to look 'page-like' 
            by removing the body background contrast.
        */}

                <Container style={container}>
                    {/* HEADER - Black Bar */}
                    <Section style={header}>
                        <Text style={logoText}>
                            <span style={{ color: "#E50914" }}>MM</span>
                            <span style={{ color: "#ffffff" }}> DESIGN WEB</span>
                        </Text>
                    </Section>

                    {/* MAIN CONTENT */}
                    <Section style={contentWrapper}>

                        <Heading style={h1}>Hola, {clientName}</Heading>

                        <Text style={paragraph}>
                            Tu servicio web requiere atención. Para garantizar que tu negocio siga operando
                            sin interrupciones, hemos preparado el siguiente resumen de renovación.
                        </Text>

                        {/* DATA BOX - TICKET STYLE */}
                        <Section style={ticketContainer}>
                            <Row>
                                <Column style={ticketLeft}>
                                    <Text style={ticketLabel}>SERVICIO CONTRATADO</Text>
                                    <Text style={ticketValueMain}>{serviceName}</Text>
                                </Column>
                            </Row>
                            <Hr style={ticketDivider} />
                            <Row>
                                <Column>
                                    <Text style={{ ...ticketLabel, marginBottom: '4px' }}>FECHA LÍMITE</Text>
                                    <div style={dateBox}>
                                        <Text style={dateBoxText}>{renewalDate}</Text>
                                    </div>
                                </Column>
                            </Row>
                        </Section>

                        <Text style={paragraph}>
                            Por favor, confirma la continuidad del servicio haciendo clic en el botón a continuación.
                        </Text>

                        {/* ACTION BUTTONS */}
                        <Section style={btnContainer}>
                            <Button
                                style={primaryButton}
                                href="mailto:contacto@mmdesignweb.com?subject=Confirmación de Renovación"
                            >
                                CONFIRMAR RENOVACIÓN
                            </Button>
                        </Section>

                        <Section style={{ textAlign: "center", marginBottom: "40px" }}>
                            <Button
                                style={whatsappButton}
                                href="https://wa.me/34656948148"
                            >
                                GESTIONAR POR WHATSAPP
                            </Button>
                        </Section>

                    </Section>

                    {/* FOOTER - Dark */}
                    <Section style={footer}>
                        <Text style={footerLogo}>
                            <span style={{ color: "#E50914" }}>MM</span> DESIGN WEB
                        </Text>
                        <Text style={footerAddress}>
                            C/ Sant Ramon, 29 Bajos, 08350<br />
                            Arenys de Mar, Barcelona (Spain)
                        </Text>
                        <Text style={footerContact}>
                            <Link href="mailto:contacto@mmdesignweb.com" style={footerLink}>contacto@mmdesignweb.com</Link>
                            &nbsp;&nbsp;|&nbsp;&nbsp;
                            <Link href="tel:+34656948148" style={footerLink}>+34 656 948 148</Link>
                        </Text>
                        <Hr style={footerLine} />
                        <Text style={copyright}>
                            © {new Date().getFullYear()} MM Design Web. Agencia Digital Premium.
                        </Text>
                    </Section>

                </Container>
            </Body>
        </Html>
    );
};

export default RenewalEmail;

// STYLES

const main = {
    backgroundColor: "#ffffff", // White background for the whole window (Paper feel)
    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
};

const container = {
    margin: "0 auto",
    width: "600px",
    maxWidth: "100%",
    backgroundColor: "#ffffff",
};

// HEADER
const header = {
    backgroundColor: "#000000",
    padding: "30px 20px",
    textAlign: "center" as const,
};

const logoText = {
    fontSize: "26px",
    fontWeight: "900", // Extra bold
    letterSpacing: "2px",
    margin: "0",
    textTransform: "uppercase" as const,
};

// CONTENT
const contentWrapper = {
    padding: "40px 40px",
};

const h1 = {
    color: "#111111",
    fontSize: "24px",
    fontWeight: "700",
    margin: "0 0 20px",
    letterSpacing: "-0.5px",
};

const paragraph = {
    color: "#444444",
    fontSize: "16px",
    lineHeight: "26px",
    marginBottom: "24px",
};

// TICKET / DATA BOX
const ticketContainer = {
    backgroundColor: "#f8f9fa",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "24px",
    margin: "30px 0",
};

const ticketLeft = {
    paddingRight: "10px",
};

const ticketLabel = {
    color: "#888888",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase" as const,
    letterSpacing: "1.2px",
    margin: "0 0 8px",
};

const ticketValueMain = {
    color: "#111111",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0",
};

const ticketDivider = {
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    margin: "20px 0",
};

const dateBox = {
    display: "inline-block",
    // In email, padding/bg works on div usually, but Text inside best.
};

const dateBoxText = {
    fontSize: "28px",
    fontWeight: "800",
    color: "#E50914",
    margin: "0",
    letterSpacing: "-1px",
};

// BUTTONS
const btnContainer = {
    textAlign: "center" as const,
    marginTop: "10px",
    marginBottom: "16px",
};

const primaryButton = {
    backgroundColor: "#E50914",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block", // Changed to inline-block for better spacing control if needed, but block in section works
    padding: "16px 32px",
    width: "100%", // Full width button looks good on mobile
    maxWidth: "280px", // But allow it to not be massive on desktop
};

const whatsappButton = {
    backgroundColor: "#25D366",
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
    width: "100%",
    maxWidth: "280px",
};

// FOOTER
const footer = {
    backgroundColor: "#111111", // Dark Gray/Black
    padding: "40px 20px",
    textAlign: "center" as const,
};

const footerLogo = {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "bold",
    letterSpacing: "1px",
    margin: "0 0 20px",
};

const footerAddress = {
    color: "#888888",
    fontSize: "12px",
    lineHeight: "20px",
    margin: "0 0 10px",
};

const footerContact = {
    color: "#888888",
    fontSize: "12px",
    marginBottom: "20px",
};

const footerLink = {
    color: "#ffffff",
    textDecoration: "none",
};

const footerLine = {
    borderColor: "#333333",
    margin: "20px 0",
};

const copyright = {
    color: "#555555",
    fontSize: "11px",
    margin: "0",
};
