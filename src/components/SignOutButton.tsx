"use client";

import { signOut } from "next-auth/react";

type SignOutButtonProps = {
    className?: string;
    label?: string;
};

export default function SignOutButton({
    className = "rounded-xl px-6 py-2.5 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-white font-black uppercase tracking-widest text-xs hover:bg-red-600 dark:hover:bg-red-600 dark:hover:text-white transition-all shadow-lg active:scale-95",
    label = "Delogare",
}: SignOutButtonProps) {
    return (
        <button onClick={() => signOut({ callbackUrl: "/" })} className={className}>
            {label}
        </button>
    );
}
