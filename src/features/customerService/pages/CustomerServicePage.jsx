import { Link } from "react-router-dom";
import PATHS from "@/routes/paths";

// ── Social / contact card data ─────────────────────────────────────────────
const CONTACT_CARDS = [
  {
    id: "email",
    label: "Email",
    value: "016adityasingh@gmail.com",
    href: "mailto:016adityasingh@gmail.com",
    icon: (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
    external: false,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/aditya016",
    href: "https://www.linkedin.com/in/aditya016",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
    external: true,
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/016Aditya",
    href: "https://github.com/016Aditya",
    icon: (
      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
    external: true,
  },
];

const FAQ = [
  { q: "How do I track my order?", a: "Go to Account → My Orders to view real-time status of all your orders." },
  { q: "What is the return policy?", a: "We offer a 30-day hassle-free return policy on all products. Contact us via email to initiate a return." },
  { q: "How long does delivery take?", a: "Standard delivery takes 3–7 business days. Express delivery (1–2 days) is available at checkout." },
  { q: "Are my payments secure?", a: "Yes. All payments are processed over HTTPS with industry-standard encryption. We never store your card details." },
];

function CustomerServicePage() {
  return (
    <div className="min-h-screen bg-[#f3f3f3]">

      {/* ── Hero Banner ─────────────────────────────────────────────────────── */}
      <div className="bg-[#131921] py-12 text-center">
        {/* Logo */}
        <div className="mb-3 inline-flex flex-col items-center">
          <span className="text-4xl font-extrabold text-white tracking-tight leading-none">
            shop<span className="text-[#ff9900]">App</span>
          </span>
          <span className="text-sm text-slate-300 leading-none">.in</span>
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">Customer Service</h1>
        <p className="mt-2 text-slate-400 text-sm max-w-md mx-auto">
          We're here to help. Reach out via any channel below and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className="container-app py-10 space-y-10">

        {/* ── About ShopApp ───────────────────────────────────────────────── */}
        <section className="rounded-lg bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#131921] mb-3">About ShopApp.in</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>ShopApp.in</strong> is a full-stack e-commerce platform built with{" "}
            <span className="font-medium text-[#ff9900]">React.js</span> on the frontend and{" "}
            <span className="font-medium text-[#ff9900]">Spring Boot + MongoDB</span> on the backend.
            It supports user authentication (including Google OAuth2), product browsing by category &amp;
            subcategory, cart management, order placement, and admin-level product management.
          </p>
          <p className="mt-3 text-sm text-slate-600 leading-relaxed">
            This project was designed and developed by <strong>Aditya Singh</strong> as a production-grade
            learning project covering the complete software development lifecycle — from REST API design
            to React state management and responsive UI.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["React.js","Spring Boot","MongoDB","JWT Auth","Google OAuth2","Tailwind CSS","REST API"].map(tag => (
              <span key={tag} className="rounded-full bg-[#fff3d6] text-[#a66000] text-xs font-semibold px-3 py-1">{tag}</span>
            ))}
          </div>
        </section>

        {/* ── Contact Us ──────────────────────────────────────────────────── */}
        <section className="rounded-lg bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#131921] mb-1">Contact Us</h2>
          <p className="text-sm text-slate-500 mb-6">Reach out on any of the platforms below.</p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CONTACT_CARDS.map((card) => (
              <a
                key={card.id}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 rounded-lg border border-slate-200 p-4 hover:border-[#ff9900] hover:shadow-md transition group"
              >
                <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-[#131921] text-[#ff9900] group-hover:bg-[#ff9900] group-hover:text-white transition">
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{card.label}</p>
                  <p className="text-sm font-semibold text-slate-700 truncate group-hover:text-[#ff9900] transition">
                    {card.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ── Source Code ─────────────────────────────────────────────────── */}
        <section className="rounded-lg bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#131921] mb-4">Source Code</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <a
              href="https://github.com/016Aditya/Ecommerce-Frontend-Reactjs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-[#ff9900] hover:shadow-md transition group"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#131921] text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Frontend</p>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-[#ff9900] transition">Ecommerce-Frontend-Reactjs</p>
              </div>
            </a>
            <a
              href="https://github.com/016Aditya/Spring-Data-MongoDb-ecommerce"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 hover:border-[#ff9900] hover:shadow-md transition group"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#131921] text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23a11.52 11.52 0 0 1 3-.405c1.02.005 2.045.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
              </span>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Backend</p>
                <p className="text-sm font-semibold text-slate-700 group-hover:text-[#ff9900] transition">Spring-Data-MongoDb-ecommerce</p>
              </div>
            </a>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="rounded-lg bg-white shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-[#131921] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <details key={i} className="group rounded-lg border border-slate-200 p-4 cursor-pointer">
                <summary className="flex items-center justify-between text-sm font-semibold text-slate-800 list-none">
                  {item.q}
                  <svg className="h-4 w-4 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                  </svg>
                </summary>
                <p className="mt-3 text-sm text-slate-500 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* ── Back home ───────────────────────────────────────────────────── */}
        <div className="text-center pb-4">
          <Link
            to={PATHS.HOME}
            className="inline-flex items-center gap-2 rounded-full bg-[#ff9900] px-6 py-2.5 text-sm font-bold text-[#131921] hover:bg-[#e88a00] transition shadow"
          >
            ← Back to Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}

export default CustomerServicePage;
