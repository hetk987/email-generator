import { templateAssetGlobals } from "public/assets";

export type PropRow = { name: string; description: string };

export type AppComponentDoc = {
  title: string;
  intro?: string;
  props: PropRow[];
};

export const REACT_EMAIL_PRIMITIVES: PropRow[] = [
  { name: "Html", description: "Document root wrapper for the email." },
  { name: "Head", description: "Head section (meta, title children)." },
  {
    name: "Body",
    description: "Message body; supports className for layout and typography.",
  },
  {
    name: "Container",
    description: "Constrains width; typical outer wrapper for sections.",
  },
  {
    name: "Section",
    description: "Row or block section; className for spacing and backgrounds.",
  },
  { name: "Text", description: "Paragraph text; className for size and color." },
  {
    name: "Heading",
    description: "Heading text; className for hierarchy styling.",
  },
  {
    name: "Button",
    description: "Link-styled button; href, className, children.",
  },
  { name: "Img", description: "Image; src, alt, className." },
  {
    name: "Tailwind",
    description:
      "Wrap content to apply Tailwind classes inside the email (config optional).",
  },
];

export const APP_COMPONENTS: AppComponentDoc[] = [
  {
    title: "CustomButton",
    props: [
      { name: "href", description: "Optional link URL." },
      { name: "className", description: "Extra Tailwind / utility classes." },
      { name: "children", description: "Button label (required)." },
      {
        name: "variant",
        description: "'primary' | 'secondary' | 'outline' (default: primary).",
      },
      { name: "size", description: "'sm' | 'md' | 'lg' (default: md)." },
    ],
  },
  {
    title: "Card",
    props: [
      { name: "children", description: "Inner content (required)." },
      { name: "className", description: "Extra classes on the outer section." },
      {
        name: "variant",
        description: "'default' | 'elevated' | 'outlined' (default: default).",
      },
      { name: "padding", description: "'sm' | 'md' | 'lg' (default: md)." },
    ],
  },
  {
    title: "Header",
    props: [
      {
        name: "logoUrl",
        description: "Image URL for the logo (has a default placeholder).",
      },
      { name: "companyName", description: "Used for alt text and defaults." },
      { name: "title", description: "Main heading text." },
      { name: "subtitle", description: "Optional subheading." },
      { name: "className", description: "Extra classes on the section." },
    ],
  },
  {
    title: "Footer",
    props: [
      { name: "companyName", description: "Copyright and unsubscribe copy." },
      { name: "address", description: "Address line in the footer." },
      {
        name: "showUnsubscribe",
        description: "Show unsubscribe / preferences links (default: true).",
      },
      { name: "className", description: "Extra classes on the section." },
    ],
  },
];

export const TEMPLATE_EXAMPLE = `function WelcomeEmail() {
  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container>
            <Text>Hello from the sandbox.</Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}`;

const REACT_EMAIL_DOCS_URL = "https://react.email/docs/components/html";

/**
 * Full plain-text / markdown documentation for copying into an LLM context.
 * Kept in sync with the in-app Documentation tab via shared data above.
 */
export function buildTemplateDocumentationPlainText(): string {
  const lines: string[] = [];

  lines.push("# Email generator — template reference", "");
  lines.push(
    "JSX sandbox: no `{{placeholders}}`. Globals below are pre-injected.",
    ""
  );

  lines.push("## How templates work", "");
  lines.push(
    "- One function component, **PascalCase** name; runner uses the first match.",
    "- No `import` — React, components, and asset URLs are globals.",
    "- **Generate Preview** renders with `{}` props.",
    ""
  );
  lines.push("### Example", "", "```jsx", TEMPLATE_EXAMPLE, "```", "");

  lines.push("## React Email primitives", "");
  lines.push(`@react-email/components globals. Docs: ${REACT_EMAIL_DOCS_URL}`, "");
  for (const row of REACT_EMAIL_PRIMITIVES) {
    lines.push(`- **${row.name}**: ${row.description}`);
  }
  lines.push("");

  lines.push("## App components", "");
  for (const block of APP_COMPONENTS) {
    lines.push(`### ${block.title}`, "");
    if (block.intro) lines.push(block.intro, "");
    for (const p of block.props) {
      lines.push(`- **${p.name}**: ${p.description}`);
    }
    lines.push("");
  }

  lines.push("## Global assets", "");
  lines.push("Define in `src/assets/index.ts` → `templateAssetGlobals`.", "");
  for (const a of templateAssetGlobals) {
    lines.push(`- **${a.key}** = \`${a.url}\` — ${a.description}`);
  }
  lines.push("");

  lines.push("## React", "");
  lines.push("Injected for JSX (classic runtime); no import.", "");

  return lines.join("\n");
}
