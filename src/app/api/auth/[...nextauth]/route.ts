import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

// NextAuth'ı merkezi yapılandırmamızla başlatıyoruz.
const handler = NextAuth(authOptions);

// API rotası için GET ve POST metodlarını dışa aktarıyoruz.
export { handler as GET, handler as POST };
