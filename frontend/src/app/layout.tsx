import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import QueryProvider from '@/context/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Nexus Auth - Enterprise SaaS Boilerplate',
    description: 'A production-ready full-stack authentication system.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </QueryProvider>
            </body>
        </html>
    );
}
