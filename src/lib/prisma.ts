// src/lib/prisma.ts

import { PrismaClient } from "@prisma/client";

// TypeScript'e global kapsamda bir 'prisma' değişkeni olabileceğini bildiriyoruz.
declare global {
  var prisma: PrismaClient | undefined;
}

// 'globalThis.prisma'yı kontrol et, eğer varsa onu kullan. Yoksa yeni bir PrismaClient oluştur.
// Bu, geliştirme ortamında (hot-reload) sürekli yeni bağlantı oluşturulmasını engeller.
const client = globalThis.prisma || new PrismaClient();

// Geliştirme ortamındaysak, oluşturduğumuz client'ı global değişkene atayarak
// bir sonraki seferde yeniden kullanılmasını sağlarız.
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = client;
}

export default client;
