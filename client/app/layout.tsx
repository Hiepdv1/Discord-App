import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import DataProvider from "@/components/providers/data-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/them-provider";
import { cn } from "@/lib/utils";
import ModalProvider from "@/components/providers/modal-provider";
import SocketProvider from "@/components/providers/socket-provider";
import QueryProvider from "@/components/chat/query-provider";
import { PendingMessagesProvider } from "@/components/providers/pending-message";
import { SocketEventProvider } from "@/components/providers/socket-event-provider";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Chap Application",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
            <html lang="en" suppressHydrationWarning>
                <body
                    className={cn(
                        font.className,
                        "bg-[#CCC] dark:bg-[#313338] select-none !pointer-events-auto"
                    )}
                >
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="dark"
                        enableSystem={false}
                        storageKey="mode-theme"
                    >
                        <DataProvider>
                            <SocketProvider>
                                <PendingMessagesProvider>
                                    <SocketEventProvider>
                                        <QueryProvider>
                                            <ModalProvider />
                                            {children}
                                        </QueryProvider>
                                    </SocketEventProvider>
                                </PendingMessagesProvider>
                            </SocketProvider>
                        </DataProvider>
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
