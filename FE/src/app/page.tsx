"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import "./home.css";
import accountService, { IAccount } from "@/services/account/account.service";

const navItems = [
  { label: "Trang chủ", href: "#top" },
  { label: "Account", href: "#account" },
  { label: "Nạp tiền", href: "#nap-tien" },
  { label: "Thông tin chú shop", href: "#about" },
  { label: "Hướng dẫn", href: "#huong-dan" },
];

const heroCards = [
  {
    title: "Account Valorant",
    badge: "Top bán chạy",
    image: "/img/others/img-18.png",
    href: "#account-valorant",
    accent: "var(--landing-red)",
  },
  {
    title: "Account Delta Force",
    badge: "New drop",
    image: "/img/others/img-20.png",
    href: "#account-delta",
    accent: "var(--landing-green)",
  },
  {
    title: "Account Valorant Mobile",
    badge: "Sắp ra mắt",
    image: "/img/others/img-19.png",
    href: "#account-valorant",
    accent: "#e33d6f",
  },
];

const faqs = [
  {
    title: "Hướng dẫn đăng ký tạo tài khoản trên website ACCVALORANT",
    image: "/img/others/img-15.jpg",
    date: "13/12/2024",
  },
  {
    title: "Hướng dẫn đăng ký tài khoản thanh toán",
    image: "/img/others/img-16.jpg",
    date: "13/12/2024",
  },
  {
    title: "Câu hỏi thường gặp về giao dịch",
    image: "/img/others/img-18.png",
    date: "13/12/2024",
  },
  {
    title: "Bảo mật & an toàn tài khoản",
    image: "/img/others/img-11.png",
    date: "13/12/2024",
  },
];

const generateMockAccounts = (start: number): IAccount[] =>
  Array.from({ length: 8 }).map((_, idx) => ({
    id: `${start + idx}`,
    accountCode: `#${2332 + idx}`,
    price: 4040000,
    createdBy: "Kunyy",
    rank: idx % 2 === 0 ? "Bạc II" : "Vàng III",
    rating: 5,
    imageUrl: idx % 3 === 0 ? "/img/others/img-12.jpg" : "/img/others/img-14.jpg",
    gameType: start < 10 ? "Valorant" : "DeltaForce",
    sellerId: "seller-id",
    status: "Available",
    isPublished: true,
    soldCount: 0,
  }));

const LandingCard = ({
  card,
}: {
  card: IAccount;
}) => (
  <div className="landing-card">
    <Image 
      src={card.imageUrl || "/img/others/img-12.jpg"} 
      alt={card.accountCode} 
      width={320} 
      height={180} 
    />
    <div className="landing-card-body">
      <div className="landing-card-meta">
        <span>{card.accountCode}</span>
        <span>•</span>
        <span>{card.rank}</span>
      </div>
      <div className="landing-card-price">
        <span>{card.price.toLocaleString("vi-VN")} VNĐ</span>
        <span>{card.createdBy || "Khiem Tran"}</span>
      </div>
      <div className="landing-card-rating">⭐⭐⭐⭐⭐ ({card.rating})</div>
      <button className="landing-card-cta">Mua ngay</button>
    </div>
  </div>
);

export default function HomePage() {
  const [valorantAccounts, setValorantAccounts] = useState<IAccount[]>([]);
  const [deltaForceAccounts, setDeltaForceAccounts] = useState<IAccount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoading(true);
        // Fetch Valorant accounts
        const valorantRes = await accountService.getByGameType("Valorant");
        if (valorantRes.status) {
          setValorantAccounts(valorantRes.data.slice(0, 8));
        }

        // Fetch Delta Force accounts
        const deltaRes = await accountService.getByGameType("DeltaForce");
        if (deltaRes.status) {
          setDeltaForceAccounts(deltaRes.data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const categories = [
    {
      id: "account-valorant",
      title: "Account Valorant",
      accent: "var(--landing-red)",
      cards: valorantAccounts.length > 0 ? valorantAccounts : generateMockAccounts(1),
    },
    {
      id: "account-delta",
      title: "Account Delta Force",
      accent: "var(--landing-green)",
      cards: deltaForceAccounts.length > 0 ? deltaForceAccounts : generateMockAccounts(20),
    },
  ];

  return (
    <main id="top" className="landing">
      <div className="landing-hotline" id="nap-tien">
        <div className="dot" /> 0765 133 000
      </div>

      <header className="landing-header">
        <div className="landing-topbar">
          <div>Shop Acc Khiem Tran - Uy tín, giao dịch tự động 24/7</div>
          <div className="landing-wallet">
            Ví Shop Acc <span>10.000.000 VNĐ</span>
          </div>
        </div>
        <nav className="landing-nav">
          <div className="landing-logo">
            <Image src="/img/logo.png" alt="Shop Acc" width={120} height={46} />
          </div>
          <div className="landing-menu">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </div>
          <button className="landing-action-btn">Tạo tài khoản</button>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-main">
          <Image
            src="/img/banner.png"
            alt="Khiem Tran Valorant"
            fill
            style={{ objectFit: "cover" }}
            sizes="100vw"
            priority
          />
          <div className="overlay" />
          <div className="text">
            <div className="title">Cộng đồng ACC Valorant</div>
            <div className="subtitle">Chọn acc phù hợp - Chiến rank ngay</div>
            <div className="cta-row">
              <Link href="#account-valorant">
                <button className="landing-action-btn">Xem ACC Valorant</button>
              </Link>
              <Link href="#account-delta">
                <button className="landing-action-btn" style={{ background: "linear-gradient(135deg, #1faa63 0%, #26f0a4 100%)" }}>
                  ACC Delta Force
                </button>
              </Link>
            </div>
          </div>
        </div>
        <div className="landing-hero-side">
          {heroCards.map((item) => (
            <Link key={item.title} href={item.href} className="landing-side-card">
              <div className="content">
                <div className="badge" style={{ borderColor: item.accent, color: item.accent }}>
                  {item.badge}
                </div>
                <h4>{item.title}</h4>
                <span style={{ color: item.accent, fontWeight: 700 }}>Xem ngay →</span>
              </div>
              <div style={{ position: "relative" }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  style={{ objectFit: "cover" }}
                  sizes="320px"
                />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.id} id={cat.id} className="landing-section">
          <div className="landing-section-header">
            <Image src="/img/background.png" alt="flag" width={54} height={54} />
            <div className="landing-section-title" style={{ color: cat.accent }}>
              {cat.title}
            </div>
            <Link href="#" className="landing-section-cta">
              Xem tất cả →
            </Link>
          </div>
          <div className="landing-grid">
            {cat.cards.map((card: IAccount) => (
              <LandingCard key={card.id} card={card} />
            ))}
          </div>
        </section>
      ))}

      <section id="huong-dan" className="landing-faqs">
        <div className="landing-faq-title">Câu hỏi thường gặp</div>
        <div className="landing-faq-grid">
          {faqs.map((faq) => (
            <div key={faq.title} className="landing-faq-card">
              <Image src={faq.image} alt={faq.title} width={320} height={180} />
              <div className="landing-faq-body">
                <div style={{ fontWeight: 700 }}>{faq.title}</div>
                <div style={{ color: "var(--landing-muted)", fontSize: 12 }}>{faq.date}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer id="about" className="landing-footer">
        <div className="landing-footer-grid">
          <div>
            <h4>Về chúng tôi</h4>
            <Image src="/img/logoct.png" alt="Khiem Tran" width={140} height={52} />
            <p>Chúng tôi đặt sự uy tín làm trọng tâm. Mỗi tài khoản đều được kiểm tra kỹ lưỡng và mô tả minh bạch.</p>
          </div>
          <div>
            <h4>Thông tin liên hệ</h4>
            <div>FB & Zalo: 0765.133.000</div>
            <div>Email: accvalorkunyy@admin.com</div>
            <div>Website: www.khiemtranvalorant.com</div>
            <div>Địa chỉ: 61 Tôn Thất Nghiệp, Ba Đình, Hà Nội</div>
          </div>
          <div>
            <h4>Theo dõi chúng tôi</h4>
            <div style={{ display: "flex", gap: 10 }}>
              <Link href="https://facebook.com" target="_blank">Facebook</Link>
              <Link href="https://youtube.com" target="_blank">YouTube</Link>
              <Link href="https://tiktok.com" target="_blank">TikTok</Link>
            </div>
          </div>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "var(--landing-muted)", textAlign: "center" }}>
          © Copyright 2025 KUNYY DESIGN. All Rights Reserved.
        </div>
      </footer>
    </main>
  );
}
