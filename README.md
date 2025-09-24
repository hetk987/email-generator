# Email Generator

A modern, intuitive email generator built with Next.js, React Email, and Monaco Editor. Create beautiful, responsive emails with Tailwind CSS support and real-time preview.

## Features

- 🎨 **Split-pane Interface**: Code editor on the left, live preview on the right
- ⚡ **Real-time Preview**: See your email changes instantly as you type
- 📧 **React Email Components**: Use the powerful React Email component library
- 🌟 **Tailwind CSS Support**: Style emails using Tailwind utility classes with `className`
- 🔧 **Monaco Editor**: Full VS Code-like editing experience with IntelliSense
- 📋 **HTML Export**: Export your emails as production-ready HTML
- 🎯 **JSX Syntax**: Write emails in familiar React JSX syntax
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## Getting Started

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Run the development server**:

   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage

1. **Write JSX Code**: Use the Monaco editor to write React Email components with JSX syntax
2. **Style with Tailwind**: Add `className` attributes using Tailwind CSS utility classes
3. **Wrap with Tailwind**: Ensure your email content is wrapped with `<Tailwind>` component
4. **Preview Live**: See your changes in real-time in the preview pane
5. **Generate & Export**: Click "Generate Preview" to render HTML and export

### Example Email Template

```jsx
const MyEmail = ({ name = "User" } = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-md p-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Hello {name}!
              </Heading>
              <Text className="text-gray-600 mb-6">
                Welcome to our platform!
              </Text>
              <Button
                href="https://example.com"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Get Started
              </Button>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
```

## Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **React Email** - Email components with Tailwind integration
- **Monaco Editor** - VS Code-like editor with IntelliSense
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Babel Standalone** - JSX transformation in the browser
- **Lucide React** - Beautiful icon library

## Target Audience

This tool is designed for:

- **Developers** building transactional emails
- **Marketing teams** creating promotional content
- **Product teams** designing user onboarding sequences

## Architecture

The application consists of these main components:

- **`src/app/page.tsx`** - Main application with email generation logic
- **`src/components/CodeEditor.tsx`** - Monaco Editor with React Email IntelliSense
- **`src/components/EmailPreview.tsx`** - HTML preview and export functionality
- **`src/components/ResizablePanels.tsx`** - Split-pane layout component

### Key Functions

- **`generateHtml()`** - Transforms JSX code to HTML using Babel and React Email
- **`handleCodeChange()`** - Updates editor state when code changes
- **Monaco `beforeMount`** - Configures TypeScript definitions for autocompletion

## Maintenance

### Adding New React Email Components

1. Import the component in `src/app/page.tsx` in the `generateHtml` function
2. Add it to the execution environment parameters
3. Add TypeScript definitions in `src/components/CodeEditor.tsx`

### Updating Tailwind Configuration

The app uses React Email's `<Tailwind>` component for className processing. To customize:

1. Pass a `config` prop to the `<Tailwind>` component in your email templates
2. Use React Email's `pixelBasedPreset` for email client compatibility

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT
