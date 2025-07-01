import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  // Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import shrek from "@public/shrek.svg";

interface DeleteAccountVerificationEmailProps {
  userName: string;
  userEmail: string;
  verificationUrl: string;
}

export const DeleteAccountVerificationEmail = ({
  userName,
  userEmail,
  verificationUrl,
}: DeleteAccountVerificationEmailProps) => {
  const previewText = `Confirm your account deletion request`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src={shrek}
              width="120"
              height="120"
              alt="Shrek logo"
              style={logo}
            />
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Account Deletion Request</Heading>

            <Text style={text}>Hi {userName},</Text>

            <Text style={text}>
              We received a request to permanently delete your account
              associated with <strong>{userEmail}</strong>. This action cannot
              be undone.
            </Text>

            <Section style={warningBox}>
              <Text style={warningText}>
                ⚠️ <strong>Warning:</strong> Deleting your account will
                permanently remove:
              </Text>
              <Text style={warningList}>
                • All your personal data and settings
                <br />• Your account history and preferences
                <br />• Any saved content or configurations
                <br />• Access to all associated services
              </Text>
            </Section>

            <Text style={text}>
              If you&apos;re sure you want to proceed, click the button below to
              confirm your account deletion:
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={verificationUrl}>
                Confirm Account Deletion
              </Button>
            </Section>

            <Text style={smallText}>
              This link will expire in 24 hours. If you didn&apos;t request this
              deletion, please ignore this email or contact our support team
              immediately.
            </Text>

            <Section style={divider} />

            <Text style={text}>
              <strong>Changed your mind?</strong> You can simply ignore this
              email and your account will remain active. No further action is
              required.
            </Text>

            <Text style={signature}>
              Best regards,
              <br />
              The Your App Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This email was sent to {userEmail}. If you received this email by
              mistake, please ignore it.
            </Text>
            <Text style={footerText}>
              Your App Inc. • 123 Main Street • City, State 12345
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
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
};

const header = {
  padding: "32px 24px",
  borderBottom: "1px solid #e6ebf1",
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "24px 24px 0",
};

const h1 = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "1.25",
  margin: "0 0 24px",
  textAlign: "center" as const,
};

const text = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const warningBox = {
  backgroundColor: "#fef3c7",
  border: "1px solid #f59e0b",
  borderRadius: "8px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  color: "#92400e",
  fontSize: "16px",
  fontWeight: "600",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

const warningList = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#dc2626",
  borderRadius: "8px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
};

const smallText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "1.5",
  margin: "16px 0",
  textAlign: "center" as const,
};

const divider = {
  borderTop: "1px solid #e6ebf1",
  margin: "32px 0",
};

// const link = {
//   color: "#2563eb",
//   textDecoration: "underline",
// };

const signature = {
  color: "#374151",
  fontSize: "16px",
  lineHeight: "1.5",
  margin: "24px 0 0",
};

const footer = {
  borderTop: "1px solid #e6ebf1",
  padding: "24px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "12px",
  lineHeight: "1.5",
  margin: "0 0 8px",
};

export default DeleteAccountVerificationEmail;
