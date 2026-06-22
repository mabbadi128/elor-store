import { Truck, ShieldCheck, Zap, Leaf } from "lucide-react";

const features = [
  { icon: <ShieldCheck className="w-8 h-8" />, title: "دفع آمن", desc: "100% حماية لبياناتك" },
  { icon: <Truck className="w-8 h-8" />, title: "توصيل سريع", desc: "خلال 1-3 أيام عمل" },
  { icon: <Zap className="w-8 h-8" />, title: "ترطيب عميق", desc: "لبشرة صحية ونضرة" },
  { icon: <Leaf className="w-8 h-8" />, title: "مكونات طبيعية", desc: "مختارة بعناية فائقة" },
];

export default function Features() {
  return (
    <section className="py-10 bg-black border-b border-gold/10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {features.map((f, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-3">
            <div className="text-gold mb-2">{f.icon}</div>
            <h3 className="text-white font-bold text-sm md:text-base">{f.title}</h3>
            <p className="text-gray-500 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}