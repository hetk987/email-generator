# 📧 Email Generator

A powerful, modern email template generator built with Next.js, React Email, and Tailwind CSS. Create beautiful, responsive emails with real-time preview using familiar React JSX syntax.

![Email Generator Preview](https://via.placeholder.com/800x400/1f2937/ffffff?text=Email+Generator+Preview)

## ✨ Features

- 🎨 **Split-pane Interface**: Code editor on the left, live preview on the right
- ⚡ **Real-time Preview**: See your email changes instantly as you type
- 📧 **React Email Components**: Use the powerful React Email component library
- 🌟 **Tailwind CSS Support**: Style emails using Tailwind utility classes with `className`
- 🔧 **Monaco Editor**: Full VS Code-like editing experience with IntelliSense
- 📋 **HTML Export**: Export your emails as production-ready HTML
- 🎯 **JSX Syntax**: Write emails in familiar React JSX syntax
- 🎨 **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- 📱 **Responsive Design**: Optimized for all screen sizes
- ☁️ **Google Drive Integration**: Download templates from and upload results to Google Drive
- 👥 **Team Collaboration**: Share templates through Google Workspace shared drives

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/yourusername/email-generator.git
   cd email-generator
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Google Drive integration** (optional but recommended for team collaboration):

   Create a `.env.local` file in the root directory:

   ```bash
   cp .env.example .env.local
   ```

   Then follow the [Google Cloud Console Setup](#google-cloud-console-setup) instructions below.

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 📖 Usage Guide

### Basic Email Template

Here's a simple email template to get you started:

```jsx
const WelcomeEmail = ({ name = "User" } = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            <Section className="bg-white rounded-lg shadow-md p-6">
              <Heading className="text-2xl font-bold text-gray-900 mb-4">
                Welcome, {name}! 👋
              </Heading>
              <Text className="text-gray-600 mb-6">
                Thank you for joining our platform. We're excited to have you!
              </Text>
              <Button
                href="https://example.com/dashboard"
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

### Key Concepts

#### 1. **Tailwind Wrapper**

All email content must be wrapped in the `<Tailwind>` component for className support:

```jsx
<Tailwind>{/* Your email content here */}</Tailwind>
```

#### 2. **React Email Components**

Use React Email components for email-compatible HTML:

- `<Html>` - Root HTML wrapper
- `<Head>` - Document head
- `<Body>` - Document body
- `<Container>` - Content container
- `<Section>` - Content section
- `<Text>` - Text content
- `<Heading>` - Headings (h1-h6)
- `<Button>` - Buttons with href support
- `<Img>` - Images

#### 3. **Tailwind Classes**

Use any Tailwind utility classes with `className`:

```jsx
<Section className="bg-blue-50 p-6 rounded-lg mb-4">
  <Heading className="text-xl font-bold text-blue-900">Your Heading</Heading>
</Section>
```

### Advanced Example

```jsx
const NewsletterEmail = ({
  name = "Subscriber",
  articles = [
    { title: "Getting Started Guide", url: "#" },
    { title: "Best Practices", url: "#" },
    { title: "Tips & Tricks", url: "#" },
  ],
} = {}) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="font-sans bg-gray-100 m-0 p-0">
          <Container className="mx-auto p-5 max-w-2xl">
            {/* Header */}
            <Section className="bg-white rounded-lg shadow-md mb-6 p-6">
              <Heading className="text-3xl font-bold text-center text-gray-900 mb-2">
                Weekly Newsletter
              </Heading>
              <Text className="text-center text-gray-600">
                Stay updated with the latest news and updates
              </Text>
            </Section>

            {/* Content */}
            <Section className="bg-white rounded-lg shadow-md p-6 mb-6">
              <Heading className="text-xl font-semibold text-gray-900 mb-4">
                Hello {name}! 👋
              </Heading>
              <Text className="text-gray-700 mb-6">
                Here are this week's featured articles:
              </Text>

              {articles.map((article, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <Heading className="text-lg font-medium text-gray-900 mb-2">
                    {article.title}
                  </Heading>
                  <Button
                    href={article.url}
                    className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium"
                  >
                    Read More
                  </Button>
                </div>
              ))}
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 rounded-lg p-6 text-center">
              <Text className="text-gray-600 text-sm">
                © 2024 Your Company. All rights reserved.
              </Text>
              <Text className="text-gray-500 text-xs mt-2">
                <a href="#" className="text-blue-600 underline">
                  Unsubscribe
                </a>{" "}
                |
                <a href="#" className="text-blue-600 underline">
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

## 🏗️ Architecture

### Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # App layout
│   └── page.tsx            # Main application
├── components/
│   ├── CodeEditor.tsx      # Monaco editor component
│   ├── EmailPreview.tsx    # Preview component
│   ├── ResizablePanels.tsx # Split-pane layout
│   └── ui/                 # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── separator.tsx
├── contexts/
│   ├── ApiContext.tsx      # API configuration context
│   ├── GoogleDriveContext.tsx # Google Drive integration context
│   └── ThemeContext.tsx    # Theme management context
└── lib/
    ├── apiService.ts       # API service utilities
    ├── googleDriveService.ts # Google Drive API service
    └── utils.ts            # Utility functions
```

### Key Components

- **`src/app/page.tsx`** - Main application with email generation logic
- **`src/components/CodeEditor.tsx`** - Monaco Editor with React Email IntelliSense
- **`src/components/EmailPreview.tsx`** - HTML preview and export functionality
- **`src/components/ResizablePanels.tsx`** - Split-pane layout component

### Core Functions

- **`generateHtml()`** - Transforms JSX code to HTML using Babel and React Email
- **`handleCodeChange()`** - Updates editor state when code changes
- **Monaco `beforeMount`** - Configures TypeScript definitions for autocompletion

## ☁️ Google Cloud Console Setup

To enable Google Drive integration for team collaboration, follow these steps:

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 2. Enable Google Drive API

1. In the Google Cloud Console, navigate to **APIs & Services** > **Library**
2. Search for "Google Drive API"
3. Click on it and press **Enable**

### 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **Internal** (for Google Workspace organizations) or **External**
3. Fill in the required fields:
   - App name: "Email Generator"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/drive.readonly`
5. Add test users (if using External) or skip (if using Internal)

### 4. Create OAuth 2.0 Credentials

1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client ID**
3. Choose **Web application**
4. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production domain (e.g., `https://yourdomain.com`)
5. Copy the **Client ID**

### 5. Set Up Environment Variables

1. Create a `.env.local` file in your project root:

   ```bash
   # Google Drive API Configuration
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id_here
   NEXT_PUBLIC_DRIVE_FOLDER_ID=your_folder_id_here
   ```

2. Replace `your_client_id_here` with the Client ID from step 4

3. Create a folder in Google Drive for HTML uploads and get its ID:
   - Create a folder in Google Drive
   - Open the folder and copy the ID from the URL
   - Replace `your_folder_id_here` with this folder ID

### 6. Share Drive Folder (Team Setup)

1. Right-click the folder in Google Drive
2. Click **Share**
3. Add your team members' email addresses
4. Give them **Editor** or **Viewer** permissions as needed

### 7. File Types Supported

The Google Drive integration supports:

- **Download**: `.jsx`, `.tsx`, `.txt` files
- **Upload**: HTML files (generated emails) and JSX files (source code)

## 🛠️ Development

### Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **React Email** - Email components with Tailwind integration
- **Monaco Editor** - VS Code-like editor with IntelliSense
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality component library
- **Babel Standalone** - JSX transformation in the browser
- **Lucide React** - Beautiful icon library

### Adding New React Email Components

1. Import the component in `src/app/page.tsx` in the `generateHtml` function:

   ```typescript
   const {
     Html,
     Head,
     Body,
     Container,
     Text,
     Button,
     Section,
     Heading,
     Img,
     Tailwind,
     NewComponent,
   } = await import("@react-email/components");
   ```

2. Add it to the execution environment parameters:

   ```typescript
   const executeTemplate = new Function(
     "React",
     "Html",
     "Head",
     "Body",
     "Container",
     "Text",
     "Button",
     "Section",
     "Heading",
     "Img",
     "Tailwind",
     "NewComponent"
     // ... rest of function
   );
   ```

3. Add TypeScript definitions in `src/components/CodeEditor.tsx`:
   ```typescript
   declare var NewComponent: (props: {
     className?: string;
     children?: any;
   }) => any;
   ```

### Customizing Tailwind Configuration

The app uses React Email's `<Tailwind>` component for className processing. To customize:

1. Pass a `config` prop to the `<Tailwind>` component in your email templates:

   ```jsx
   <Tailwind config={{
     presets: [pixelBasedPreset],
     theme: {
       extend: {
         colors: {
           brand: "#007291",
         },
       },
     },
   }}>
   ```

2. Use React Email's `pixelBasedPreset` for email client compatibility:
   ```jsx
   import { pixelBasedPreset } from "@react-email/components";
   ```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 Target Audience

This tool is designed for:

- **Developers** building transactional emails
- **Marketing teams** creating promotional content
- **Product teams** designing user onboarding sequences
- **Designers** prototyping email layouts
- **Agencies** creating client email templates

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React Email](https://react.email/) for the amazing email component library
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the powerful code editor
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library

## 📞 Support

- 📧 Email: support@emailgenerator.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/email-generator/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/email-generator/discussions)

---

Made with ❤️ by the Email Generator team
