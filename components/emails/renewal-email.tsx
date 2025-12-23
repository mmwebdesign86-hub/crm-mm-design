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

                    {/* HERO BANNER - Full Width, No Padding Top */}
                    <Section style={bannerSection}>
                        <Img
                            src="https://crm-mm-design.vercel.app/banner-email.png"
                            alt="MM Design Web Banner"
                            width="100%"
                            style={{ maxWidth: "640px", display: "block", margin: "0 auto" }}
                        />
                    </Section>

                    {/* MAIN CONTENT - WITH EXPLICIT PADDING SEPARATION */}
                    <Section style={contentWrapper}>

                        <Heading style={h1}>Hola, {clientName}</Heading>

                        <Text style={paragraph}>
                            Tu servicio web requiere atención inmediata. Para garantizar la continuidad de tu presencia digital
                            sin interrupciones, te enviamos los detalles de tu próxima renovación.
                        </Text>

                        {/* DATA BOX */}
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
    margin: "0",
    padding: "0",
    width: "100%",
};

// V7: STRICT 100% MAXWIDTH
const container = {
    margin: "0 auto",
    width: "100%",
    maxWidth: "640", // FORCE FULL WIDTH
    backgroundColor: "#ffffff",
    padding: "0",
};

// BANNER
const bannerSection = {
    width: "100%",
    margin: "0",
    padding: "0",
};

const bannerImage = {
    width: "100%",
    maxWidth: "100%",
    display: "block",
    border: "none",
};

// CONTENT - V7: EXPLICIT PADDING
const contentWrapper = {
    padding: "60px 40px 40px 40px", // 60px TOP, 40px SIDES/BOTTOM
};

const h1 = {
    color: "#1a1a1a",
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0 0 30px",
};

const paragraph = {
    color: "#1a1a1a",
    fontSize: "16px",
    lineHeight: "24px",
    marginBottom: "30px",
};

// CARD
const appleCard = {
    backgroundColor: "#F5F5F7",
    borderRadius: "12px",
    padding: "30px",
    margin: "10px 0 40px",
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
    fontSize: "22px",
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
    borderRadius: "6px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "bold",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    width: "100%",
    maxWidth: "350px",
    padding: "16px 0",
};

const whatsappButton = {
    backgroundColor: "#25D366",
    borderRadius: "6px",
    color: "#ffffff",
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
    backgroundColor: "#E50914",
    padding: "40px 20px",
    textAlign: "center" as const,
    width: "100%",
};

const footerAddress = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "bold",
    lineHeight: "22px",
    margin: "0 0 16px",
};

const footerLinks = {
    color: "#FFFFFF",
    fontSize: "14px",
    fontWeight: "bold",
    margin: "0 0 20px",
};

const footerLink = {
    color: "#FFFFFF",
    textDecoration: "underline",
};

const copyright = {
    color: "rgba(255,255,255,0.8)",
    fontSize: "12px",
    margin: "0",
};
