import { Header } from "@/components/Header/header";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Header />
      <main className="container mx-auto w-screen h-screen  bg-red-600">
        {children}
      </main>
    </div>
  );
}
