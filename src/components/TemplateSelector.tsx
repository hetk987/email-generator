"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, Key, Newspaper } from "lucide-react";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  code: string;
}

interface TemplateSelectorProps {
  onSelectTemplate: (template: Template) => void;
}

const templates: Template[] = [
  {
    id: "welcome",
    name: "Welcome Email",
    description: "A friendly welcome message for new users",
    icon: <Mail className="h-6 w-6" />,
    code: `const WelcomeEmail = ({ 
  name = "User", 
  companyName = "Your Company",
  loginUrl = "https://example.com/login"
} = {}) => {
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Body, { 
      style: { 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f6f6f6', 
        margin: 0, 
        padding: 0 
      } 
    },
      React.createElement(Container, { 
        style: { 
          margin: '0 auto', 
          padding: '20px', 
          maxWidth: '600px' 
        } 
      },
        React.createElement(Section, { 
          style: { 
            backgroundColor: '#ffffff', 
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          } 
        },
          React.createElement(Heading, { 
            style: { 
              color: '#333333', 
              fontSize: '28px', 
              marginBottom: '20px', 
              textAlign: 'center' 
            } 
          }, "Welcome to " + companyName + "!"),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            } 
          }, "Hello " + name + ","),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '30px' 
            } 
          }, "We're excited to have you join our community! Your account has been successfully created and you're ready to get started."),
          React.createElement('div', { 
            style: { 
              textAlign: 'center', 
              marginBottom: '30px' 
            } 
          },
            React.createElement(Button, {
              href: loginUrl,
              style: {
                backgroundColor: '#007cba',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }
            }, 'Get Started')
          ),
          React.createElement(Text, { 
            style: { 
              color: '#999999', 
              fontSize: '14px', 
              lineHeight: '1.5', 
              textAlign: 'center', 
              marginTop: '30px' 
            } 
          }, "If you have any questions, feel free to reach out to our support team.")
        )
      )
    )
  );
};`,
  },
  {
    id: "password-reset",
    name: "Password Reset",
    description: "Secure password reset instructions",
    icon: <Key className="h-6 w-6" />,
    code: `const PasswordResetEmail = ({ 
  name = "User", 
  resetUrl = "https://example.com/reset-password",
  companyName = "Your Company"
} = {}) => {
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Body, { 
      style: { 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f6f6f6', 
        margin: 0, 
        padding: 0 
      } 
    },
      React.createElement(Container, { 
        style: { 
          margin: '0 auto', 
          padding: '20px', 
          maxWidth: '600px' 
        } 
      },
        React.createElement(Section, { 
          style: { 
            backgroundColor: '#ffffff', 
            padding: '40px', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
          } 
        },
          React.createElement(Heading, { 
            style: { 
              color: '#333333', 
              fontSize: '24px', 
              marginBottom: '20px' 
            } 
          }, "Password Reset Request"),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            } 
          }, "Hello " + name + ","),
          React.createElement(Text, { 
            style: { 
              color: '#666666', 
              fontSize: '16px', 
              lineHeight: '1.6', 
              marginBottom: '20px' 
            } 
          }, "We received a request to reset your password for your " + companyName + " account. If you made this request, click the button below to reset your password."),
          React.createElement('div', { 
            style: { 
              textAlign: 'center', 
              marginBottom: '30px' 
            } 
          },
            React.createElement(Button, {
              href: resetUrl,
              style: {
                backgroundColor: '#dc3545',
                color: '#ffffff',
                padding: '14px 28px',
                borderRadius: '6px',
                textDecoration: 'none',
                display: 'inline-block',
                fontSize: '16px',
                fontWeight: 'bold'
              }
            }, 'Reset Password')
          ),
          React.createElement(Text, { 
            style: { 
              color: '#999999', 
              fontSize: '14px', 
              lineHeight: '1.5' 
            } 
          }, "If you didn't request a password reset, you can safely ignore this email. This link will expire in 24 hours for security reasons.")
        )
      )
    )
  );
};`,
  },
  {
    id: "newsletter",
    name: "Newsletter",
    description: "Professional newsletter template",
    icon: <Newspaper className="h-6 w-6" />,
    code: `const NewsletterEmail = ({ 
  companyName = "Your Company",
  headline = "Monthly Newsletter",
  content = "Here's what's new this month...",
  ctaText = "Read More",
  ctaUrl = "https://example.com/newsletter",
  logoUrl = "https://via.placeholder.com/150x50/007cba/ffffff?text=LOGO"
} = {}) => {
  return React.createElement(Html, null,
    React.createElement(Head),
    React.createElement(Body, { 
      style: { 
        fontFamily: 'Arial, sans-serif', 
        backgroundColor: '#f6f6f6', 
        margin: 0, 
        padding: 0 
      } 
    },
      React.createElement(Container, { 
        style: { 
          margin: '0 auto', 
          padding: '20px', 
          maxWidth: '600px' 
        } 
      },
        React.createElement(Section, { 
          style: { 
            backgroundColor: '#ffffff', 
            borderRadius: '8px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
            overflow: 'hidden' 
          } 
        },
          React.createElement(Section, { 
            style: { 
              backgroundColor: '#007cba', 
              padding: '30px', 
              textAlign: 'center' 
            } 
          },
            React.createElement(Img, { 
              src: logoUrl,
              alt: companyName,
              style: { height: '50px', marginBottom: '10px' }
            }),
            React.createElement(Text, { 
              style: { 
                color: '#ffffff', 
                fontSize: '24px', 
                fontWeight: 'bold', 
                margin: 0 
              } 
            }, companyName)
          ),
          React.createElement(Section, { 
            style: { 
              padding: '40px' 
            } 
          },
            React.createElement(Heading, { 
              style: { 
                color: '#333333', 
                fontSize: '28px', 
                marginBottom: '20px', 
                textAlign: 'center' 
              } 
            }, headline),
            React.createElement(Text, { 
              style: { 
                color: '#666666', 
                fontSize: '16px', 
                lineHeight: '1.6', 
                marginBottom: '30px' 
              } 
            }, content),
            React.createElement('div', { 
              style: { 
                textAlign: 'center', 
                marginBottom: '30px' 
              } 
            },
              React.createElement(Button, {
                href: ctaUrl,
                style: {
                  backgroundColor: '#007cba',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  display: 'inline-block',
                  fontSize: '16px',
                  fontWeight: 'bold'
                }
              }, ctaText)
            )
          ),
          React.createElement(Section, { 
            style: { 
              backgroundColor: '#f8f9fa', 
              padding: '20px', 
              textAlign: 'center' 
            } 
          },
            React.createElement(Text, { 
              style: { 
                color: '#999999', 
                fontSize: '14px', 
                margin: 0 
              } 
            }, "© 2024 " + companyName + ". All rights reserved.")
          )
        )
      )
    )
  );
};`,
  },
];

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => onSelectTemplate(template)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                {template.icon}
              </div>
              <div>
                <CardTitle className="text-base">{template.name}</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              {template.description}
            </CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
