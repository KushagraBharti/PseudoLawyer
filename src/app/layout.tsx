import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PseudoLawyer | AI-Powered Contract Negotiation",
    description: "Negotiate contracts with AI assistance. Simple, secure, and collaborative contract creation for everyone.",
    keywords: ["contract", "negotiation", "AI", "legal", "agreement"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className="min-h-screen bg-background antialiased">
                {children}
            </body>
        </html>
    );
}
