import Image from "next/image";
import { useMetamask } from "@/app/hooks/blockchain/useMetamask";
import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { toast } from "sonner";

export default function Navbar() {
    const { userAddress, connect, disconnect, networkError, connectionStatus } = useMetamask();

    useEffect(() => {
        // Show toast when connectionStatus is set
        if (connectionStatus && !networkError) {
            toast.success(connectionStatus);
        }
    }, [connectionStatus, networkError]);

    return (
        <>
            <nav className="w-full px-6 py-4 bg-green-100 flex justify-between items-center shadow-md">
                <Link href="/" passHref>
                    <div className="flex items-center gap-2">


                        <div className="flex items-center justify-center cursor-pointer">
                            <Image
                                src="/assets/logo.svg"
                                alt="Logo"
                                width={40}
                                height={40}
                                className="object-contain"
                            />
                        </div>

                        <div className="flex items-center justify-center cursor-pointer">
                            <Image
                                src="/assets/logoname.svg"
                                alt="ChiyaChain"
                                width={120}
                                height={32}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </Link>

                {/* Wallet Connect Section */}
                <div className="flex items-center gap-4">
                    {userAddress && (
                        <>
                            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                            <p className="text-sm font-medium">
                                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                            </p>
                        </>
                    )}

                    {/* Display Network Error */}
                    {networkError && (
                        <p className="text-sm text-red-500">
                            {networkError}
                        </p>
                    )}

                    {/* Show Connect / Disconnect button */}
                    {userAddress ? (
                        <Button
                            onClick={disconnect}
                            variant="danger"
                        >
                            Disconnect
                        </Button>
                    ) : (
                        <Button
                            onClick={connect}
                            variant="primary"
                        >
                            Connect Wallet
                        </Button>
                    )}
                </div>
            </nav>


        </>
    );
}
