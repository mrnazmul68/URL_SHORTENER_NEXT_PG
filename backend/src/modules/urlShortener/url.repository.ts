import { prisma } from "@lib";
import type { Prisma } from "../../../generated/prisma/client.js";

export class UrlRepository {
  //todo: create short url
  async create(data: Prisma.UrlCreateInput) {
    return prisma.url.create({
      data,
    });
  }

  //todo: redirect to original url
  async findByShortUrl(shortUrl: string) {
    return await prisma.url.findUnique({
      where: {
        shortUrl: shortUrl,
      },
    });
  }

  //todo: redirect to original url
  async incrementClickCount(shortUrl: string) {
    return await prisma.url.update({
      where: {
        shortUrl: shortUrl,
      },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });
  }
}
