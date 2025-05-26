import Link from "next/link";
import NavLinks from "./nav-links";

export default function Menu() {
  return (
    <nav className="bg-white shadow-md p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/dashboard"
          className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors"
        >
          Notz
        </Link>
        <NavLinks />
        {/* Auth.js eklenince buraya kullanıcı adı ve çıkış butonu gelecek */}
        {/* <li>
              <button className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Çıkış Yap</button>
            </li> */}
      </div>
    </nav>
  );
}
