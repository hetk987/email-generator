import type React from "react";
import { Mail, Users, ShoppingBag, Calendar, Code } from "lucide-react";

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  code: string;
}

/**
 * Example template demonstrating API integration
 * Shows how to use API data in email templates
 */
export const apiExampleTemplate: Template = {
  id: "api-example",
  name: "API Integration Example",
  description: "Demonstrates how to use API data in email templates",
  category: "Examples",
  icon: <Code className="w-5 h-5" />,
  code: `const ApiExampleEmail = () => {
  // Safe API access - check if API is defined
  const apiData = typeof API !== 'undefined' ? API : {};
  
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-md p-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                API Integration Demo 📊
              </Heading>
              
              <Text className="text-gray-600 mb-6">
                This email demonstrates how to use API data in your templates.
                Check the browser console to see the API responses!
              </Text>

              {/* Example: Using product API data */}
              {apiData.product && (
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <Heading className="text-lg font-semibold text-blue-900 mb-2">
                    Product Information
                  </Heading>
                  <Text className="text-blue-800">
                    <strong>Name:</strong> {apiData.product.name || 'N/A'}
                  </Text>
                  <Text className="text-blue-800">
                    <strong>Price:</strong> ${apiData.product.price || "N/A"}
                  </Text>
                  <Text className="text-blue-800">
                    <strong>Description:</strong> {apiData.product.description || 'N/A'}
                  </Text>
                </div>
              )}

              {/* Example: Using users API data */}
              {apiData.users && Array.isArray(apiData.users) && apiData.users.length > 0 && (
                <div className="mb-6 p-4 bg-green-50 rounded-lg">
                  <Heading className="text-lg font-semibold text-green-900 mb-2">
                    User Information
                  </Heading>
                  {apiData.users.slice(0, 3).map((user, index) => (
                    <div key={index} className="mb-2">
                      <Text className="text-green-800">
                        <strong>{user.name || 'User'}</strong> - {user.email || 'No email'}
                      </Text>
                    </div>
                  ))}
                  {apiData.users.length > 3 && (
                    <Text className="text-green-700 text-sm">
                      ... and {apiData.users.length - 3} more users
                    </Text>
                  )}
                </div>
              )}

              {/* Example: Using orders API data */}
              {apiData.orders && (
                <div className="mb-6 p-4 bg-purple-50 rounded-lg">
                  <Heading className="text-lg font-semibold text-purple-900 mb-2">
                    Recent Orders
                  </Heading>
                  <Text className="text-purple-800">
                    Total Orders: {apiData.orders.total || 0}
                  </Text>
                  <Text className="text-purple-800">
                    Total Value: ${apiData.orders.totalValue || 0}
                  </Text>
                </div>
              )}

              {/* Fallback when no API data is available */}
              {!apiData.product && !apiData.users && !apiData.orders && (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                  <Heading className="text-lg font-semibold text-yellow-900 mb-2">
                    No API Data Available
                  </Heading>
                  <Text className="text-yellow-800">
                    Configure API endpoints in the API Config modal to see dynamic data here.
                  </Text>
                </div>
              )}

              <Button 
                href="https://example.com"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Learn More
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};`,
};
