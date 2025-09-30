import React from "react";
import { Section, Heading, Text, Img } from "@react-email/components";

interface HeaderProps {
  logoUrl?: string;
  companyName?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({
  logoUrl = "https://via.placeholder.com/150x60/3b82f6/ffffff?text=LOGO",
  companyName = "Your Company",
  title = "Welcome",
  subtitle,
  className = "",
}) => {
  return (
    <Section className={`text-center mb-6 ${className}`}>
      {logoUrl && (
        <Img
          src={logoUrl}
          alt={companyName}
          className="mx-auto block mb-4 h-15"
        />
      )}
      <Heading className="text-3xl font-bold text-gray-900 mb-2">
        {title}
      </Heading>
      {subtitle && <Text className="text-gray-600 text-lg">{subtitle}</Text>}
    </Section>
  );
};
