interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return <main className="h-full w-full">{children}</main>;
}
