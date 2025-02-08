import { SkeletonCoinList } from "~/components/coins/skeleton-coin-list";
import { Container } from "~/components/layout/container";

export default function LoadingPage() {
  return (
    <div className="mt-16 flex-1 py-8">
      <Container>
        <div className="border-b pb-5">
          <h1 className="text-2xl font-semibold leading-7">Favorite Coins</h1>
        </div>
      </Container>

      <div className="mt-8">
        <SkeletonCoinList />
      </div>
    </div>
  );
}
