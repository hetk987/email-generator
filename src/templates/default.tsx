export const DEFAULT_TEMPLATE = {
  id: "welcome",
  name: "Welcome Email",
  description: "A warm welcome email for new users with onboarding steps",
  category: "Onboarding",
  code: `const ShowcaseEmail = ({
  name = "Alex Johnson",
  companyName = "Acme Corporation",
  productName = "Premium Suite",
  price = "$99"
} = {}) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto max-w-2xl p-5">
            
            {/* Header Section using custom component */}
            <Header 
              logoUrl={logoUrl}
              companyName={companyName}
              title="Component Showcase Email"
              subtitle="This email demonstrates custom components with Tailwind styling"
            />
  
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
  
              {/* Product Features using Card component */}
              <Card variant="elevated" className="mb-6">
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
              </Card>
  
              {/* Pricing Card using Card component */}
              <Card className="bg-blue-600 text-center mb-6">
                <Heading className="text-2xl font-bold text-white mb-2">
                  Special Launch Offer
                </Heading>
                <Text className="text-blue-100 mb-4">
                  Get started with {productName} for just
                </Text>
                <Text className="text-4xl font-bold text-white mb-4">
                  {price}<span className="text-lg font-normal">/month</span>
                </Text>
                <CustomButton
                  href="https://example.com/subscribe"
                  variant="primary"
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Start Free Trial
                </CustomButton>
              </Card>
  
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
  
              {/* Action Buttons using CustomButton components */}
              <Section className="text-center mb-6">
                <Heading className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Actions
                </Heading>
                <div className="text-center">
                  <CustomButton
                    href="https://example.com/dashboard"
                    variant="primary"
                    size="md"
                    className="mr-3 mb-2"
                  >
                    Go to Dashboard
                  </CustomButton>
                  <CustomButton
                    href="https://example.com/support"
                    variant="secondary"
                    size="md"
                    className="mb-2"
                  >
                    Contact Support
                  </CustomButton>
                </div>
              </Section>
  
              {/* Footer using custom Footer component */}
              <Footer 
                companyName={companyName}
                address="123 Business Street, Suite 100, City, ST 12345"
                showUnsubscribe={true}
              />
              
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };`,
};
