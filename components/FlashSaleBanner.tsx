
import Image from "next/image";

export default function FlashSaleBanner() {
  return (
    <section className="mt-4 w-full">
      <div className="relative aspect-[4.39359/1] w-full overflow-hidden lg:rounded-lg">
        <Image
          src="https://media.drnutrition.com/media/k3N1mgb2XUbFKnG2u2G84M3SCFleGxJGqawZ5vsX.jpg"
          alt="Flash sale"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </section>
  );
}
