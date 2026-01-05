import Media from "@/models/Media";
import { Props as InfoLink } from "@/app/(media)/_components/MediaGrid/MediaGridItemMenuInfoLink";
import { config } from "@/models/utils/config";
import { encodeText } from "@/models/utils/urlHelpers";
import GameCloudFunctions from "@/models/services/GameCloudFunctions";

interface VendorIds {
  giantBomb?: string;
  igdb?: number;
}

export default class Game extends Media<VendorIds> {
  get mainVendorId(): string | number | null {
    return this.vendorIds?.igdb ?? null;
  }

  get modelName(): string {
    return "Games";
  }

  get batchOperationConcurrencyLimit(): number {
    return 500; // IGDB allows up to 500 IDs per request
  }

  async refresh(items: Game[]): Promise<Game[]> {
    const gameProvider = new GameCloudFunctions();
    await gameProvider.fillGames(items);

    return items;
  }

  get infoLinks(): InfoLink[] {
    const encodedTitle = encodeText(this.title);

    return [
      {
        variant: "games",
        url: config.vendors.gamesCz.searchUrl + encodedTitle,
      },
      {
        variant: "epicStore",
        url: config.vendors.epicgamesCom.searchUrl + encodedTitle,
      },
      {
        variant: "steam",
        url: config.vendors.steampoweredCom.searchUrl + encodedTitle,
      },
      {
        variant: "steamDB",
        url: config.vendors.steamdbInfo.searchUrl + encodedTitle,
      },
    ];
  }

  get searchInfoLink(): string {
    return config.vendors.gamesCz.searchUrl + encodeText(this.title);
  }
}
