# 📦 Custom Components System Documentation

## Overview

The Email Generator includes pre-built custom components and assets that are automatically available in all email templates. No import statements are needed - you can use these components directly in your templates.

## 🚀 How to Use

### Available Components

All custom components are automatically available in your templates:

- `CustomButton` - Customizable button component
- `Card` - Flexible card component for content sections
- `Header` - Pre-built header with logo and title support
- `Footer` - Footer with company info and unsubscribe links

### Available Assets

All assets are automatically available as variables:

- `logoUrl` - Company logo placeholder
- `heroBgUrl` - Hero background image placeholder

### Using Components in Templates

Use the components directly in your templates without any import statements:

```javascript
const MyEmail = () => {
  return (
    <Html>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-gray-100">
          <Container className="mx-auto max-w-2xl p-5">
            <Header
              logoUrl={logoUrl}
              companyName="My Company"
              title="Welcome!"
              subtitle="Thanks for joining us"
            />

            <Card variant="elevated" className="mb-6">
              <Text className="text-lg mb-4">
                This is a custom card component!
              </Text>
              <CustomButton
                href="https://example.com"
                variant="primary"
                size="lg"
              >
                Click Me
              </CustomButton>
            </Card>

            <Footer companyName="My Company" />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

## 📁 Available Components

### CustomButton

A customizable button component with multiple variants and sizes.

**Props:**

- `href?: string` - Link URL
- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Button content
- `variant?: 'primary' | 'secondary' | 'outline'` - Button style variant
- `size?: 'sm' | 'md' | 'lg'` - Button size

**Example:**

```javascript
<CustomButton
  href="https://example.com"
  variant="primary"
  size="lg"
  className="custom-class"
>
  Get Started
</CustomButton>
```

### Card

A flexible card component for content sections.

**Props:**

- `className?: string` - Additional CSS classes
- `children: React.ReactNode` - Card content
- `variant?: 'default' | 'elevated' | 'outlined'` - Card style variant
- `padding?: 'sm' | 'md' | 'lg'` - Internal padding

**Example:**

```javascript
<Card variant="elevated" padding="lg" className="mb-6">
  <Text>Card content goes here</Text>
</Card>
```

### Header

A pre-built header component with logo and title support.

**Props:**

- `logoUrl?: string` - Logo image URL
- `companyName?: string` - Company name for alt text
- `title?: string` - Main heading text
- `subtitle?: string` - Subtitle text
- `className?: string` - Additional CSS classes

**Example:**

```javascript
<Header
  logoUrl={logoUrl}
  companyName="TechCorp"
  title="Welcome to Our Platform!"
  subtitle="Discover amazing features"
/>
```

### Footer

A customizable footer component with company info and unsubscribe links.

**Props:**

- `companyName?: string` - Company name
- `address?: string` - Company address
- `showUnsubscribe?: boolean` - Show unsubscribe links
- `className?: string` - Additional CSS classes

**Example:**

```javascript
<Footer
  companyName="TechCorp"
  address="123 Tech Street, City, ST 12345"
  showUnsubscribe={true}
/>
```

## 🖼️ Available Assets

### Images

- `logoUrl` - Company logo placeholder
- `heroBgUrl` - Hero background image placeholder

**Example:**

```javascript
// Use directly in components - no import needed
<Img src={logoUrl} alt="Company Logo" />
<Img src={heroBgUrl} alt="Hero Background" />
```

## 🔧 Adding New Components

To add new components to the system:

1. Create a new component file in `src/components/email/`:

```typescript
// src/components/email/MyComponent.tsx
import React from 'react';
import { Section } from '@react-email/components';

interface MyComponentProps {
  title?: string;
  children: React.ReactNode;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title, children }) => {
  return (
    <Section className="my-component">
      {title && <Heading className="text-xl font-bold">{title}</Heading>}
      {children}
    </Section>
  );
};
```

2. Export it from `src/components/email/index.ts`:

```typescript
export { MyComponent } from "./MyComponent";
```

3. Add TypeScript definitions to `src/components/CodeEditor.tsx`:

```typescript
// In the reactEmailTypes string
declare var MyComponent: (props: { title?: string; children?: any }) => any;
```

4. Import the component in `src/app/page.tsx`:

```typescript
// In the generateHtml function
const { MyComponent } = await import("@/components/email");
```

5. Add it to the execution environment:

```typescript
// In the executeTemplate function parameters and call
"MyComponent",
// ... in the function call
MyComponent,
```

## 🚨 Important Notes

1. **No Import Statements**: Components and assets are automatically available - no import statements needed

2. **Component Naming**: Component names must start with a capital letter (React convention)

3. **TypeScript Support**: The Monaco editor provides full IntelliSense and autocomplete for all custom components

4. **Automatic Availability**: All components and assets are pre-loaded and available in every template

5. **Global Scope**: Components are available in the global scope of your template functions

6. **Tailwind Structure**: Always place `<Head />` inside the `<Tailwind>` component to ensure hover styles work properly

## 🎯 Best Practices

1. **Component Reusability**: Design components to be reusable across different email templates

2. **Props Interface**: Always define clear TypeScript interfaces for component props

3. **Default Values**: Provide sensible default values for optional props

4. **Styling**: Use Tailwind classes for consistent styling across components

5. **Documentation**: Document component props and usage examples

## 🔍 Troubleshooting

### Component Not Available

- Check that the component is properly exported from `index.ts`
- Ensure the component is added to the execution environment in `page.tsx`
- Verify the component is imported in the `generateHtml` function

### TypeScript Errors

- Make sure TypeScript definitions are added to `CodeEditor.tsx`
- Check that prop types match the component interface

### Component Not Rendering

- Verify the component is imported in the `generateHtml` function
- Check that it's added to the `executeTemplate` function parameters
- Ensure the component is passed to the function call

## 📚 Examples

See the "Import Example" template in the template gallery for a complete working example of how to use custom components and assets.
