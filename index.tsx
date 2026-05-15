import React, { useState } from 'react';

const BARBERS = [
  { name: "أشرف", phone: "201119576866" },
  { name: "حماده", phone: "201128375682" },
  { name: "يوسف", phone: "201229818899" }
];

const SERVICES = [
  { id: 1, name: "حلاقة شعر", price: 100 },
  { id: 2, name: "حلاقة ذقن", price: 50 },
  { id: 3, name: "شعر وذقن", price: 140 },
  { id: 4, name: "ماسك بشرة", price: 60 }
];

const TIMES = ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", "08:00 PM", "09:00 PM", "10:00 PM"];

export default function App() {
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");

  const sendWhatsApp = () => {
    if (!name || !time) return alert("من فضلك اكتب اسمك واختار الوقت");
    const msg = `*حجز جديد من الموقع*%0a-------------------%0a*الاسم:* ${name}%0a*الحلاق:* ${selectedBarber.name}%0a*الخدمة:* ${selectedService.name}%0a*الموعد:* ${time}%0a*السعر:* ${selectedService.price} ج.م`;
    window.open(`https://wa.me/${selectedBarber.phone}?text=${msg}`);
  };

  return (
    <div className="min-h-screen bg-black text-white p-5 font-sans" dir="rtl" style={{fontFamily: 'Cairo, sans-serif'}}>
      <header className="text-center py-8">
        <h1 className="text-4xl font-black text-yellow-500 tracking-tighter">KAPILY SALON</h1>
        <div className="h-1 w-20 bg-yellow-600 mx-auto mt-2 rounded-full"></div>
      </header>
      
      <div className="max-w-md mx-auto bg-zinc-900 p-6 rounded-3xl border border-zinc-800 shadow-2xl">
        {step === 1 && (
          <div className="animate-in fade-in">
            <h2 className="text-xl font-bold mb-6 border-r-4 border-yellow-500 pr-3">اختار الحلاق:</h2>
            <div className="grid gap-4">
              {BARBERS.map(b => (
                <button key={b.name} onClick={() => {setSelectedBarber(b); setStep(2)}} className="bg-zinc-800 p-5 rounded-2xl text-right hover:bg-yellow-600 hover:text-black font-bold transition-all flex justify-between items-center">
                  <span>{b.name}</span>
                  <span className="text-xs opacity-50">متاح</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-in slide-in-from-left">
            <button onClick={() => setStep(1)} className="text-zinc-500 text-sm mb-4">← رجوع للحلاقين</button>
            <h2 className="text-xl font-bold mb-6 border-r-4 border-yellow-500 pr-3">اختار الخدمة:</h2>
            <div className="grid gap-3">
              {SERVICES.map(s => (
                <button key={s.id} onClick={() => {setSelectedService(s); setStep(3)}} className="bg-zinc-800 p-5 rounded-2xl text-right flex justify-between hover:border-yellow-500 border border-transparent transition-all">
                  <span>{s.name}</span>
                  <span className="text-yellow-500 font-bold">{s.price} ج</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-in zoom-in">
            <button onClick={() => setStep(2)} className="text-zinc-500 text-sm mb-4">← رجوع للخدمات</button>
            <h2 className="text-xl font-bold mb-6 border-r-4 border-yellow-500 pr-3">تأكيد الحجز:</h2>
            <div className="space-y-4">
              <input type="text" placeholder="اسمك الكريم" className="w-full bg-zinc-800 p-4 rounded-xl border border-zinc-700 outline-none focus:border-yellow-500" onChange={(e)=>setName(e.target.value)} />
              <select className="w-full bg-zinc-800 p-4 rounded-xl border border-zinc-700 outline-none focus:border-yellow-500" onChange={(e)=>setTime(e.target.value)}>
                <option value="">اختار الوقت المتاح</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="bg-yellow-500/10 p-4 rounded-2xl mt-4 border border-yellow-500/20">
                <p className="text-sm">ملخص: <span className="text-yellow-500 font-bold">{selectedService.name}</span> مع <span className="text-yellow-500 font-bold">{selectedBarber.name}</span></p>
              </div>
              <button onClick={sendWhatsApp} className="w-full bg-yellow-500 text-black font-black py-4 rounded-xl text-lg shadow-lg hover:bg-yellow-400 transition-all">تأكيد عبر واتساب 📱</button>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-12 pb-10">
        <button onClick={() => {
          const pass = prompt("ادخل كلمة سر الإدارة:");
          if(pass === "mohamed111997") {
            alert("أهلاً بك يا مدير! جاري فتح لوحة التحكم...");
          } else {
            alert("كلمة السر خطأ!");
          }
        }} className="text-zinc-700 text-sm underline tracking-widest">لوحة الإدارة</button>
        <p className="text-zinc-800 text-[10px] mt-2">© 2026 KAPILY SALON</p>
      </div>
    </div>
  );
}
