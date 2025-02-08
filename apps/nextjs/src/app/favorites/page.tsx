import { FavoriteList } from "~/components/coins/favorite-list";
import { PageHeader } from "~/components/layout/page-header";

export const dynamic = "force-dynamic";

export default function FavoritesPage() {
  return (
    <div className="mt-16 flex-1 py-8">
      <PageHeader
        title="Favorite Coins"
        description="Your personalized watchlist of cryptocurrencies that matter most to you"
      />
      <div className="mt-8">
        <FavoriteList />
      </div>
    </div>
  );
}
