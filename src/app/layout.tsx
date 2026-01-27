import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "PseudoLawyer | AI-Powered Contract Negotiation",
    description: "Negotiate contracts with AI assistance. The future of legal agreements - simple, secure, and intelligent contract creation.",
    keywords: ["contract", "negotiation", "AI", "legal", "agreement", "NDA", "freelance"],
    authors: [{ name: "PseudoLawyer" }],
    openGraph: {
        title: "PseudoLawyer | AI-Powered Contract Negotiation",
        description: "The future of legal agreements. Negotiate contracts with AI assistance.",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "PseudoLawyer | AI-Powered Contract Negotiation",
        description: "The future of legal agreements. Negotiate contracts with AI assistance.",
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#030305',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            </head>
            <body className="min-h-screen bg-void text-white antialiased font-body">
                {/* Global background effects */}
                <div className="fixed inset-0 mesh-gradient pointer-events-none" />
                <div className="fixed inset-0 grid-pattern pointer-events-none opacity-50" />

                {/* Ambient orbs */}
                <div className="fixed top-0 left-1/4 w-[600px] h-[600px] orb orb-cyan opacity-20 breathing-slow" />
                <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] orb orb-magenta opacity-15 breathing-slow" style={{ animationDelay: '-4s' }} />

                {/* Main content */}
                <div className="relative z-10">
                    {children}
                </div>
            </body>
        </html>
    );
}
