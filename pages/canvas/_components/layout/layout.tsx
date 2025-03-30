import dynamic from 'next/dynamic';
import { AppSidebar } from './app-sidebar';
import { Navbar } from './navbar/navbar';
import { OrgSidebar } from './org_sidebar';

interface LayoutProps {
    children: React.ReactNode;
}

const Dashboard = dynamic(() => import('auth/wrapper'!), { ssr: false });

const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: undefined,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: undefined,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: undefined,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: undefined,
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
    ],
    projects: [
    ],
  }

export default function Layout({ children }: LayoutProps) {
    return (
        <Dashboard data={data}>
          <main className="h-full w-full">
              <OrgSidebar />
              <div className="pl-[60px] h-full">
                  <div className="flex gap-x-3 h-full">
                      <AppSidebar />
                      <div className="h-full flex-1">
                          <Navbar />
                          {children}
                      </div>
                  </div>
              </div>
          </main>
        </Dashboard>
    );
}
