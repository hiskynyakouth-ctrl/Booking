import { useLanguage } from "../context/LanguageContext";

export default function About() {
  const { t } = useLanguage();
  
  return (
    <div style={{ minHeight:"100vh", background:"#0a0a0a", color:"#fff", fontFamily:"Inter,system-ui,sans-serif", padding:"2rem 1rem" }}>
      <div style={{ maxWidth:800, margin:"0 auto" }}>
        <h1 style={{ fontSize:"2rem", fontWeight:700, marginBottom:"1rem" }}>
          {t("nav_explore")} {t("app_name")}
        </h1>
        <p style={{ fontSize:"1rem", lineHeight:1.6, color:"#ccc" }}>
          Thiyang is a comprehensive booking and eCommerce platform designed for businesses and customers in Ethiopia.
          We provide seamless booking services, online shopping, payment processing with local banks, and advanced admin management tools.
        </p>
        <p style={{ fontSize:"1rem", lineHeight:1.6, color:"#ccc", marginTop:"1rem" }}>
          Our mission is to connect businesses with customers through innovative technology, ensuring secure transactions and excellent user experiences.
        </p>
      </div>
    </div>
  );
}
