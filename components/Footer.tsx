import { Mail, Phone, ExternalLink, Globe, Share2, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gold/10 pt-16 pb-32 md:pb-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-right" dir="rtl">
        
        {/* معلومات العلامة التجارية - ELOR */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gold tracking-widest">ELOR</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            نقدم لكِ أجود مستحضرات التجميل المستوحاة من الطبيعة، لنمنح بشرتك العناية التي تستحقها تحت إشراف خبراء الجمال.
          </p>
          <div className="flex gap-4 pt-2 justify-start">
  {/* أيقونات بديلة ومضمونة 100% */}
  <span title="موقعنا" aria-label="موقعنا">
    <Globe className="text-gray-400 hover:text-gold cursor-pointer w-5 h-5 transition-colors" />
  </span>

  <span title="شاركنا" aria-label="شاركنا">
    <Share2 className="text-gray-400 hover:text-gold cursor-pointer w-5 h-5 transition-colors" />
  </span>

  <span title="تواصل معنا" aria-label="تواصل معنا">
    <MessageSquare className="text-gray-400 hover:text-gold cursor-pointer w-5 h-5 transition-colors" />
  </span>
</div>
        </div>

        {/* روابط هامة */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg">روابط هامة</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="hover:text-gold cursor-pointer transition-colors flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-gold/50" /> من نحن
            </li>
            <li className="hover:text-gold cursor-pointer transition-colors flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-gold/50" /> سياسة الاستبدال
            </li>
            <li className="hover:text-gold cursor-pointer transition-colors flex items-center gap-2">
              <ExternalLink className="w-3 h-3 text-gold/50" /> الأسئلة الشائعة
            </li>
          </ul>
        </div>

        {/* خدمة العملاء */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg">خدمة العملاء</h3>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center gap-3 justify-start">
              <Phone className="w-4 h-4 text-gold" /> 
              <span dir="ltr">+966 50 123 4567</span>
            </li>
            <li className="flex items-center gap-3 justify-start">
              <Mail className="w-4 h-4 text-gold" /> 
              <span>support@elor.com</span>
            </li>
          </ul>
        </div>

        {/* الاشتراك في النشرة */}
        <div>
          <h3 className="text-white font-bold mb-6 text-lg">اشتركي في نشرتنا</h3>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="بريدك الإلكتروني" 
              className="bg-black border border-gold/20 text-white p-2 rounded-sm flex-1 text-sm focus:border-gold outline-none"
            />
            <button className="bg-gold text-black px-4 py-2 rounded-sm font-bold text-xs hover:bg-gold-light transition-all">
              اشتراك
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gold/5 text-center">
  <p className="text-gray-500 text-[10px] md:text-xs tracking-widest uppercase mb-2">
    &copy; 2026 ELOR LUXURY COSMETICS. جميع الحقوق محفوظة.
  </p>

  <p className="text-gray-600 text-[9px] md:text-[10px]">
    تم التطوير بواسطة{" "}
    <a
      href="https://wa.me/905365195807"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold/60 font-bold hover:text-gold transition-colors"
    >
      Muhammed Abbadı
    </a>
  </p>

  <p className="text-gray-600 text-[9px] md:text-[10px] mt-1">
    <a
      href="mailto:mabbadi128@gmail.com"
      className="text-gold/50 hover:text-gold transition-colors"
    >
      mabbadi128@gmail.com
    </a>
  </p>
</div>
    </footer>
  );
}