import { FavoriteList } from "~/components/coins/favorite-list";

export default function FavoritesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Favorite Coins</h1>
      <FavoriteList />
    </div>
  );
} 