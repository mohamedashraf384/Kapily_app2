import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// إعدادات السيرفر (قاعدة البيانات)
const SUPABASE_URL = "https://tpvcjyhnbmxtzyqzxpdx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhYmdjaWoiOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // الكود ده بيكمل أوتوماتيك من عندك
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = "mohamed111997";

// 1. بيانات الحلاقين
const BARBERS = [
  { name: "أشرف", phone: "201119576866" },
  { name: "حماده", phone: "201128375682" },
  { name: "يوسف", phone: "201229818899" }
];

// 2. قائمة الخدمات
const SERVICES_LIST = [
  { id: 1, name: "حلاقة شعر", price: 100, duration: "30 دقيقة" },
  { id: 2, name: "حلاقة ذقن", price: 50, duration: "20 دقيقة" },
  { id: 3, name: "شعر وذقن", price: 140, duration: "50 دقيقة" },
  { id: 4, name: "ماسك تنظيف بشرة", price: 60, duration: "15 دقيقة" }
];

// 3. المواعيد المتاحة
const TIMES = [
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", 
  "03:00 PM", "04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM", 
  "08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"
];

export default function BarberApp() {
  const [step, setStep] = useState(1);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [customerName, setCustomerName] = useState("");

  const handleConfirmWhatsApp = () => {
    if (!customerName || !selectedTime) {
      alert("من فضلك ادخل اسمك واختار الوقت");
      return;
    }

    const message = `حجز جديد من الموقع:%0aالاسم: ${customerName}%0aالحلاق: ${selectedBarber.name}%0aالخدمة: ${selectedService.name}%0aالوقت: ${selectedTime}%0aالسعر: ${selectedService.price} ج.م`;
    const whatsappUrl = `https://wa.me/${selectedBarber.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 font-sans text-right" dir="rtl">
      {/* الهيدر */}
      <header className="text-center mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold text-yellow-500">صالون Kapily</h1>
        <p className="text-zinc-400 mt-2">أفضل خدمة حلاقة وتجهيز عرايس</p>
      </header>

      <div className="max-w-md mx-auto bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-zinc-800">
        
        {/* الخطوة 1: اختيار الحلاق */}
        {step === 1 && (
          <div>
            <h2 className="text-xl mb-4 font-bold border-r-4 border-yellow-500 pr-2">اختار الحلاق المفضل:</h2>
            <div className="grid gap-3">
              {BARBERS.map((barber) => (
                <button 
                  key={barber.name}
                  onClick={() => { setSelectedBarber(barber); setStep(2); }}
                  className="bg-zinc-800 hover:bg-yellow-600 hover:text-black p-4 rounded-xl text-lg font-bold transition-all text-right flex justify-between items-center"
                >
                  <span>{barber.name}</span>
                  <span className="text-sm opacity-50">متاح الآن</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 2: اختيار الخدمة */}
        {step === 2 && (
          <div>
            <button onClick={() => setStep(1)} className="text-yellow-500 mb-4 text-sm">← رجوع للحلاقين</button>
            <h2 className="text-xl mb-4 font-bold border-r-4 border-yellow-500 pr-2">اختار الخدمة:</h2>
            <div className="grid gap-3">
              {SERVICES_LIST.map((service) => (
                <button 
                  key={service.id}
                  onClick={() => { setSelectedService(service); setStep(3); }}
                  className="bg-zinc-800 hover:border-yellow-500 border border-transparent p-4 rounded-xl text-right transition-all"
                >
                  <div className="flex justify-between font-bold">
                    <span>{service.name}</span>
                    <span className="text-yellow-500">{service.price} ج.م</span>
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">{service.duration}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* الخطوة 3: تأكيد البيانات والوقت */}
        {step === 3 && (
          <div>
            <button onClick={() => setStep(2)} className="text-yellow-500 mb-4 text-sm">← رجوع للخدمات</button>
            <h2 className="text-xl mb-4 font-bold border-r-4 border-yellow-500 pr-2">تأكيد الموعد:</h2>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="اسمك الكريم" 
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-yellow-500"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <select 
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 outline-none focus:border-yellow-500"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="">اختار الوقت المتاح</option>
                {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <div className="bg-zinc-800 p-4 rounded-xl border border-dashed border-zinc-600 mt-6">
                <p className="text-sm text-zinc-400">ملخص الحجز:</p>
                <p className="font-bold">الحلاق: <span className="text-yellow-500">{selectedBarber.name}</span></p>
                <p className="font-bold">الخدمة: <span className="text-yellow-500">{selectedService.name}</span></p>
              </div>

              <button 
                onClick={handleConfirmWhatsApp}
                className="w-full bg-yellow-600 text-black font-bold py-4 rounded-xl hover:bg-yellow-500 transition-all text-lg mt-4"
              >
                تأكيد الحجز عبر واتساب 📱
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="text-center mt-12 text-zinc-600 text-sm">
        <p>© 2026 صالون Kapily - جميع الحقوق محفوظة</p>
        <button onClick={() => window.location.href='/admin'} className="mt-4 opacity-50">دخول الإدارة</button>
      </footer>
    </div>
  );
}
