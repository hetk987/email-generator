import React from "react";
import { Section, Text } from "@react-email/components";

interface FooterProps {
  companyName?: string;
  address?: string;
  showUnsubscribe?: boolean;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  companyName = "Your Company",
  address = "123 Business Street, Suite 100, City, ST 12345",
  showUnsubscribe = true,
  className = "",
}) => {
  return (
    <Section className={`bg-gray-100 rounded-lg p-6 text-center ${className}`}>
      <Text className="text-gray-600 text-sm mb-2">
        © 2024 {companyName}. All rights reserved.
      </Text>
      <Text className="text-gray-500 text-xs mb-3">{address}</Text>
      {showUnsubscribe && (
        <Text className="text-gray-500 text-xs">
          You're receiving this email because you signed up for {companyName}.
          <br />
          <a href="#" className="text-blue-600 underline">
            Unsubscribe WOMP WOMP
          </a>{" "}
          |
          <a href="#" className="text-blue-600 underline">
            Update Preferences
          </a>
        </Text>
      )}
    </Section>
  );
};
