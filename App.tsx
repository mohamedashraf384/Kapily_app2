import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tpvcjyhnbmopunmssrqz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwdmCqeWhuYm1vcHVubXNzcnF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg1Nzg4MzgsImV4cCI6MjA5NDE1NDgzOH0.YgtcaOpWYuNSmFz80M6hc09UKl65XiA6sfq9qIi8Voc";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_PASSWORD = "mohamed111997";

// 1. بيانات الحلاقين وأرقامهم
const BARBERS = [
  { name: "أشرف", phone: "201119576866" },
  { name: "حماده", phone: "201128375682" },
  { name: "يوسف", phone: "201229818899" },
];

// 2. قائمة الخدمات بالوقت والسعر
const SERVICES_LIST = [
  { name: "قص شعر", price: 150, duration: 30 },
  { name: "حلاقة ذقن", price: 100, duration: 20 },
  { name: "استشوار", price: 70, duration: 15 },
  { name: "قص أطفال", price: 100, duration: 30 },
  { name: "تمليس", price: 150, duration: 30 },
  { name: "بروتين", price: 500, duration: 120 },
  { name: "باكدج عريس", price: 1000, duration: 180 },
  { name: "واكس", price: 150, duration: 15 },
  { name: "تنظيف بشرة", price: 250, duration: 30 },
];

export default function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [passInput, setPassInput] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedBarber, setSelectedBarber] = useState(BARBERS[0]);
  const [allBookings, setAllBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchBookings();
    const channel = supabase.channel("realtime").on("postgres_changes", { event: "*", schema: "public", table: "bookings" }, () => fetchBookings()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  async function fetchBookings() {
    const { data } = await supabase.from("bookings").select("*").order("booking_date", { ascending: true }).order("booking_time", { ascending: true });
    if (data) setAllBookings(data);
  }

  // 3. وظيفة فحص تداخل المواعيد
  const isTimeSlotTaken = (barberName: string, date: string, newStartTime: string, duration: number) => {
    const newStart = new Date(`${date}T${newStartTime}`).getTime();
    const newEnd = newStart + duration * 60000;

    return allBookings.some(b => {
      if (b.barber_name !== barberName || b.booking_date !== date) return false;
      const existStart = new Date(`${b.booking_date}T${b.booking_time}`).getTime();
      const existEnd = existStart + (b.duration || 30) * 60000;
      return (newStart < existEnd && newEnd > existStart);
    });
  };

  const calculateEndTime = (startTime: string, totalMinutes: number) => {
    if (!startTime) return "";
    const [hours, minutes] = startTime.split(":").map(Number);
    const endTotalMinutes = hours * 60 + minutes + totalMinutes;
    const endHours = Math.floor(endTotalMinutes / 60) % 24;
    const endMins = endTotalMinutes % 60;
    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  const handleBooking = async () => {
    if (!customerName || !phoneNumber || !bookingTime || selectedServices.length === 0) {
      alert("البيانات ناقصة"); return;
    }

    const totalDuration = selectedServices.reduce((sum, name) => sum + (SERVICES_LIST.find(s => s.name === name)?.duration || 0), 0);
    const totalPrice = selectedServices.reduce((sum, name) => sum + (SERVICES_LIST.find(s => s.name === name)?.price || 0), 0);
    
    // فحص التداخل قبل الحجز
    if (isTimeSlotTaken(selectedBarber.name, bookingDate, bookingTime, totalDuration)) {
      alert("الموعد ده محجوز فعلاً عند " + selectedBarber.name + "، اختار وقت تاني");
      return;
    }

    const endTime = calculateEndTime(bookingTime, totalDuration);

    const { error } = await supabase.from("bookings").insert([{
      customer_name: customerName,
      phone_number: phoneNumber,
      barber_name: selectedBarber.name,
      booking_time: bookingTime,
      booking_date: bookingDate,
      services: selectedServices.join(" + "),
      total_price: totalPrice,
      duration: totalDuration
    }]);

    if (!error) {
      const msg = `*حجز جديد كابيلي*\nالاسم: ${customerName}\nالحلاق: ${selectedBarber.name}\nالموعد: من ${bookingTime} إلى ${endTime}\nالخدمات: ${selectedServices.join(", ")}\nالحساب: ${totalPrice} ج`;
      // الإرسال لرقم الحلاق المختار
      window.open(`https://wa.me/${selectedBarber.phone}?text=${encodeURIComponent(msg)}`, "_blank");
      setCustomerName(""); setPhoneNumber(""); setSelectedServices([]);
    } else {
      alert("خطأ في الاتصال بقاعدة البيانات");
    }
  };

  const stInput = { width: "100%", padding: "12px", marginBottom: "10px", borderRadius: "8px", background: "#111", color: "#fff", border: "1px solid #333", boxSizing: "border-box" as const };

  return (
    <div style={{ padding: "15px", background: "#000", color: "#fff", direction: "rtl", minHeight: "100vh", fontFamily: "sans-serif" }}>
      
      <div onClick={() => setShowAdminLogin(!showAdminLogin)} style={{ cursor: "pointer", textAlign: "center", marginBottom: "20px" }}>
        <h2 style={{ color: "#d4af37", margin: 0 }}>كابيلي</h2>
        <small style={{ color: "#444" }}>نظام الحجز الذكي</small>
      </div>

      {!isAdmin ? (
        <>
          <input placeholder="الاسم" style={stInput} value={customerName} onChange={e => setCustomerName(e.target.value)} />
          <input placeholder="الموبايل" style={stInput} value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
          
          <div style={{ display: "flex", gap: "5px" }}>
            <input type="date" style={stInput} value={bookingDate} onChange={e => setBookingDate(e.target.value)} />
            <input type="time" style={stInput} value={bookingTime} onChange={e => setBookingTime(e.target.value)} />
          </div>

          <p style={{ color: "#d4af37" }}>اختر الحلاق:</p>
          <div style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
            {BARBERS.map(b => (
              <button key={b.name} onClick={() => setSelectedBarber(b)} style={{ flex: 1, padding: "12px", borderRadius: "8px", background: selectedBarber.name === b.name ? "#d4af37" : "#111", color: selectedBarber.name === b.name ? "#000" : "#fff", border: "none", fontWeight: "bold" }}>{b.name}</button>
            ))}
          </div>

          <p style={{ color: "#d4af37" }}>الخدمات:</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {SERVICES_LIST.map(s => (
              <div key={s.name} onClick={() => setSelectedServices(prev => prev.includes(s.name) ? prev.filter(x => x !== s.name) : [...prev, s.name])} 
                   style={{ padding: "12px", background: selectedServices.includes(s.name) ? "#d4af37" : "#1a1a1a", color: selectedServices.includes(s.name) ? "#000" : "#fff", borderRadius: "8px", textAlign: "center", border: "1px solid #333", cursor: "pointer" }}>
                <b>{s.name}</b><br/>
                <span style={{ fontSize: "12px" }}>{s.price} ج ({s.duration} د)</span>
              </div>
            ))}
          </div>

          <button onClick={handleBooking} style={{ width: "100%", padding: "18px", background: "#fff", color: "#000", fontWeight: "bold", borderRadius: "12px", marginTop: "20px", fontSize: "16px", border: "none" }}>تأكيد الحجز</button>
        </>
      ) : (
        /* لوحة الإدارة (نفس كود الحذف) */
        <button onClick={() => setIsAdmin(false)}>خروج من الإدارة</button>
      )}

      {/* عرض المواعيد المحجوزة للمنع */}
      <div style={{ marginTop: "30px" }}>
        <h4 style={{ color: "#d4af37", textAlign: "center" }}>المواعيد المحجوزة اليوم</h4>
        <div style={{ background: "#0a0a0a", borderRadius: "12px", border: "1px solid #222" }}>
          {allBookings.filter(b => b.booking_date === bookingDate).map(b => (
            <div key={b.id} style={{ borderBottom: "1px solid #222", padding: "10px", fontSize: "12px" }}>
               🕒 {b.booking_time} - {b.barber_name} (محجوز 🔒)
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
