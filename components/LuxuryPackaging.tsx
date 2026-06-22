import { Gift } from "lucide-react";

export default function LuxuryPackaging() {
  return (
    <section className="py-12 px-6 bg-black">
      <div className="max-w-5xl mx-auto bg-card border border-gold/20 rounded-lg p-6 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* صورة الهدية */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            {/* استخدمنا صورة صندوق هدايا فاخر كمثال */}
            <img 
              src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=600" 
              alt="تغليف فاخر" 
              className="w-full h-full object-cover rounded-md border border-gold/10"
            />
          </div>
        </div>

        {/* النصوص والأزرار */}
        <div className="w-full md:w-1/2 text-center md:text-right">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Gift className="text-gold w-8 h-8" />
            <h2 className="text-3xl md:text-4xl text-white font-bold">تغليف فاخر...</h2>
          </div>
          <p className="text-gold text-lg md:text-xl mb-8">لأنك تستحقين الأفضل</p>
          
          <button className="border border-gold text-gold hover:bg-gold hover:text-black transition-colors px-10 py-3 rounded-sm font-bold text-lg w-full md:w-auto">
            تسوق الهدايا
          </button>
        </div>

      </div>
    </section>
  );
}