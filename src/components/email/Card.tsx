import React from "react";
import { Section } from "@react-email/components";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  className = "",
  children,
  variant = "default",
  padding = "md",
}) => {
  const baseClasses = "rounded-lg";

  const variantClasses = {
    default: "bg-white",
    elevated: "bg-white shadow-lg",
    outlined: "bg-white border-2 border-gray-200",
  };

  const paddingClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`;

  return <Section className={combinedClasses}>{children}</Section>;
};
