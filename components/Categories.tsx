const categories = [
  { id: 1, name: "العناية بالجسم", image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=400" },
  { id: 2, name: "العناية بالبشرة", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400" },
  { id: 3, name: "العناية بالشعر", image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=400" },
  { id: 4, name: "مجموعة الهدايا", image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400" },
];

export default function Categories() {
  return (
    <section className="py-12 px-6 bg-black border-b border-gold/10">
      {/* استخدمنا overflow-x-auto عشان نقدر نسحب التصنيفات يمين ويسار بالشاشات الصغيرة */}
      <div className="flex justify-start md:justify-center items-center gap-6 md:gap-12 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((category) => (
          <div key={category.id} className="flex flex-col items-center gap-3 cursor-pointer group min-w-[80px]">
            {/* الدائرة الذهبية الخارجية */}
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-gold/30 p-1 group-hover:border-gold transition-colors duration-300">
              {/* الدائرة الداخلية التي تحتوي على الصورة */}
              <div className="w-full h-full rounded-full overflow-hidden relative bg-card">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            {/* اسم التصنيف */}
            <span className="text-gray-300 text-sm font-medium whitespace-nowrap group-hover:text-gold transition-colors">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}