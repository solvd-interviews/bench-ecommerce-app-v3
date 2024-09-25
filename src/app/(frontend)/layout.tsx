import Header from "@/components/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-screen w-full flex flex-col" id="root-layout">
      <Header />
      <div
        className="w-full overflow-y-scroll"
        id="root-layout-scroll-container"
      >
        <div className="w-full min-h-screen" id="root-layout-content">
          {children}
        </div>
        <footer
          className="w-full flex justify-center h-8 items-center bg-white"
          id="root-layout-footer"
        >
          © Solvd. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
