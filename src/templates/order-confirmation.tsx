export const orderConfirmationTemplate = {
  id: "ecommerce",
  name: "Order Confirmation",
  description: "Professional order confirmation with product details",
  category: "E-commerce",
  code: `const OrderConfirmation = ({ orderNumber = "12345", customerName = "Jane Smith" }) => {
    return (
      <Html>
        <Head />
        <Tailwind>
          <Body className="bg-gray-50 font-sans">
            <Container className="mx-auto max-w-2xl p-6">
              <Section className="bg-white rounded-lg p-8">
                <Heading className="text-2xl font-bold mb-4">
                  Order Confirmed! 📦
                </Heading>
                <Text className="text-gray-600 mb-6">
                  Thank you {customerName}! Your order #{orderNumber} has been confirmed.
                </Text>
                <Section className="bg-gray-50 p-4 rounded-md">
                  <Text className="font-semibold">Order Details</Text>
                  <Text className="text-sm text-gray-600">
                    We'll send you shipping updates soon.
                  </Text>
                </Section>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }`,
};
