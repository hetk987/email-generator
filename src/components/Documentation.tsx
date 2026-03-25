"use client";

import { useCallback } from "react";
import toast from "react-hot-toast";
import { Copy, ExternalLink } from "lucide-react";
import { templateAssetGlobals } from "public/assets";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    REACT_EMAIL_PRIMITIVES,
    APP_COMPONENTS,
    TEMPLATE_EXAMPLE,
    buildTemplateDocumentationPlainText,
} from "@/lib/templateDocumentationData";

const REACT_EMAIL_DOCS = "https://react.email/docs/components/html";

function CodeBlock({ children }: { children: string }) {
    return (
        <pre className="mt-3 rounded-lg border bg-muted/50 p-3 text-xs overflow-x-auto sm:text-sm">
            <code className="text-foreground whitespace-pre font-mono">
                {children}
            </code>
        </pre>
    );
}

function PropTable({
    rows,
}: {
    rows: { name: string; description: string }[];
}) {
    return (
        <div className="mt-2 rounded-lg border overflow-hidden">
            <table className="w-full text-sm table-fixed">
                <thead>
                    <tr className="border-b bg-muted/40 text-left">
                        <th className="px-2 py-1.5 text-xs font-medium sm:px-3 sm:py-2 sm:text-sm w-[min(30%,11rem)]">
                            Name
                        </th>
                        <th className="px-2 py-1.5 text-xs font-medium sm:px-3 sm:py-2 sm:text-sm">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.name} className="border-b last:border-0">
                            <td className="px-2 py-1.5 align-top font-mono text-[11px] break-words sm:px-3 sm:py-2 sm:text-xs">
                                {row.name}
                            </td>
                            <td className="px-2 py-1.5 text-xs text-muted-foreground break-words sm:px-3 sm:py-2 sm:text-sm">
                                {row.description}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export function Documentation() {
    const copyAllForLlm = useCallback(async () => {
        const text = buildTemplateDocumentationPlainText();
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Documentation copied for LLMs");
        } catch {
            toast.error("Could not copy to clipboard");
        }
    }, []);

    return (
        <div className="flex h-full min-h-0 w-full flex-col">
            <div className="flex flex-shrink-0 flex-col gap-3 border-b border-border bg-card/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
                <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    Template reference
                </h1>
                <Button
                    type="button"
                    variant="default"
                    size="sm"
                    className="shrink-0 gap-2 bg-brand-primary text-primary-foreground shadow-brand hover:bg-brand-primary/90"
                    onClick={copyAllForLlm}
                >
                    <Copy className="h-4 w-4" />
                    Copy all for LLM
                </Button>
            </div>

            <ScrollArea className="min-h-0 flex-1">
                <div className="w-full px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 lg:items-start">
                        <Card className="shadow-sm">
                            <CardHeader className="space-y-0 pb-3">
                                <CardTitle className="text-base">
                                    How templates work
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
                                <ul className="list-disc space-y-1.5 pl-4 text-xs sm:text-sm">
                                    <li>
                                        One function component,{" "}
                                        <strong className="text-foreground">
                                            PascalCase
                                        </strong>{" "}
                                        name; first match wins.
                                    </li>
                                    <li>
                                        No{" "}
                                        <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                                            import
                                        </code>
                                        — globals are injected.
                                    </li>
                                    <li>
                                        <strong className="text-foreground">
                                            Generate Preview
                                        </strong>{" "}
                                        renders with{" "}
                                        <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                                            {"{}"}
                                        </code>{" "}
                                        props.
                                    </li>
                                </ul>
                                <CodeBlock children={TEMPLATE_EXAMPLE} />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
                                <CardTitle className="text-base">
                                    React Email primitives
                                </CardTitle>
                                <a
                                    href={REACT_EMAIL_DOCS}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-primary hover:underline"
                                >
                                    Docs
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <PropTable rows={REACT_EMAIL_PRIMITIVES} />
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="space-y-0 pb-3">
                                <CardTitle className="text-base">
                                    Global assets
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 pt-0 text-xs sm:text-sm">
                                {templateAssetGlobals.map((asset) => (
                                    <div
                                        key={asset.key}
                                        className="rounded-lg border bg-muted/30 p-2.5 font-mono text-[11px] break-all sm:p-3 sm:text-xs"
                                    >
                                        <span className="text-muted-foreground">
                                            {asset.key}
                                        </span>
                                        <span className="mx-1.5 text-border">
                                            ·
                                        </span>
                                        <span className="text-foreground">
                                            {asset.url}
                                        </span>
                                        <p className="mt-1.5 font-sans text-[11px] leading-snug text-muted-foreground normal-case sm:text-xs">
                                            {asset.description}
                                        </p>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card className="shadow-sm">
                            <CardHeader className="space-y-0 pb-3">
                                <CardTitle className="text-base">
                                    App components
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5 pt-0">
                                {APP_COMPONENTS.map((block, index) => (
                                    <div key={block.title}>
                                        {index > 0 && (
                                            <div className="mb-5 border-t border-border pt-5" />
                                        )}
                                        <h4 className="text-xs font-semibold text-foreground sm:text-sm">
                                            {block.title}
                                        </h4>
                                        {block.intro ? (
                                            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
                                                {block.intro}
                                            </p>
                                        ) : null}
                                        <PropTable rows={block.props} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <p className="rounded-lg border border-dashed border-border bg-muted/20 px-3 py-2.5 text-center text-xs text-muted-foreground lg:col-span-2 sm:text-sm">
                            <span className="font-medium text-foreground">
                                React
                            </span>{" "}
                            is injected for JSX (classic runtime)—no import.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
