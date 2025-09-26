export const newsletterTemplate = {
  id: "newsletter",
  name: "Newsletter Template",
  description: "Modern newsletter design with featured articles and updates",
  category: "Marketing",
  code: `const Newsletter = ({ articles = [] }) => {
    return (
      <Html>
        <Head />
        <Tailwind>
          <Body className="bg-gray-100 font-sans">
            <Container className="mx-auto max-w-2xl">
              <Section className="bg-white p-8">
                <Heading className="text-3xl font-bold text-center mb-8">
                  Weekly Newsletter
                </Heading>
                <Text className="text-gray-600 text-center mb-8">
                  Stay updated with our latest news and insights
                </Text>
                <Hr className="my-6" />
                <Text className="text-sm text-gray-500">
                  Featured this week
                </Text>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }`,
};
