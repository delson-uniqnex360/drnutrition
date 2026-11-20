import { getProducts } from "@/lib/products";
import { ProductRow } from "@/components/ProductCard";
import HomeBanner from "@/components/HomeBanner";
import CategorySlider from "@/components/CategorySlider";
import BestCombos from "@/components/BestCombos";
import FlashSaleBanner from "@/components/FlashSaleBanner";
import TopSellingProducts from "@/components/TopSellingProducts";
import TrendingProducts from "@/components/TrendingProducts";
import BrandBannerSlider from "@/components/BrandBannerSlider";
import SportsNutritionTopSellers from "@/components/SportsNutritionTopSellers";
import SportsNutritionCreatine from "@/components/SportsNutritionCreatine";
import PromoBannerCarousel from "@/components/PromoBannerCarousel";
import WhatsAppBanner from "@/components/WhatsAppBanner";
import CountryLanguageSelector from "@/components/CountryLanguageSelector";
import Footer from "@/components/Footer";

export default function Home() {
  const products = getProducts();

  return (
    <>
      <main className="container mx-auto p-6">
        <HomeBanner />
        <CategorySlider />
        {/*  */}
        <h1 className="mb-6 text-3xl font-bold">Products</h1>
        <ProductRow products={products} />
        {/*  */}
        <BestCombos />
        <FlashSaleBanner />
        <TopSellingProducts />
        <TrendingProducts />
        <BrandBannerSlider />
        <SportsNutritionTopSellers />
        <SportsNutritionCreatine />
        <PromoBannerCarousel />
        <SportsNutritionCreatine />
        <WhatsAppBanner />
        <TrendingProducts />
        <CountryLanguageSelector />
      </main>
      <Footer />
    </>
  );
}
