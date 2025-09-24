# 📚 Email Generator Usage Examples

This comprehensive guide provides real-world examples for creating various types of email templates using React Email components and Tailwind CSS.

## 🎯 Table of Contents

- [Getting Started](#getting-started)
- [Basic Email Templates](#basic-email-templates)
- [Advanced Examples](#advanced-examples)
- [Component Reference](#component-reference)
- [Tailwind CSS Guide](#tailwind-css-guide)
- [Best Practices](#best-practices)

## 🚀 Getting Started

### Essential Structure

Every email template must follow this basic structure:

```jsx
const EmailTemplate = ({ prop1 = "default", prop2 = "default" } = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            {/* Your email content here */}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

### Key Rules

1. **Always wrap content in `<Tailwind>`** - Required for className support
2. **Use React Email components** - For email client compatibility
3. **Set default parameters** - Use destructuring with defaults: `{ name = "User" } = {}`
4. **Name your component** - Use `ShowcaseEmail`, `WelcomeEmail`, `PasswordResetEmail`, or `NewsletterEmail`

## 📧 Basic Email Templates

### 1. Welcome Email

```jsx
const WelcomeEmail = ({
  name = "New User",
  companyName = "Our Company",
  loginUrl = "https://example.com/login",
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-md p-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Welcome to {companyName}! 🎉
              </Heading>
              <Text className="text-gray-700 mb-6">
                Hi {name}, we're thrilled to have you on board! Your account has
                been successfully created.
              </Text>
              <Button
                href={loginUrl}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Get Started
              </Button>
              <Text className="text-gray-500 text-sm mt-4">
                If you have any questions, feel free to reach out to our support
                team.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

### 2. Password Reset Email

```jsx
const PasswordResetEmail = ({
  name = "User",
  resetUrl = "https://example.com/reset",
  expiryTime = "24 hours",
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-md p-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Reset Your Password
              </Heading>
              <Text className="text-gray-700 mb-4">
                Hi {name}, we received a request to reset your password.
              </Text>
              <Text className="text-gray-600 mb-6">
                Click the button below to create a new password. This link will
                expire in {expiryTime}.
              </Text>
              <Button
                href={resetUrl}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold mb-4"
              >
                Reset Password
              </Button>
              <Section className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <Text className="text-yellow-800 text-sm">
                  <strong>Security Tip:</strong> If you didn't request this
                  reset, please ignore this email or contact our support team.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

### 3. Newsletter Email

```jsx
const NewsletterEmail = ({
  subscriberName = "Subscriber",
  articles = [
    {
      title: "Getting Started with React",
      excerpt: "Learn the basics of React development",
      url: "#",
    },
    {
      title: "CSS Grid Layout Guide",
      excerpt: "Master modern CSS layout techniques",
      url: "#",
    },
    {
      title: "JavaScript ES2024 Features",
      excerpt: "Explore the latest JavaScript features",
      url: "#",
    },
  ],
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            {/* Header */}
            <Section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 mb-6">
              <Heading className="text-3xl font-bold text-white text-center mb-2">
                Weekly Tech Newsletter
              </Heading>
              <Text className="text-blue-100 text-center">
                Stay updated with the latest in technology
              </Text>
            </Section>

            {/* Greeting */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Text className="text-gray-700 text-lg mb-4">
                Hello {subscriberName}! 👋
              </Text>
              <Text className="text-gray-600">
                Here are this week's featured articles that you won't want to
                miss:
              </Text>
            </Section>

            {/* Articles */}
            {articles.map((article, index) => (
              <Section
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-4"
              >
                <Heading className="text-xl font-semibold text-gray-900 mb-2">
                  {article.title}
                </Heading>
                <Text className="text-gray-600 mb-4">{article.excerpt}</Text>
                <Button
                  href={article.url}
                  className="bg-blue-600 text-white px-4 py-2 rounded font-medium"
                >
                  Read Article
                </Button>
              </Section>
            ))}

            {/* Footer */}
            <Section className="bg-gray-800 rounded-lg p-6 text-center">
              <Text className="text-gray-300 mb-2">
                Thanks for reading our newsletter!
              </Text>
              <Text className="text-gray-400 text-sm">
                <a href="#" className="text-blue-400 underline">
                  Unsubscribe
                </a>{" "}
                |
                <a href="#" className="text-blue-400 underline">
                  Update Preferences
                </a>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

## 🎨 Advanced Examples

### 4. E-commerce Order Confirmation

```jsx
const OrderConfirmationEmail = ({
  customerName = "John Doe",
  orderNumber = "ORD-12345",
  orderDate = "January 15, 2024",
  items = [
    { name: "Premium Headphones", price: "$199.99", quantity: 1 },
    { name: "Wireless Mouse", price: "$49.99", quantity: 2 },
  ],
  subtotal = "$299.97",
  shipping = "$9.99",
  tax = "$24.00",
  total = "$333.96",
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            {/* Header */}
            <Section className="bg-green-600 rounded-lg p-6 mb-6 text-center">
              <Heading className="text-2xl font-bold text-white mb-2">
                ✅ Order Confirmed!
              </Heading>
              <Text className="text-green-100">
                Thank you for your purchase, {customerName}
              </Text>
            </Section>

            {/* Order Details */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Heading className="text-xl font-semibold text-gray-900 mb-4">
                Order Details
              </Heading>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <Text className="text-gray-600 text-sm">Order Number</Text>
                  <Text className="font-medium">{orderNumber}</Text>
                </div>
                <div>
                  <Text className="text-gray-600 text-sm">Order Date</Text>
                  <Text className="font-medium">{orderDate}</Text>
                </div>
              </div>
            </Section>

            {/* Items */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Heading className="text-xl font-semibold text-gray-900 mb-4">
                Items Ordered
              </Heading>
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0"
                >
                  <div>
                    <Text className="font-medium text-gray-900">
                      {item.name}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      Qty: {item.quantity}
                    </Text>
                  </div>
                  <Text className="font-medium">{item.price}</Text>
                </div>
              ))}
            </Section>

            {/* Total */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text className="text-gray-600">Subtotal</Text>
                  <Text>{subtotal}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Shipping</Text>
                  <Text>{shipping}</Text>
                </div>
                <div className="flex justify-between">
                  <Text className="text-gray-600">Tax</Text>
                  <Text>{tax}</Text>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <Text>Total</Text>
                  <Text>{total}</Text>
                </div>
              </div>
            </Section>

            {/* Action Buttons */}
            <Section className="text-center mb-6">
              <Button
                href="#"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold mr-3"
              >
                Track Order
              </Button>
              <Button
                href="#"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold"
              >
                View Invoice
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

### 5. Event Invitation

```jsx
const EventInvitationEmail = ({
  recipientName = "Guest",
  eventName = "Tech Conference 2024",
  eventDate = "March 15, 2024",
  eventTime = "9:00 AM - 5:00 PM",
  venue = "Convention Center, San Francisco",
  organizerName = "Tech Events Inc.",
  rsvpUrl = "https://example.com/rsvp",
  eventId = "EVT-789",
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            {/* Header */}
            <Section className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mb-6 text-center">
              <Heading className="text-3xl font-bold text-white mb-2">
                🎉 You're Invited!
              </Heading>
              <Text className="text-purple-100 text-lg">{eventName}</Text>
            </Section>

            {/* Main Content */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Text className="text-gray-700 text-lg mb-4">
                Hi {recipientName},
              </Text>
              <Text className="text-gray-600 mb-6">
                We're excited to invite you to {eventName}, a premier gathering
                of industry leaders and innovators. Join us for an unforgettable
                day of learning, networking, and inspiration.
              </Text>

              {/* Event Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Text className="font-semibold text-gray-900 mb-1">
                      📅 Date
                    </Text>
                    <Text className="text-gray-700">{eventDate}</Text>
                  </div>
                  <div>
                    <Text className="font-semibold text-gray-900 mb-1">
                      ⏰ Time
                    </Text>
                    <Text className="text-gray-700">{eventTime}</Text>
                  </div>
                  <div className="md:col-span-2">
                    <Text className="font-semibold text-gray-900 mb-1">
                      📍 Venue
                    </Text>
                    <Text className="text-gray-700">{venue}</Text>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="mb-6">
                <Text className="font-semibold text-gray-900 mb-3">
                  What to Expect:
                </Text>
                <div className="space-y-2">
                  <Text className="text-gray-600">
                    • Keynote presentations from industry leaders
                  </Text>
                  <Text className="text-gray-600">
                    • Interactive workshops and hands-on sessions
                  </Text>
                  <Text className="text-gray-600">
                    • Networking opportunities with peers
                  </Text>
                  <Text className="text-gray-600">
                    • Exhibition showcasing latest technologies
                  </Text>
                </div>
              </div>
            </Section>

            {/* CTA */}
            <Section className="text-center mb-6">
              <Button
                href={rsvpUrl}
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg"
              >
                RSVP Now - Free Admission
              </Button>
              <Text className="text-gray-500 text-sm mt-3">
                Event ID: {eventId}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="bg-gray-800 rounded-lg p-6 text-center">
              <Text className="text-gray-300 mb-2">
                Organized by {organizerName}
              </Text>
              <Text className="text-gray-400 text-sm">
                Questions? Contact us at events@example.com
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

## 📋 Component Reference

### React Email Components

| Component     | Description       | Props                            |
| ------------- | ----------------- | -------------------------------- |
| `<Html>`      | Root HTML wrapper | `lang?`, `children`              |
| `<Head>`      | Document head     | `children`                       |
| `<Body>`      | Document body     | `className?`, `children`         |
| `<Container>` | Content container | `className?`, `children`         |
| `<Section>`   | Content section   | `className?`, `children`         |
| `<Text>`      | Text content      | `className?`, `children`         |
| `<Heading>`   | Headings (h1-h6)  | `className?`, `children`         |
| `<Button>`    | Button with href  | `href`, `className?`, `children` |
| `<Img>`       | Image             | `src`, `alt`, `className?`       |
| `<Tailwind>`  | Tailwind wrapper  | `config?`, `children`            |

### Common Tailwind Classes

#### Colors

- **Text**: `text-white`, `text-gray-900`, `text-blue-600`, `text-red-500`
- **Background**: `bg-white`, `bg-gray-100`, `bg-blue-600`, `bg-green-500`

#### Spacing

- **Padding**: `p-4`, `px-6`, `py-3`, `pt-2`, `pb-4`
- **Margin**: `m-0`, `mx-auto`, `mb-6`, `mt-4`

#### Typography

- **Size**: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`
- **Weight**: `font-normal`, `font-medium`, `font-semibold`, `font-bold`
- **Align**: `text-left`, `text-center`, `text-right`

#### Layout

- **Display**: `block`, `inline`, `inline-block`, `flex`, `grid`
- **Width**: `w-full`, `w-auto`, `max-w-2xl`, `max-w-md`
- **Border**: `rounded`, `rounded-lg`, `border`, `border-2`

## 🎯 Best Practices

### 1. Email Client Compatibility

- Use React Email components for maximum compatibility
- Test with the `<Tailwind>` wrapper for proper styling
- Keep images under 1MB and use absolute URLs

### 2. Responsive Design

- Use `max-w-2xl` or `max-w-md` for container widths
- Test on mobile devices
- Use `text-center` for better mobile alignment

### 3. Performance

- Keep email templates under 100KB
- Optimize images before including
- Use inline styles for critical styling

### 4. Accessibility

- Always include `alt` text for images
- Use semantic HTML structure
- Ensure good color contrast

### 5. Code Organization

- Use descriptive component names
- Set default parameters for all props
- Comment complex logic
- Keep templates focused and single-purpose

## 🚀 Tips & Tricks

### Dynamic Content

```jsx
// Use arrays for dynamic content
{
  items.map((item, index) => (
    <div key={index} className="mb-4">
      <Text className="font-medium">{item.name}</Text>
    </div>
  ));
}
```

### Conditional Rendering

```jsx
// Conditional content based on props
{
  isPremium && (
    <Section className="bg-gold-100 p-4 rounded">
      <Text className="text-gold-800">Premium Member Benefits</Text>
    </Section>
  );
}
```

### Custom Styling

```jsx
// Combine Tailwind with custom styles
<Section
  className="bg-blue-600 p-6"
  style={{ backgroundImage: 'linear-gradient(45deg, #blue, #purple)' }}
>
```

---

Happy email building! 🎉 For more examples and updates, check out our [GitHub repository](https://github.com/yourusername/email-generator).
