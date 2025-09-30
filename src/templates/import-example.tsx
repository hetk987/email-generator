export const importExampleTemplate = {
  id: "import-example",
  name: "Import Example",
  description:
    "Demonstrates how to use custom components and assets with imports",
  category: "Examples",
  code: `const ImportExampleEmail = ({
  userName = "John Doe",
  companyName = "TechCorp"
} = {}) => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-50 m-0 p-0">
          <Container className="mx-auto max-w-2xl p-5">
            
            {/* Using custom Header component */}
            <Header 
              logoUrl={logoUrl}
              companyName={companyName}
              title="Welcome to Our Platform!"
              subtitle="Discover the power of custom email components"
            />
            
            {/* Using custom Card component with different variants */}
            <Card variant="elevated" className="mb-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Hello, {userName}! 👋
              </Heading>
              <Text className="text-gray-700 mb-4">
                This email demonstrates how to use custom components with standard import statements.
                You can import any component from the './components/email' folder and use them just like regular React components.
              </Text>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card variant="outlined" padding="sm">
                  <Text className="font-semibold text-gray-800 mb-2">Custom Buttons</Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    Use CustomButton with different variants and sizes
                  </Text>
                  <CustomButton variant="primary" size="sm">
                    Primary Button
                  </CustomButton>
                </Card>
                
                <Card variant="outlined" padding="sm">
                  <Text className="font-semibold text-gray-800 mb-2">Asset Imports</Text>
                  <Text className="text-sm text-gray-600 mb-3">
                    Import images and other assets from './assets'
                  </Text>
                  <Img 
                    src={heroBgUrl} 
                    alt="Hero background" 
                    className="w-full h-20 object-cover rounded"
                  />
                </Card>
              </div>
              
              <div className="text-center">
                <CustomButton 
                  href="https://example.com/get-started"
                  variant="primary"
                  size="lg"
                  className="mr-3"
                >
                  Get Started
                </CustomButton>
                <CustomButton 
                  href="https://example.com/learn-more"
                  variant="outline"
                  size="lg"
                >
                  Learn More
                </CustomButton>
              </div>
            </Card>
            
            {/* Using custom Footer component */}
            <Footer 
              companyName={companyName}
              address="456 Innovation Drive, Tech City, TC 12345"
              showUnsubscribe={true}
            />
            
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};`,
};
