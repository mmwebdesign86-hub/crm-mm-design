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

                    {/* HEADER - Logo Centered */}
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
                            Tu servicio web requiere atención. Para garantizar la continuidad de tu presencia digital
                            sin interrupciones, te enviamos los detalles de tu próxima renovación.
                        </Text>

                        {/* DATA BOX - APPLE CARD STYLE */}
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
                                    <Text style={cardLabel}>FECHA DE VENCIMIENTO</Text>
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
                                Confirmar Renovación
                            </Button>
                        </Section>

                        <Section style={{ textAlign: "center", marginBottom: "40px" }}>
                            <Link
                                style={whatsappLink}
                                href="https://wa.me/34656948148"
                            >
                                o gestionarlo por WhatsApp
                            </Link>
                        </Section>

                    </Section>

                    {/* FOOTER - Dark */}
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

const container = {
    margin: "0 auto",
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
};

// HEADER
const header = {
    padding: "40px 0 20px", // Top padding 40px
    textAlign: "center" as const,
};

const logo = {
    margin: "0 auto",
    display: "block",
};

// CONTENT
const contentWrapper = {
    padding: "0 40px 40px", // Side padding 40px
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 24px",
};

const paragraph = {
    color: "#1a1a1a",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "24px",
};

// APPLE CARD
const appleCard = {
    backgroundColor: "#F5F5F7",
    borderRadius: "12px",
    padding: "24px",
    margin: "24px 0",
};

const cardLabel = {
    color: "#86868b", // Apple Gray text
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
    color: "#E50914", // Red Brand
    fontSize: "18px",
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
    margin: "32px 0 16px",
};

const primaryButton = {
    backgroundColor: "#E50914",
    borderRadius: "980px", // Fully rounded pill
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "500",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "14px 30px",
};

const whatsappLink = {
    color: "#25D366",
    fontSize: "15px",
    textDecoration: "none",
    fontWeight: "500",
};

// FOOTER
const footer = {
    backgroundColor: "#000000",
    padding: "40px 20px",
    textAlign: "center" as const,
    width: "100%",
};

const footerAddress = {
    color: "#888888",
    fontSize: "12px",
    lineHeight: "18px",
    margin: "0 0 12px",
};

const footerLinks = {
    color: "#888888",
    fontSize: "12px",
    margin: "0 0 20px",
};

const footerLink = {
    color: "#888888",
    textDecoration: "underline",
};

const copyright = {
    color: "#444444",
    fontSize: "10px",
    margin: "0",
};
