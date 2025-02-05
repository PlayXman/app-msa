import { Tmdb } from "@/models/services/Tmdb";
import { Trakt } from "@/models/services/Trakt";
import Media from "@/models/Media";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import { encodeText } from "@/models/utils/urlHelpers";

export default class TvShow extends Media {
  get modelName(): string {
    return "TvShows";
  }

  get batchOperationConcurrencyLimit(): number {
    return 100;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = encodeText(this.title);

    return [
      {
        variant: "trakt",
        url: config.vendors.traktTv.tvShowSearchUrl + encodedTitle,
      },
      {
        variant: "imdb",
        url: config.vendors.imdbCom.tvShowSearchUrl + encodedTitle,
      },
      {
        variant: "csfd",
        url: config.vendors.csfdCz.tvShowSearchUrl + encodedTitle,
      },
    ];
  }

  get searchInfoLink(): string {
    return config.vendors.imdbCom.tvShowSearchUrl + encodeText(this.title);
  }

  async delete(): Promise<void> {
    await super.delete();
    await this.removeFromWatchlist();
  }

  async refresh(items: TvShow[]): Promise<TvShow[]> {
    const tmdb = new Tmdb();
    await Promise.all(
      items.map(async (item) => {
        if (!item.id) {
          console.error(`Missing ID`, item);
          return;
        }

        try {
          await tmdb.fillTvShow(item);
        } catch (e) {
          console.error(`Failed to refresh ${item.id}`, e);
        }
      }),
    );

    return items;
  }

  async removeFromWatchlist() {
    const trakt = this.trakt;
    await trakt.removeFromWatchlist([this.id]);
  }

  protected get trakt(): Trakt {
    return new Trakt("shows");
  }
}
