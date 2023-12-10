import Media from "@/models/Media";
import GiantBomb from "@/models/services/GiantBomb";

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
}
