export const DEFAULT_TEMPLATE = {
  id: "welcome",
  name: "Welcome Email",
  description: "A warm welcome email for new users with onboarding steps",
  category: "Onboarding",
  code: `const ShowcaseEmail = ({
    name = "Alex Johnson",
    companyName = "Acme Corporation",
    productName = "Premium Suite",
    price = "$99",
    logoUrl = "https://via.placeholder.com/150x60/3b82f6/ffffff?text=ACME"
  } = {}) => {
    return (
      <Html>
        <Head />
        <Tailwind>
          <Body className="font-sans bg-gray-100 m-0 p-0">
            <Container className="mx-auto max-w-2xl p-5">
              
              {/* Header Section */}
              <Section className="bg-white rounded-lg shadow-md mb-6 p-6">
                <Img 
                  src={logoUrl}
                  alt={companyName}
                  className="mx-auto block mb-4 h-15"
                />
                <Heading className="text-3xl font-bold text-center text-gray-900 mb-2">
                  Component Showcase Email
                </Heading>
                <Text className="text-center text-gray-600 text-lg">
                  This email demonstrates all React Email components with Tailwind styling
                </Text>
              </Section>
  
              {/* Welcome Section */}
              <Section className="bg-blue-50 rounded-lg p-6 mb-6">
                <Heading className="text-2xl font-semibold text-blue-900 mb-4">
                  Welcome, {name}! 👋
                </Heading>
                <Text className="text-blue-800 text-base leading-relaxed mb-4">
                  Thank you for joining {companyName}. We're excited to have you as part of our community. 
                  This email showcases various React Email components styled with Tailwind CSS utilities.
                </Text>
                <Text className="text-blue-700 text-sm">
                  <strong>Account Status:</strong> ✅ Active and verified
                </Text>
              </Section>
  
              {/* Product Features */}
              <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
                <Heading className="text-xl font-semibold text-gray-900 mb-4">
                  🚀 {productName} Features
                </Heading>
                
                <div className="mb-4">
                  <Text className="text-gray-800 font-medium mb-2">
                    ✨ Premium Analytics Dashboard
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Get detailed insights into your performance metrics
                  </Text>
                </div>
                
                <div className="mb-4">
                  <Text className="text-gray-800 font-medium mb-2">
                    🔒 Advanced Security Features
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Two-factor authentication and encrypted data storage
                  </Text>
                </div>
                
                <div className="mb-4">
                  <Text className="text-gray-800 font-medium mb-2">
                    📊 Real-time Collaboration
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Work seamlessly with your team members
                  </Text>
                </div>
              </Section>
  
              {/* Pricing Card */}
              <Section className="bg-blue-600 rounded-xl p-6 text-center mb-6">
                <Heading className="text-2xl font-bold text-white mb-2">
                  Special Launch Offer
                </Heading>
                <Text className="text-blue-100 mb-4">
                  Get started with {productName} for just
                </Text>
                <Text className="text-4xl font-bold text-white mb-4">
                  {price}<span className="text-lg font-normal">/month</span>
                </Text>
                <Button
                  href="https://example.com/subscribe"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold no-underline inline-block"
                >
                  Start Free Trial
                </Button>
              </Section>
  
              {/* Alert/Notice Section */}
              <Section className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <Heading className="text-red-800 text-lg font-semibold mb-2">
                  ⚠️ Important Notice
                </Heading>
                <Text className="text-red-700 text-sm">
                  This is an example of an alert or warning message. You can use different color schemes 
                  for various types of notifications (success, warning, error, info).
                </Text>
              </Section>
  
              {/* Success Message */}
              <Section className="bg-green-50 border-2 border-green-200 rounded-lg p-4 mb-6">
                <Text className="text-green-800 font-medium">
                  ✅ Account successfully activated! You can now access all premium features.
                </Text>
              </Section>
  
              {/* Action Buttons */}
              <Section className="text-center mb-6">
                <Heading className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </Heading>
                <div className="text-center">
                  <Button
                    href="https://example.com/dashboard"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium no-underline inline-block mr-3 mb-2"
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    href="https://example.com/support"
                    className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium no-underline inline-block mb-2"
                  >
                    Contact Support
                  </Button>
                </div>
              </Section>
  
              {/* Footer */}
              <Section className="bg-gray-100 rounded-lg p-6 text-center">
                <Text className="text-gray-600 text-sm mb-2">
                  © 2024 {companyName}. All rights reserved.
                </Text>
                <Text className="text-gray-500 text-xs mb-3">
                  123 Business Street, Suite 100, City, ST 12345
                </Text>
                <Text className="text-gray-500 text-xs">
                  You're receiving this email because you signed up for {companyName}.
                  <br />
                  <a href="#" className="text-blue-600 underline">
                    Unsubscribe
                  </a> | 
                  <a href="#" className="text-blue-600 underline">
                    Update Preferences
                  </a>
                </Text>
              </Section>
              
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };`,
};
