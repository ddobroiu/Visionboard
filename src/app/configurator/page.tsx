import ConfiguratorClient from '@/components/Configurator/ConfiguratorClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ConfiguratorPage() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
            <header style={{ height: '64px', flexShrink: 0, borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', background: 'var(--surface)', zIndex: 10 }}>
                <Link href="/" style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', fontWeight: 500, textDecoration: 'none', color: 'var(--foreground)', marginRight: 'auto' }}>
                    <ChevronLeft size={20} style={{ marginRight: '0.5rem' }} />
                    Înapoi la Acasă
                </Link>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
                    Visionboard Designer
                </div>
                <div style={{ width: '100px' }}></div> {/* Spacer for centering */}
            </header>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <ConfiguratorClient />
            </div>
        </div>
    )
}
