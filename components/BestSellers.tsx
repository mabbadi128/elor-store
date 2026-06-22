import ProductCard from "./ProductCard";

// بيانات وهمية للمنتجات
const products = [
  {
    id: 1,
    name: "كريم التجديد الليلي",
    subtitle: "NIGHT RENEWAL CREAM",
    price: 219,
    image: "https://images.unsplash.com/photo-1608248593802-8406249462c1?q=80&w=400", 
  },
  {
    id: 2,
    name: "سيروم الإشراق",
    subtitle: "GLOW SERUM",
    price: 249,
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400",
  },
  {
    id: 3,
    name: "زبدة الجسم الفاخرة",
    subtitle: "VELVET TOUCH",
    price: 199,
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400",
  }
];

export default function BestSellers() {
  return (
    <section className="py-12 px-6 bg-black">
      {/* عنوان القسم مع الخطوط الجانبية */}
      <div className="flex items-center justify-center gap-4 mb-10">
        <div className="h-[1px] bg-gold/30 w-16 md:w-32"></div>
        <h2 className="text-gold text-xl md:text-2xl font-bold">الأكثر مبيعاً</h2>
        <div className="h-[1px] bg-gold/30 w-16 md:w-32"></div>
      </div>

      {/* شبكة المنتجات */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 max-w-7xl mx-auto">
        {products.map((product) => (
          <ProductCard 
            key={product.id}
            id={product.id} // تم إضافة تمرير المعرف هنا
            image={product.image}
            name={product.name}
            subtitle={product.subtitle}
            price={product.price}
          />
        ))}
      </div>
    </section>
  );
}