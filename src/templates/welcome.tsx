import React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Button,
  Section,
  Heading,
} from "@react-email/components";

interface WelcomeEmailProps {
  name?: string;
  companyName?: string;
  loginUrl?: string;
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  name = "User",
  companyName = "Your Company",
  loginUrl = "https://example.com/login",
}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{
          fontFamily: "Arial, sans-serif",
          backgroundColor: "#f6f6f6",
          margin: 0,
          padding: 0,
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            padding: "20px",
            maxWidth: "600px",
          }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <Heading
              style={{
                color: "#333333",
                fontSize: "28px",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              Welcome to {companyName}!
            </Heading>
            <Text
              style={{
                color: "#666666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "20px",
              }}
            >
              Hello {name},
            </Text>
            <Text
              style={{
                color: "#666666",
                fontSize: "16px",
                lineHeight: "1.6",
                marginBottom: "30px",
              }}
            >
              We're excited to have you join our community! Your account has
              been successfully created and you're ready to get started.
            </Text>
            <div
              style={{
                textAlign: "center",
                marginBottom: "30px",
              }}
            >
              <Button
                href={loginUrl}
                style={{
                  backgroundColor: "#007cba",
                  color: "#ffffff",
                  padding: "14px 28px",
                  borderRadius: "6px",
                  textDecoration: "none",
                  display: "inline-block",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Get Started
              </Button>
            </div>
            <Text
              style={{
                color: "#999999",
                fontSize: "14px",
                lineHeight: "1.5",
                textAlign: "center",
                marginTop: "30px",
              }}
            >
              If you have any questions, feel free to reach out to our support
              team.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
