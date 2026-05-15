require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");

const User         = require("./models/User");
const Business     = require("./models/Business");
const Service      = require("./models/Service");
const Booking      = require("./models/Booking");
const Product      = require("./models/Product");
const Order        = require("./models/Order");
const Payment      = require("./models/Payment");
const Review       = require("./models/Review");
const Notification = require("./models/Notification");

const seed = async () => {
  try {
    await mongoose.connect(process.env.db);
    console.log("✅ Connected to MongoDB\n");

    // Clear all
    await Promise.all([
      User.deleteMany(), Business.deleteMany(), Service.deleteMany(),
      Booking.deleteMany(), Product.deleteMany(), Order.deleteMany(),
      Payment.deleteMany(), Review.deleteMany(), Notification.deleteMany(),
    ]);
    console.log("🗑  Cleared all collections");

    // ── Users ──────────────────────────────────────────────────────────────
    const pw = await bcrypt.hash("password123", 12);
    const users = await User.insertMany([
      { name:"Admin User",    email:"admin@thiyang.com",  password:pw, role:"admin"    },
      { name:"Emma Wilson",   email:"emma@example.com",   password:pw, role:"customer" },
      { name:"James Chen",    email:"james@example.com",  password:pw, role:"customer" },
      { name:"Sofia Garcia",  email:"sofia@example.com",  password:pw, role:"customer" },
      { name:"Alex Thompson", email:"alex@example.com",   password:pw, role:"customer" },
      { name:"Maria Santos",  email:"maria@example.com",  password:pw, role:"business" },
    ]);
    const [admin, emma, james, sofia, alex, maria] = users;
    console.log(`👤 Users: ${users.length}`);

    // ── Businesses ─────────────────────────────────────────────────────────
    const businesses = await Business.insertMany([
      { owner:maria._id, name:"Hisky Barbershop",    slug:"hisky-barbershop",    category:"Beauty",  description:"Premium barbershop offering classic and modern trims.", address:"123 Main St, Downtown", phone:"+1 555 100 0001", verified:true,  rating:4.8, reviews:3 },
      { owner:maria._id, name:"City Dental Clinic",  slug:"city-dental-clinic",  category:"Health",  description:"Full dental care with certified dentists.",              address:"456 Oak Ave, Midtown",  phone:"+1 555 100 0002", verified:true,  rating:4.6, reviews:2 },
      { owner:maria._id, name:"Zen Yoga Studio",     slug:"zen-yoga-studio",     category:"Fitness", description:"Guided yoga sessions for all skill levels.",             address:"789 Park Blvd, Uptown", phone:"+1 555 100 0003", verified:false, rating:4.7, reviews:1 },
      { owner:admin._id, name:"Thiyang Platform",    slug:"thiyang-platform",    category:"General", description:"Official Thiyang platform services.",                    address:"Online",               phone:"+1 555 000 0000", verified:true,  rating:5.0, reviews:0 },
    ]);
    const [barbershop, dental, yoga, platform] = businesses;
    console.log(`🏢 Businesses: ${businesses.length}`);

    // ── Services ───────────────────────────────────────────────────────────
    const services = await Service.insertMany([
      { business:barbershop._id, title:"Classic Haircut",      category:"Beauty",  duration:"30 min", price:30,  icon:"✂️", description:"Precision cut tailored to your style." },
      { business:barbershop._id, title:"Beard Trim",           category:"Beauty",  duration:"20 min", price:20,  icon:"🪒", description:"Clean beard shaping and trim." },
      { business:barbershop._id, title:"Haircut + Beard",      category:"Beauty",  duration:"45 min", price:45,  icon:"💈", description:"Full grooming package." },
      { business:dental._id,     title:"Dental Checkup",       category:"Health",  duration:"45 min", price:60,  icon:"🦷", description:"Full exam, cleaning & X-rays." },
      { business:dental._id,     title:"Teeth Whitening",      category:"Health",  duration:"60 min", price:120, icon:"😁", description:"Professional whitening treatment." },
      { business:yoga._id,       title:"Yoga Class",           category:"Fitness", duration:"60 min", price:25,  icon:"🧘", description:"Guided session for all levels." },
      { business:yoga._id,       title:"Personal Training",    category:"Fitness", duration:"60 min", price:70,  icon:"🏋️", description:"One-on-one coaching session." },
      { business:platform._id,   title:"Doctor Consultation",  category:"Health",  duration:"30 min", price:50,  icon:"🩺", description:"Certified physicians, same-day visits." },
      { business:platform._id,   title:"House Cleaning",       category:"Home",    duration:"2 hrs",  price:80,  icon:"🧹", description:"Deep cleaning for your space." },
      { business:platform._id,   title:"Nail Studio",          category:"Beauty",  duration:"50 min", price:40,  icon:"💅", description:"Manicure, pedicure & nail art." },
    ]);
    console.log(`🛠  Services: ${services.length}`);

    // ── Bookings ───────────────────────────────────────────────────────────
    const bookings = await Booking.insertMany([
      { user:emma._id,  business:barbershop._id, service:services[0]._id, serviceTitle:"Classic Haircut",     businessName:"Hisky Barbershop",   date:"2026-04-20", time:"10:00 AM", duration:"30 min", price:30,  status:"confirmed"  },
      { user:emma._id,  business:platform._id,   service:services[9]._id, serviceTitle:"Nail Studio",         businessName:"Thiyang Platform",   date:"2026-04-22", time:"2:00 PM",  duration:"50 min", price:40,  status:"pending"    },
      { user:james._id, business:platform._id,   service:services[7]._id, serviceTitle:"Doctor Consultation", businessName:"Thiyang Platform",   date:"2026-04-18", time:"9:00 AM",  duration:"30 min", price:50,  status:"completed"  },
      { user:james._id, business:yoga._id,       service:services[6]._id, serviceTitle:"Personal Training",   businessName:"Zen Yoga Studio",    date:"2026-04-25", time:"7:00 AM",  duration:"60 min", price:70,  status:"confirmed"  },
      { user:sofia._id, business:dental._id,     service:services[3]._id, serviceTitle:"Dental Checkup",      businessName:"City Dental Clinic", date:"2026-04-15", time:"11:00 AM", duration:"45 min", price:60,  status:"completed"  },
      { user:alex._id,  business:yoga._id,       service:services[5]._id, serviceTitle:"Yoga Class",          businessName:"Zen Yoga Studio",    date:"2026-04-19", time:"6:00 AM",  duration:"60 min", price:25,  status:"cancelled"  },
    ]);
    console.log(`📅 Bookings: ${bookings.length}`);

    // ── Products ───────────────────────────────────────────────────────────
    const products = await Product.insertMany([
      { name:"Pro Dashboard License",  description:"Full-featured admin dashboard.", price:299,  category:"Templates", stock:999, icon:"🎨", status:"active",  createdBy:admin._id },
      { name:"Team Plan Upgrade",      description:"Shared access for teams.",       price:599,  category:"Plans",     stock:999, icon:"📋", status:"active",  createdBy:admin._id },
      { name:"Enterprise License",     description:"Priority support & branding.",   price:1499, category:"Licenses",  stock:999, icon:"🔑", status:"active",  createdBy:admin._id },
      { name:"Single License",         description:"Personal use license.",          price:79,   category:"Licenses",  stock:999, icon:"🔑", status:"active",  createdBy:admin._id },
      { name:"Starter Plan",           description:"Essential dashboard plan.",      price:49,   category:"Plans",     stock:999, icon:"📋", status:"active",  createdBy:admin._id },
      { name:"UI Component Pack",      description:"200+ pre-built components.",     price:149,  category:"Templates", stock:999, icon:"🎨", status:"active",  createdBy:admin._id },
      { name:"eCommerce Module",       description:"Product catalog add-on.",        price:199,  category:"Modules",   stock:999, icon:"🧩", status:"active",  createdBy:admin._id },
      { name:"Analytics Dashboard",    description:"Advanced chart components.",     price:249,  category:"Templates", stock:999, icon:"📊", status:"active",  createdBy:admin._id },
      { name:"CRM Module",             description:"Pipeline & contacts module.",    price:349,  category:"Modules",   stock:999, icon:"🧩", status:"draft",   createdBy:admin._id },
      { name:"Email Template Pack",    description:"Responsive email templates.",    price:99,   category:"Templates", stock:999, icon:"✉️", status:"active",  createdBy:admin._id },
    ]);
    console.log(`🛍  Products: ${products.length}`);

    // ── Orders ─────────────────────────────────────────────────────────────
    const orders = await Order.insertMany([
      { user:emma._id,  items:[{ product:products[0]._id, name:products[0].name, price:299, qty:1 }], total:299,  status:"delivered", paymentMethod:"card"          },
      { user:james._id, items:[{ product:products[1]._id, name:products[1].name, price:599, qty:1 }], total:599,  status:"delivered", paymentMethod:"card"          },
      { user:sofia._id, items:[{ product:products[2]._id, name:products[2].name, price:1499,qty:1 }], total:1499, status:"processing",paymentMethod:"bank_transfer"  },
      { user:alex._id,  items:[{ product:products[3]._id, name:products[3].name, price:79,  qty:1 }], total:79,   status:"cancelled", paymentMethod:"card"          },
    ]);
    console.log(`📦 Orders: ${orders.length}`);

    // ── Payments ───────────────────────────────────────────────────────────
    const payments = await Payment.insertMany([
      { user:emma._id,  booking:bookings[0]._id, type:"booking", description:"Classic Haircut — Hisky Barbershop", amount:30,   method:"card",         cardLast4:"4242", status:"paid"     },
      { user:james._id, booking:bookings[2]._id, type:"booking", description:"Doctor Consultation",                amount:50,   method:"bank_transfer", cardLast4:null,   status:"paid"     },
      { user:sofia._id, booking:bookings[4]._id, type:"booking", description:"Dental Checkup",                     amount:60,   method:"card",         cardLast4:"1234", status:"paid"     },
      { user:alex._id,  booking:bookings[5]._id, type:"booking", description:"Yoga Class",                         amount:25,   method:"mobile",        cardLast4:null,   status:"refunded" },
      { user:emma._id,  order:orders[0]._id,     type:"product", description:"Pro Dashboard License",              amount:299,  method:"card",         cardLast4:"4242", status:"paid"     },
      { user:james._id, order:orders[1]._id,     type:"product", description:"Team Plan Upgrade",                  amount:599,  method:"card",         cardLast4:"5678", status:"paid"     },
      { user:sofia._id, order:orders[2]._id,     type:"product", description:"Enterprise License",                 amount:1499, method:"bank_transfer", cardLast4:null,   status:"paid"     },
    ]);
    console.log(`💳 Payments: ${payments.length}`);

    // ── Reviews ────────────────────────────────────────────────────────────
    // Use insertMany to skip the unique index hook
    await mongoose.connection.collection("reviews").insertMany([
      { user:emma._id,  business:barbershop._id, booking:bookings[0]._id, rating:5, comment:"Amazing haircut! Best fade in town.", createdAt:new Date(), updatedAt:new Date() },
      { user:james._id, business:barbershop._id, booking:null,            rating:4, comment:"Great service, very professional.",   createdAt:new Date(), updatedAt:new Date() },
      { user:sofia._id, business:barbershop._id, booking:null,            rating:5, comment:"Love this place! Clean and skilled.", createdAt:new Date(), updatedAt:new Date() },
      { user:sofia._id, business:dental._id,     booking:bookings[4]._id, rating:5, comment:"Thorough and painless checkup.",      createdAt:new Date(), updatedAt:new Date() },
      { user:alex._id,  business:yoga._id,       booking:null,            rating:4, comment:"Great instructor, relaxing class.",   createdAt:new Date(), updatedAt:new Date() },
    ]);
    console.log(`⭐ Reviews: 5`);

    // ── Notifications ──────────────────────────────────────────────────────
    await Notification.insertMany([
      { user:null,       title:"Welcome to Thiyang!",    body:"Discover and book local services near you.",                   type:"info"    },
      { user:emma._id,   title:"Booking Confirmed",      body:"Your Classic Haircut is confirmed for Apr 20 at 10AM.",        type:"booking" },
      { user:emma._id,   title:"Payment Received",       body:"Payment of $30 for Classic Haircut was successful.",           type:"payment" },
      { user:james._id,  title:"Booking Confirmed",      body:"Your Doctor Consultation is confirmed for Apr 18 at 9AM.",     type:"booking" },
      { user:james._id,  title:"Appointment Reminder",   body:"You have a Personal Training session tomorrow at 7AM.",        type:"info"    },
      { user:sofia._id,  title:"Booking Completed",      body:"Your Dental Checkup is complete. Leave a review!",             type:"success" },
      { user:alex._id,   title:"Refund Processed",       body:"Your refund of $25 for Yoga Class has been processed.",        type:"payment" },
    ]);
    console.log(`🔔 Notifications: 7`);

    // ── Summary ────────────────────────────────────────────────────────────
    console.log("\n═══════════════════════════════════════════");
    console.log("  ✅  DATABASE SEEDED SUCCESSFULLY");
    console.log("═══════════════════════════════════════════");
    console.log("  Collections:");
    console.log(`    users          ${users.length}`);
    console.log(`    businesses     ${businesses.length}`);
    console.log(`    services       ${services.length}`);
    console.log(`    bookings       ${bookings.length}`);
    console.log(`    products       ${products.length}`);
    console.log(`    orders         ${orders.length}`);
    console.log(`    payments       ${payments.length}`);
    console.log(`    reviews        5`);
    console.log(`    notifications  7`);
    console.log("───────────────────────────────────────────");
    console.log("  Admin login:");
    console.log("    Email:    admin@thiyang.com");
    console.log("    Password: password123");
    console.log("  User login:");
    console.log("    Email:    emma@example.com");
    console.log("    Password: password123");
    console.log("═══════════════════════════════════════════\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  }
};

seed();
