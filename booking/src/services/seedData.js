// seedData.js — seeds fresh realistic data into localStorage on first load

const SEEDED_KEY = "thiyang_seeded_v2";

export const seedIfEmpty = () => {
  if (localStorage.getItem(SEEDED_KEY)) return;

  // ── Orders ──────────────────────────────────────────────────────────────
  const orders = [
    { id:"ORD-7891", customer:"Hana Abebe",      email:"hana.abebe@gmail.com",    initials:"HA", color:"#22c55e", product:"Salon Booking Premium",  date:"Apr 14, 2026", amount:1120,  status:"Completed",  trend:[3,5,4,6,5,7,8] },
    { id:"ORD-7890", customer:"Dawit Mekonnen",  email:"dawit.mekonnen@gmail.com", initials:"DM", color:"#3b82f6", product:"Spa Treatment Pack",      date:"Apr 13, 2026", amount:850,   status:"Processing", trend:[4,3,5,4,6,5,7] },
    { id:"ORD-7889", customer:"Sara Fikre",      email:"sara.fikre@gmail.com",     initials:"SF", color:"#f59e0b", product:"Wedding Venue Slot",      date:"Apr 12, 2026", amount:3500,  status:"Completed",  trend:[2,4,3,5,6,7,9] },
    { id:"ORD-7888", customer:"Liya Alem",       email:"liya.alem@gmail.com",      initials:"LA", color:"#8b5cf6", product:"Dining Reservation",      date:"Apr 11, 2026", amount:450,   status:"Completed",  trend:[5,4,6,5,4,6,5] },
    { id:"ORD-7887", customer:"Abebe Girma",     email:"abebe.girma@gmail.com",    initials:"AG", color:"#ec4899", product:"Consultation Session",    date:"Apr 10, 2026", amount:750,   status:"Completed",  trend:[3,5,7,6,8,7,9] },
    { id:"ORD-7886", customer:"Tigist Yared",    email:"tigist.yared@gmail.com",   initials:"TY", color:"#06b6d4", product:"Fitness Class Pass",      date:"Apr 9, 2026",  amount:280,   status:"Cancelled",  trend:[6,5,4,3,2,3,2] },
    { id:"ORD-7885", customer:"Mekdes Tadesse",  email:"mekdes.tadesse@gmail.com", initials:"MT", color:"#22c55e", product:"Salon Booking Premium",  date:"Apr 8, 2026",  amount:1120,  status:"Completed",  trend:[4,5,6,7,6,8,7] },
    { id:"ORD-7884", customer:"Selam Kidane",    email:"selam.kidane@gmail.com",   initials:"SK", color:"#f97316", product:"Spa Treatment Pack",      date:"Apr 7, 2026",  amount:850,   status:"Processing", trend:[3,4,5,4,6,5,7] },
    { id:"ORD-7883", customer:"Yonas Haile",     email:"yonas.haile@gmail.com",    initials:"YH", color:"#a855f7", product:"Dining Reservation",      date:"Apr 6, 2026",  amount:450,   status:"Pending",    trend:[5,6,5,4,5,6,5] },
    { id:"ORD-7882", customer:"Bethlehem Alemu", email:"bethlehem.alemu@gmail.com",initials:"BA", color:"#14b8a6", product:"Wedding Venue Slot",      date:"Apr 5, 2026",  amount:3500,  status:"Completed",  trend:[4,5,6,7,8,7,9] },
    { id:"ORD-7881", customer:"Girma Tadesse",   email:"girma.tadesse@gmail.com",  initials:"GT", color:"#ef4444", product:"Consultation Session",    date:"Apr 4, 2026",  amount:750,   status:"Cancelled",  trend:[7,6,5,4,3,2,1] },
    { id:"ORD-7880", customer:"Almaz Bekele",    email:"almaz.bekele@gmail.com",   initials:"AB", color:"#22c55e", product:"Fitness Class Pass",      date:"Apr 3, 2026",  amount:280,   status:"Completed",  trend:[3,4,5,6,7,8,9] },
  ];
  localStorage.setItem("mock_orders", JSON.stringify(orders));

  // ── Payments ─────────────────────────────────────────────────────────────
  const now = new Date();
  const payments = orders
    .filter(o => o.status === "Completed")
    .map((o, i) => ({
      id:        "PAY-" + Math.random().toString(36).slice(2,8).toUpperCase(),
      userId:    String(i + 2),
      userName:  o.customer,
      type:      "product",
      description: o.product,
      amount:    o.amount,
      method:    ["card","bank_transfer","telebirr"][i % 3],
      cardLast4: i % 3 === 0 ? "4242" : null,
      bankName:  i % 3 === 1 ? "Commercial Bank of Ethiopia (CBE)" : null,
      status:    "paid",
      createdAt: new Date(now.getTime() - i * 86400000).toISOString(),
    }));
  localStorage.setItem("mock_payments", JSON.stringify(payments));

  // ── Bookings ──────────────────────────────────────────────────────────────
  const bookings = [
    { id:"BK-A1B2", userId:"2", userName:"Hana Abebe",     userEmail:"hana.abebe@gmail.com",    service:"Hair Salon",          serviceIcon:"💇", price:450,  duration:"45 min", date:"2026-04-20", time:"10:00 AM", status:"confirmed",  paymentStatus:"verified",  paymentMethod:"card",          createdAt: new Date(now.getTime()-1*86400000).toISOString() },
    { id:"BK-C3D4", userId:"3", userName:"Dawit Mekonnen", userEmail:"dawit.mekonnen@gmail.com", service:"Doctor Consultation", serviceIcon:"🩺", price:500,  duration:"30 min", date:"2026-04-21", time:"9:00 AM",  status:"pending",    paymentStatus:"unpaid",    paymentMethod:"bank_transfer", createdAt: new Date(now.getTime()-2*86400000).toISOString() },
    { id:"BK-E5F6", userId:"4", userName:"Sara Fikre",     userEmail:"sara.fikre@gmail.com",     service:"Dental Checkup",      serviceIcon:"🦷", price:600,  duration:"45 min", date:"2026-04-22", time:"11:00 AM", status:"confirmed",  paymentStatus:"verified",  paymentMethod:"telebirr",      createdAt: new Date(now.getTime()-3*86400000).toISOString() },
    { id:"BK-G7H8", userId:"5", userName:"Liya Alem",      userEmail:"liya.alem@gmail.com",      service:"Personal Trainer",    serviceIcon:"🏋️", price:700,  duration:"1 hr",   date:"2026-04-23", time:"7:00 AM",  status:"pending",    paymentStatus:"unpaid",    paymentMethod:"card",          createdAt: new Date(now.getTime()-4*86400000).toISOString() },
    { id:"BK-I9J0", userId:"6", userName:"Abebe Girma",    userEmail:"abebe.girma@gmail.com",    service:"Yoga Class",          serviceIcon:"🧘", price:250,  duration:"60 min", date:"2026-04-24", time:"6:00 AM",  status:"completed",  paymentStatus:"verified",  paymentMethod:"bank_transfer", createdAt: new Date(now.getTime()-5*86400000).toISOString() },
    { id:"BK-K1L2", userId:"7", userName:"Tigist Yared",   userEmail:"tigist.yared@gmail.com",   service:"House Cleaning",      serviceIcon:"🧹", price:800,  duration:"2 hrs",  date:"2026-04-18", time:"9:00 AM",  status:"cancelled",  paymentStatus:"rejected",  paymentMethod:"card",          createdAt: new Date(now.getTime()-6*86400000).toISOString() },
  ];
  localStorage.setItem("all_bookings", JSON.stringify(bookings));

  // ── Notifications ─────────────────────────────────────────────────────────
  const notifs = [
    { id:1, userId:"admin", title:"New booking received",    body:"Hana Abebe booked Hair Salon for Apr 20 at 10AM",           type:"booking", read:false, createdAt: new Date(now.getTime()-1*3600000).toISOString() },
    { id:2, userId:"admin", title:"Payment verified",        body:"Sara Fikre's payment of ETB 600 for Dental Checkup verified", type:"payment", read:false, createdAt: new Date(now.getTime()-2*3600000).toISOString() },
    { id:3, userId:"admin", title:"New customer signup",     body:"Bethlehem Alemu created a new account",                     type:"user",    read:false, createdAt: new Date(now.getTime()-3*3600000).toISOString() },
    { id:4, userId:"admin", title:"Booking awaiting payment","body":"Dawit Mekonnen's Doctor Consultation needs payment verification", type:"booking", read:false, createdAt: new Date(now.getTime()-4*3600000).toISOString() },
    { id:5, userId:"admin", title:"Order completed",         body:"Wedding Venue Slot order by Sara Fikre completed",          type:"order",   read:true,  createdAt: new Date(now.getTime()-5*3600000).toISOString() },
    { id:6, userId:"2",     title:"Booking Confirmed ✅",    body:"Your Hair Salon appointment is confirmed for Apr 20 at 10AM. ETB 450 verified.", type:"success", read:false, createdAt: new Date(now.getTime()-1*3600000).toISOString() },
    { id:7, userId:"4",     title:"Booking Confirmed ✅",    body:"Your Dental Checkup is confirmed for Apr 22 at 11AM. ETB 600 verified.",        type:"success", read:false, createdAt: new Date(now.getTime()-2*3600000).toISOString() },
    { id:8, userId:"all",   title:"Welcome to Thiyang! 🎉",  body:"Discover and book local services near you. Get started today!", type:"info", read:false, createdAt: new Date(now.getTime()-24*3600000).toISOString() },
  ];
  localStorage.setItem("mock_notifications", JSON.stringify(notifs));

  localStorage.setItem(SEEDED_KEY, "true");
  console.log("✅ Thiyang: Fresh data seeded");
};

export const clearAndReseed = () => {
  localStorage.removeItem(SEEDED_KEY);
  localStorage.removeItem("mock_orders");
  localStorage.removeItem("mock_payments");
  localStorage.removeItem("all_bookings");
  localStorage.removeItem("mock_notifications");
  seedIfEmpty();
};
