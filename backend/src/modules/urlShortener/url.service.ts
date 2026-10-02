import { ApiError } from "@utils/apiError.js";
import { UrlRepository } from "./url.repository.js";
import { nanoId } from "@utils/nanoid.js";

export class UrlService {
  private urlRepo: UrlRepository;
  constructor(urlRepo = new UrlRepository()) {
    this.urlRepo = urlRepo;
  }

  //todo: short url
  async shortUrl(fullUrl: string, customUrl?: string) {
    if (!fullUrl) {
      throw new ApiError(400, "Url not found");
    }
    if (customUrl) {
      const urlData = await this.urlRepo.findByShortUrl(customUrl);
      if (urlData) {
        throw new ApiError(400, "Custom short url already exists");
      }

      return await this.urlRepo.create({
        fullUrl,
        shortUrl: customUrl,
      });
    }

    const randomUrl = nanoId();
    return await this.urlRepo.create({
      fullUrl,
      shortUrl: randomUrl,
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
