import Media from "@/models/Media";
import GiantBomb from "@/models/services/GiantBomb";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import UrlHelpers from "@/models/utils/UrlHelpers";

export default class Game extends Media {
  get modelName(): string {
    return "Games";
  }

  get batchOperationConcurrencyLimit(): number {
    return 80;
  }

  async refresh(items: Game[]): Promise<Game[]> {
    const giantBomb = new GiantBomb();
    await giantBomb.fillGames(items);

    return items;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = UrlHelpers.encodeText(this.title);

    return [
      {
        variant: "games",
        url: config.vendors.gamesCz.searchUrl + encodedTitle,
      },
      {
        variant: "gamespot",
        url: config.vendors.gamespotCom.searchUrl + encodedTitle,
      },
      {
        variant: "steam",
        url: config.vendors.steampoweredCom.searchUrl + encodedTitle,
      },
    ];
  }

  get searchInfoLink(): string {
    return config.vendors.gamesCz.searchUrl + UrlHelpers.encodeText(this.title);
  }
}
