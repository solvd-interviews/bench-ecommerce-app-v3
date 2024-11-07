import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="w-full flex flex-col" id="root-layout">
      <Header />
      <div className="w-full min-h-screen" id="root-layout-scroll-container">
        {children}
      </div>
      <footer
        className="w-full flex justify-center h-8 items-center bg-white"
        id="root-layout-footer"
      >
        © Solvd. All rights reserved.
      </footer>
    </main>
  );
}
