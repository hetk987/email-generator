import { Html, Head, Body, Container, Text, Button, Section, Heading } from "@react-email/components";

interface PasswordResetEmailProps {
  name?: string;
  resetUrl?: string;
  companyName?: string;
}

export const PasswordResetEmail = ({ 
  name = "User", 
  resetUrl = "https://example.com/reset-password",
  companyName = "Your Company"
}: PasswordResetEmailProps) => (
  <Html>
    <Head />
    <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f6f6f6', margin: 0, padding: 0 }}>
      <Container style={{ margin: '0 auto', padding: '20px', maxWidth: '600px' }}>
        <Section style={{ backgroundColor: '#ffffff', padding: '40px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <Heading style={{ color: '#333333', fontSize: '24px', marginBottom: '20px' }}>
            Password Reset Request
          </Heading>
          <Text style={{ color: '#666666', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
            Hello {name},
          </Text>
          <Text style={{ color: '#666666', fontSize: '16px', lineHeight: '1.6', marginBottom: '20px' }}>
            We received a request to reset your password for your {companyName} account. If you made this request, click the button below to reset your password.
          </Text>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <Button
              href={resetUrl}
              style={{
                backgroundColor: '#dc3545',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              Reset Password
            </Button>
          </div>
          <Text style={{ color: '#999999', fontSize: '14px', lineHeight: '1.5' }}>
            If you didn't request a password reset, you can safely ignore this email. This link will expire in 24 hours for security reasons.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
