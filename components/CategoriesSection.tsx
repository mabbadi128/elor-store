import Link from "next/link";
import Image from "next/image";

// مصفوفة التصنيفات مع روابطها المباشرة لصفحة المتجر مع الفلتر
const categories = [
  { 
    id: 1, 
    name: "العناية بالجسم", 
    image: "https://images.unsplash.com/photo-1608248593802-8406249462c1?q=80&w=400", // استبدلها بصورتك
    href: "/shop?category=العناية بالجسم" 
  },
  { 
    id: 2, 
    name: "العناية بالبشرة", 
    image: "https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?q=80&w=400", // استبدلها بصورتك
    href: "/shop?category=العناية بالبشرة" 
  },
  { 
    id: 3, 
    name: "العناية بالشعر", 
    image: "https://images.unsplash.com/photo-1617897903246-719342758052?q=80&w=400", // استبدلها بصورتك
    href: "/shop?category=العناية بالشعر" 
  },
  { 
    id: 4, 
    name: "مجموعة الهدايا", 
    image: "https://images.unsplash.com/photo-1599733594230-6b823276abce?q=80&w=400", // استبدلها بصورتك
    href: "/shop?category=مجموعة الهدايا" 
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-8 md:gap-16">
          
          {categories.map((cat) => (
            <Link 
              key={cat.id} 
              href={cat.href}
              className="flex flex-col items-center group cursor-pointer"
            >
              {/* إطار الدائرة مع تأثير اللمعان الذهبي عند التمرير */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 border-2 border-white/10 group-hover:border-gold transition-colors duration-500 mb-4 relative">
                <div className="w-full h-full relative rounded-full overflow-hidden bg-[#1a1a1a]">
                  <Image 
                    src={cat.image} 
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
              
              {/* اسم التصنيف */}
              <span className="text-white text-sm md:text-base font-medium group-hover:text-gold transition-colors duration-300">
                {cat.name}
              </span>
            </Link>
          ))}

        </div>
      </div>
    </section>
  );
}