import Menu from "@/app/ui/menu";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Menu />
      <main className="flex-grow">{children}</main>

      <footer className="bg-gray-800 text-white p-4 text-center mt-auto">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} Notz. Tüm Hakları Saklıdır.
        </div>
      </footer>
    </div>
  );
}
