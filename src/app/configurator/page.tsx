import ConfiguratorClient from '@/components/Configurator/ConfiguratorClient';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function ConfiguratorPage() {
    return (
        <div style={{ height: 'calc(100vh - 73px)', overflow: 'hidden' }}>
            <ConfiguratorClient />
        </div>
    )
}
