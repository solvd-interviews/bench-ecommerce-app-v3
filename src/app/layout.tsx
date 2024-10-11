import SessionProviderComponent from "@/components/SessionProvider";
import "./globals.css";
import { Roboto } from "next/font/google";
import { Toaster } from "sonner";
import ClientProviders from "@/components/ClientProvider";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"], // Include the weights you need
});

export const metadata: Metadata = {
  title: "Solvd Ecommerce",
  description: "Created by QA & bench full stack team with Next.js 14.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className + " bg-secondary"}>
        <SessionProviderComponent>
          <ClientProviders>{children}</ClientProviders>
        </SessionProviderComponent>
        <Toaster
          position="top-center"
          expand={false}
          richColors
          closeButton={true}
        />
      </body>
    </html>
  );
}
