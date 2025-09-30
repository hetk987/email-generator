import React from "react";
import { Button as ReactEmailButton } from "@react-email/components";

interface CustomButtonProps {
  href?: string;
  className?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  href,
  className = "",
  children,
  variant = "primary",
  size = "md",
}) => {
  const baseClasses =
    "font-semibold rounded-lg no-underline inline-block transition-colors";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-600 text-white hover:bg-gray-700",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  return (
    <ReactEmailButton href={href} className={combinedClasses}>
      {children}
    </ReactEmailButton>
  );
};
