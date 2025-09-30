export const eventInvitationTemplate = {
  id: "event",
  name: "Event Invitation",
  description: "Elegant event invitation with RSVP functionality",
  category: "Events",
  code: `const EventInvitation = ({ eventName = "Annual Conference", date = "March 15, 2024" }) => {
    return (
      <Html>
        <Tailwind>
          <Head />
          <Body className="bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
            <Container className="mx-auto max-w-2xl p-6">
              <Section className="bg-white rounded-xl p-8 shadow-lg">
                <Heading className="text-3xl font-bold text-center mb-6">
                  You're Invited! 🎊
                </Heading>
                <Text className="text-xl text-center mb-4">
                  {eventName}
                </Text>
                <Text className="text-gray-600 text-center mb-8">
                  Join us on {date} for an unforgettable experience
                </Text>
                <Button className="bg-indigo-600 text-white px-8 py-4 rounded-lg mx-auto block">
                  RSVP Now
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    )
  }`,
};
