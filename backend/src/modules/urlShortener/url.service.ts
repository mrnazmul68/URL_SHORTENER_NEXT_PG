import { ApiError } from "@utils/apiError.js";
import { UrlRepository } from "./url.repository.js";
import { nanoId } from "@utils/nanoid.js";

export class UrlService {
  private urlRepo: UrlRepository;
  constructor(urlRepo = new UrlRepository()) {
    this.urlRepo = urlRepo;
  }

  //todo: short url
  async shortUrl(fullUrl: string, customUrl?: string, userId?: string) {
    if (!fullUrl) {
      throw new ApiError(400, "Url not found");
    }

    if (customUrl) {
      if (userId) {
        const urlData = await this.urlRepo.findByShortUrl(customUrl, userId);
        if (urlData) {
          throw new ApiError(400, "Custom short url already exists");
        }
      }
      const urlData = await this.urlRepo.findByShortUrl(customUrl);
      if (urlData) {
        throw new ApiError(400, "Custom short url already exists");
      }

      return await this.urlRepo.create({
        fullUrl,
        shortUrl: customUrl,
        user: userId ? { connect: { id: userId } } : undefined,
      });
    }

    const randomUrl = nanoId();
    return await this.urlRepo.create({
      fullUrl,
      shortUrl: randomUrl,
      user: userId ? { connect: { id: userId } } : undefined,
    });
  }

  //todo: redirect and increment click count
  async redirect(shortUrl: string) {
    const urlData = await this.urlRepo.findByShortUrl(shortUrl);
    if (!urlData) {
      throw new ApiError(404, "Not found");
    }
    await this.urlRepo.incrementClickCount(shortUrl);
    return urlData;
  }
}
