import WalletContainer from '@/components/WalletContainer';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { wallet: string } }): Promise<Metadata> {
    return {
        title: `Wallet: ${params.wallet}`
    }
};

export default function Wallet({
    params,
}: {
    params: { wallet: string };
}) {
    return (
        <div className="container max-w-6xl mx-auto px-4">
            <WalletContainer address={params.wallet} />
        </div>
    );
}   