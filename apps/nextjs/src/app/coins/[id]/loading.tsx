import { SkeletonCoinDetails } from "~/components/coins/coin-details/skeleton";


export default function LoadingPage() {
  return (
    <div className="mt-16 flex flex-col gap-6 p-4">
      <SkeletonCoinDetails />
    </div>
  );

}