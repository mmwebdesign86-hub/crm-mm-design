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
    Img,
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
                <Container style={container}>

                    {/* HEADER - Logo Centered with more space */}
                    <Section style={header}>
                        <Img
                            src="https://crm-mm-design.vercel.app/logo-email.png"
                            alt="MM Design Web Logo"
                            width="200"
                            style={logo}
                        />
                    </Section>

                    {/* MAIN CONTENT */}
                    <Section style={contentWrapper}>

                        <Heading style={h1}>Hola, {clientName}</Heading>

                        <Text style={paragraph}>
                            Tu servicio web requiere atención inmediata. Para garantizar la continuidad de tu presencia digital
                            sin interrupciones, te enviamos los detalles de tu próxima renovación.
                        </Text>

                        {/* DATA BOX - APPLE CARD STYLE WITH MORE SPACE */}
                        <Section style={appleCard}>
                            <Row>
                                <Column>
                                    <Text style={cardLabel}>SERVICIO</Text>
                                    <Text style={cardValue}>{serviceName}</Text>
                                </Column>
                            </Row>
                            <Hr style={cardDivider} />
                            <Row>
                                <Column>
                                    <Text style={cardLabel}>FECHA VENCIMIENTO</Text>
                                    <Text style={cardDate}>{renewalDate}</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Text style={paragraph}>
                            Recomendamos gestionar este trámite antes de la fecha indicada para evitar la suspensión temporal del servicio.
                        </Text>

                        {/* ACTION BUTTONS */}
                        <Section style={btnContainer}>
                            <Button
                                style={primaryButton}
                                href="mailto:contacto@mmdesignweb.com?subject=Confirmación de Renovación"
                            >
                                CONFIRMAR RENOVACIÓN
                            </Button>

                            {/* Spacer */}
                            <div style={{ height: "15px" }}></div>

                            <Button
                                style={whatsappButton}
                                href="https://wa.me/34656948148"
                            >
                                GESTIONAR POR WHATSAPP 💬
                            </Button>
                        </Section>

                    </Section>

                    {/* FOOTER - RED FERRARI */}
                    <Section style={footer}>
                        <Text style={footerAddress}>
                            MM DESIGN WEB<br />
                            C/ Sant Ramon, 29 Bajos, 08350, Arenys de Mar.
                        </Text>
                        <Text style={footerLinks}>
                            <Link href="mailto:contacto@mmdesignweb.com" style={footerLink}>contacto@mmdesignweb.com</Link>
                            &nbsp;•&nbsp;
                            <Link href="tel:+34656948148" style={footerLink}>656 948 148</Link>
                        </Text>
                        <Text style={copyright}>
                            © {new Date().getFullYear()} MM Design Web.
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
    backgroundColor: "#ffffff",
    fontFamily: 'Helvetica, Arial, sans-serif',
};

// V4: Increased width/removed margins for full width feel
const container = {
    margin: "0 auto",
    width: "100%",
    maxWidth: "600px", // Still constrained for readability on desktop, but full width logic applied via parent Body
    backgroundColor: "#ffffff",
    padding: "0", // Remove padding on container itself, handle in sections
};

// HEADER
const header = {
    padding: "50px 0 50px", // Increased padding: 50px top/bottom
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
    display: "block",
};

// CONTENT
const contentWrapper = {
    padding: "0 40px 40px",
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 30px", // Increased margin bottom
};

const paragraph = {
    color: "#1a1a1a",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "30px", // Increased margin bottom
};

// CARD
const appleCard = {
    backgroundColor: "#F5F5F7",
    borderRadius: "12px",
    padding: "30px", // Increased padding inside card
    margin: "10px 0 40px", // Increased margin bottom
};

const cardLabel = {
    color: "#86868b",
    fontSize: "12px",
    fontWeight: "600",
    textTransform: "uppercase" as const,
    marginBottom: "8px",
    letterSpacing: "0.5px",
};

const cardValue = {
    color: "#1d1d1f",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0",
};

const cardDate = {
    color: "#E50914",
    fontSize: "22px", // Slightly larger
    fontWeight: "bold",
    margin: "0",
};

const cardDivider = {
    borderColor: "#d2d2d7",
    margin: "16px 0",
};

// BUTTONS
const btnContainer = {
    textAlign: "center" as const,
    margin: "20px 0 40px",
};

const primaryButton = {
    backgroundColor: "#E50914",
    borderRadius: "6px", // Less rounded, more aggressive/solid
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block", // Block behavior handled by width if needed, but inline-block is safer in some clients. 
    // To make it full width-ish but constrained:
    width: "100%",
    maxWidth: "350px",
    padding: "16px 0",
    boxSizing: "border-box" as const, // Ensure padding doesn't break width
};

const whatsappButton = {
    backgroundColor: "#25D366",
    borderRadius: "6px",
    color: "#ffffff", // White text on Green for high contrast
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    width: "100%",
    maxWidth: "350px",
    padding: "16px 0",
};

// FOOTER - RED FERRARI
const footer = {
    backgroundColor: "#E50914", // RED BACKGROUND
    padding: "40px 20px",
    textAlign: "center" as const,
    width: "100%",
};

const footerAddress = {
    color: "#FFFFFF", // WHITE TEXT
    fontSize: "14px",
    fontWeight: "bold",
    lineHeight: "22px",
    margin: "0 0 16px",
};

const footerLinks = {
    color: "#FFFFFF", // WHITE TEXT
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 0 20px",
};

const footerLink = {
    color: "#FFFFFF", // WHITE TEXT
    textDecoration: "underline",
};

const copyright = {
    color: "rgba(255,255,255,0.8)", // Semi-transparent white
    fontSize: "12px",
    margin: "0",
};
