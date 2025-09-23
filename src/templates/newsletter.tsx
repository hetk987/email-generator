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
  Img,
} from "@react-email/components";

interface NewsletterEmailProps {
  companyName?: string;
  headline?: string;
  content?: string;
  ctaText?: string;
  ctaUrl?: string;
  logoUrl?: string;
}

const NewsletterEmail: React.FC<NewsletterEmailProps> = ({
  companyName = "Your Company",
  headline = "Monthly Newsletter",
  content = "Here's what's new this month...",
  ctaText = "Read More",
  ctaUrl = "https://example.com/newsletter",
  logoUrl = "https://via.placeholder.com/150x50/007cba/ffffff?text=LOGO",
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
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <Section
              style={{
                backgroundColor: "#007cba",
                padding: "30px",
                textAlign: "center",
              }}
            >
              <Img
                src={logoUrl}
                alt={companyName}
                style={{ height: "50px", marginBottom: "10px" }}
              />
              <Text
                style={{
                  color: "#ffffff",
                  fontSize: "24px",
                  fontWeight: "bold",
                  margin: 0,
                }}
              >
                {companyName}
              </Text>
            </Section>

            {/* Content */}
            <Section
              style={{
                padding: "40px",
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
                {headline}
              </Heading>
              <Text
                style={{
                  color: "#666666",
                  fontSize: "16px",
                  lineHeight: "1.6",
                  marginBottom: "30px",
                }}
              >
                {content}
              </Text>
              <div
                style={{
                  textAlign: "center",
                  marginBottom: "30px",
                }}
              >
                <Button
                  href={ctaUrl}
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
                  {ctaText}
                </Button>
              </div>
            </Section>

            {/* Footer */}
            <Section
              style={{
                backgroundColor: "#f8f9fa",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  color: "#999999",
                  fontSize: "14px",
                  margin: 0,
                }}
              >
                © 2024 {companyName}. All rights reserved.
              </Text>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default NewsletterEmail;
