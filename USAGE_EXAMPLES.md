# Email Generator Usage Examples

## Default Showcase Email

The default template is a comprehensive showcase email that demonstrates all React Email components with Tailwind styling. This helps you see what each component looks like when rendered.

## JSX Syntax Support

You can write your email templates using JSX syntax instead of React.createElement calls:

```jsx
const WelcomeEmail = ({
  name = "User",
  companyName = "Your Company",
  loginUrl = "https://example.com/login",
} = {}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}
      >
        <Container
          style={{ margin: "0 auto", padding: "20px", maxWidth: "600px" }}
        >
          <Section
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "8px",
            }}
          >
            <Heading
              style={{
                color: "#333333",
                fontSize: "28px",
                textAlign: "center",
              }}
            >
              Welcome to {companyName}!
            </Heading>
            <Text style={{ color: "#666666", fontSize: "16px" }}>
              Hello {name}, welcome to our platform!
            </Text>
            <Button
              href={loginUrl}
              style={{ backgroundColor: "#007cba", color: "#ffffff" }}
            >
              Get Started
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
```

## Full Tailwind CSS Support

Use the `tw()` helper function to apply Tailwind CSS classes that get converted to inline styles. This supports a comprehensive set of Tailwind utilities:

```jsx
const ModernEmail = ({ name = "User" } = {}) => {
  return (
    <Html>
      <Head />
      <Body
        style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f6f6f6" }}
      >
        <Container
          style={{ margin: "0 auto", padding: "20px", maxWidth: "600px" }}
        >
          <Section style={{ ...tw("bg-white p-6 rounded-lg shadow-lg") }}>
            <Heading
              style={{
                ...tw("text-2xl font-bold text-center mb-4"),
                color: "#333333",
              }}
            >
              Hello {name}!
            </Heading>
            <Text style={{ ...tw("text-gray-600 mb-6"), fontSize: "16px" }}>
              This email uses Tailwind-like utility classes.
            </Text>
            <div style={tw("text-center")}>
              <Button
                href="#"
                style={{
                  ...tw("bg-blue-500 text-white py-4 px-4 rounded font-bold"),
                  textDecoration: "none",
                  display: "inline-block",
                }}
              >
                Click Me
              </Button>
            </div>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};
```

## Supported Tailwind Classes

The `tw()` helper supports a comprehensive set of Tailwind utilities:

### Colors

**Text Colors:**

- `text-white`, `text-black`, `text-gray-[50-900]`
- `text-blue-[500,600]`, `text-green-[500,600]`, `text-red-[500,600]`

**Background Colors:**

- `bg-white`, `bg-black`, `bg-gray-[50,100,200,800,900]`
- `bg-blue-[50,500,600]`, `bg-green-[50,500]`, `bg-red-[50,500]`

### Spacing

**Padding:** `p-[0-8]`, `px-[2-8]`, `py-[1-8]`

**Margin:** `m-[0,2,4]`, `mx-auto`, `mb-[1-8]`, `mt-[2-8]`

### Typography

**Font Sizes:** `text-[xs,sm,base,lg,xl,2xl,3xl,4xl]`

**Font Weights:** `font-[normal,medium,semibold,bold]`

**Text Alignment:** `text-[left,center,right]`

**Line Heights:** `leading-[tight,normal,relaxed]`

### Layout

**Display:** `block`, `inline`, `inline-block`, `flex`

**Width:** `w-[full,auto]`, `max-w-[sm,md,lg,xl,2xl]`

**Border Radius:** `rounded`, `rounded-[md,lg,xl,full]`

**Shadows:** `shadow`, `shadow-[md,lg,xl]`

**Borders:** `border`, `border-2`, `border-gray-[200,300]`, `border-blue-500`

## Available Components

- `Html` - Root HTML wrapper
- `Head` - Document head
- `Body` - Document body
- `Container` - Content container
- `Section` - Content section
- `Text` - Text content
- `Heading` - Headings
- `Button` - Buttons with href support
- `Img` - Images

## Tips

1. Always use the object spread operator `...tw()` when combining with other styles
2. You can mix Tailwind classes with custom CSS properties
3. Remember to include `= {}` in your function parameters for default destructuring
4. The email generator looks for `ShowcaseEmail`, `WelcomeEmail`, `PasswordResetEmail`, or `NewsletterEmail` functions
