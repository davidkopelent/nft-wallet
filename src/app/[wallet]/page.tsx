import WalletContainer from '@/components/WalletContainer';

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