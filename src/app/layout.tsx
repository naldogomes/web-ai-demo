import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
    variable: '--font-sans',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Web AI Demo',
    description: 'IA executada localmente no seu navegador com as APIs nativas do Chrome.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
    return (
        <html lang="pt-BR" className={plusJakartaSans.variable}>
            <body>{children}</body>
        </html>
    );
}
