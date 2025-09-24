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

## Direct Tailwind CSS Support

Use `className` directly on React Email components wrapped in the `<Tailwind>` component! This automatically converts Tailwind classes to inline styles for maximum email client compatibility:

```jsx
const ModernEmail = ({ name = "User" } = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white p-6 rounded-lg shadow-lg">
              <Heading className="text-2xl font-bold text-center mb-4 text-gray-900">
                Hello {name}!
              </Heading>
              <Text className="text-gray-600 mb-6 text-base">
                This email uses Tailwind classes directly with className!
              </Text>
              <div className="text-center">
                <Button
                  href="#"
                  className="bg-blue-500 text-white py-4 px-4 rounded font-bold no-underline inline-block"
                >
                  Click Me
                </Button>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

## Supported Tailwind Classes

React Email supports ALL Tailwind utility classes via `className`. Here are some examples:

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

1. **Always wrap your email content with `<Tailwind>` component** - this is required for className conversion!
2. Use `className` directly on any React Email component inside the Tailwind wrapper
3. You can still use `style` for custom CSS properties when needed
4. Combine classes freely: `className="bg-blue-500 text-white p-4 rounded-lg font-bold"`
5. Remember to include `= {}` in your function parameters for default destructuring
6. The email generator looks for `ShowcaseEmail`, `WelcomeEmail`, `PasswordResetEmail`, or `NewsletterEmail` functions
7. The `<Tailwind>` component automatically converts all className values to inline styles for email compatibility
8. You can customize Tailwind config by passing a `config` prop to the `<Tailwind>` component
