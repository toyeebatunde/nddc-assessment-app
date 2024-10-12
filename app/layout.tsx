import type { Metadata } from "next";
import "./globals.css";
import { cookies } from 'next/headers'
import AppContext from "@/components/ContextProvider";
import DashboardLayout from "@/components/CustomLayout";


export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies()
  const userCookie = cookieStore.get('jwt')
  return (
    <html lang="en">
      <body className={``}>
        <DashboardLayout cookieData={userCookie}>
          {children}
        </DashboardLayout>
      </body>
    </html>
  );
}
