import Image from "next/image";

export default function WhatsAppBanner() {
  return (
    <section className="w-full lg:mt-4">
      <a
        href=""
        className="block"
      >
        <div className="relative w-full aspect-[3.66667/1] lg:rounded-lg overflow-hidden">
          <Image
            src="https://media.drnutrition.com/media/JzVgB5AXuUU8vXMuvUc3uAPip3hzgNSpXSDAjGpv.jpg"
            alt="WhatsApp Channel"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover lg:rounded-lg"
          />
        </div>
      </a>
    </section>
  );
}
