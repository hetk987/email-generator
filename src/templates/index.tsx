import type React from "react";
import { Mail, Zap, ShoppingBag, Calendar, Users, Shield } from "lucide-react";
import { DEFAULT_TEMPLATE } from "./default";
import { newsletterTemplate } from "./newsletter-templates";
import { orderConfirmationTemplate } from "./order-confirmation";
import { eventInvitationTemplate } from "./event-invitation";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  code: string;
}

export const templates: Template[] = [
  {
    ...DEFAULT_TEMPLATE,
    icon: <Mail className="w-5 h-5" />,
  },
  {
    ...newsletterTemplate,
    icon: <Zap className="w-5 h-5" />,
  },
  {
    ...orderConfirmationTemplate,
    icon: <ShoppingBag className="w-5 h-5" />,
  },
  {
    ...eventInvitationTemplate,
    icon: <Calendar className="w-5 h-5" />,
  },
];

export const categories = [
  "All",
  "Onboarding",
  "Marketing",
  "E-commerce",
  "Events",
  "Internal",
  "Authentication",
];
