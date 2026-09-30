import React, { useEffect, useState } from "react";
import { MenuItem } from "../data/menu";
import { CustomerDiscount, CustomerOrder, OrderStatus } from "../adminTypes";
import { formatCountdown, getStoreHoursState } from "../operatingHours";
import { AdminLoginModal } from "./AdminLoginModal";
import { AdminDashboard } from "./AdminDashboard";
import { AdminMenuManager } from "./AdminMenuManager";
import { AdminOrderManager } from "./AdminOrderManager";
import { AdminReviewsManager } from "./AdminReviewsManager";
import { AdminDiscountManager } from "./AdminDiscountManager";
import { AdminBlogManager, BlogPost } from "./AdminBlogManager";
import { AdminPasswordModal } from "./AdminPasswordModal";
import { apiToken } from "../api";
import {
  ArrowLeft,
  BarChart3,
  ChefHat,
  Clock3,
  LogOut,
  Menu,
  PackageCheck,
  Settings2,
  ShieldCheck,
  X,
} from "lucide-react";

interface Props {
  items: MenuItem[];
  orders: CustomerOrder[];
  discounts: CustomerDiscount[];
  blogPosts: BlogPost[];
  setItems: (items: MenuItem[]) => void;
  setOrders: (orders: CustomerOrder[]) => void;
  setDiscounts: (discounts: CustomerDiscount[]) => void;
  setBlogPosts: (posts: BlogPost[]) => void;
  override: boolean;
  setOverride: React.Dispatch<React.SetStateAction<boolean>>;
  onExit: () => void;
}
export const AdminLayout: React.FC<Props> = ({
  items,
  orders,
  discounts,
  blogPosts,
  setItems,
  setOrders,
  setDiscounts,
  setBlogPosts,
  override,
  setOverride,
  onExit,
}) => {
  const [authenticated, setAuthenticated] = useState(() => Boolean(apiToken()));
  const [section, setSection] = useState<
    "dashboard" | "orders" | "menu" | "discounts" | "reviews" | "blog"
  >("dashboard");
  const [mobileNav, setMobileNav] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  const hours = getStoreHoursState(new Date(), override);
  useEffect(() => {
    if (!authenticated) sessionStorage.removeItem("bussin-admin-token");
  }, [authenticated]);
  if (!authenticated)
    return (
      <AdminLoginModal
        onClose={onExit}
        onSuccess={() => setAuthenticated(true)}
      />
    );
  const updateOrder = (id: string, status: OrderStatus) =>
    setOrders(orders.map((order) => (order.id === id ? { ...order, status } : order)));
  const rejectOrder = (id: string, reason: string) =>
    setOrders(orders.map((order) =>
        order.id === id
          ? { ...order, status: "Rejected", rejectionReason: reason }
          : order,
      ));
  const navigation = [
    { id: "dashboard" as const, label: "Overview", icon: BarChart3 },
    { id: "orders" as const, label: "Orders", icon: PackageCheck },
    { id: "menu" as const, label: "Menu & inventory", icon: ChefHat },
    { id: "discounts" as const, label: "Discounts", icon: PercentIcon },
    { id: "reviews" as const, label: "Reviews", icon: ShieldIcon },
    { id: "blog" as const, label: "Blog", icon: BookIcon },
  ];
  return (
    <div style={shell}>
      {mobileNav && (
        <button
          className="admin-nav-scrim"
          onClick={() => setMobileNav(false)}
          aria-label="Close navigation"
        />
      )}
      <aside
        className={
          mobileNav ? "admin-sidebar admin-sidebar-open" : "admin-sidebar"
        }
      >
        <div style={brand}>
          <img src="/images/bussin-bean%20logo.jpeg" alt="Bussin Bean logo" style={brandMark} />
          <div>
            <strong>BUSSIN BEAN</strong>
            <span>Operations portal</span>
          </div>
          <button
            className="admin-sidebar-close"
            onClick={() => setMobileNav(false)}
            style={mobileClose}
          >
            <X size={18} />
          </button>
        </div>
        <div style={storeStatus}>
          <span
            style={{
              ...statusDot,
              background: hours.isOpen ? "#68A871" : "#C35D45",
            }}
          />{" "}
          <strong>{hours.isOpen ? "OPEN" : "CLOSED"}</strong>
          <span style={{ marginLeft: "auto", color: "#A99886", fontSize: 11 }}>
            {hours.isOpen ? "Until 1:00 AM" : "Opens 11:00 AM"}
          </span>
        </div>
        <nav style={{ marginTop: 24 }}>
          {navigation.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => {
                setSection(id);
                setMobileNav(false);
              }}
              style={{ ...navButton, ...(section === id ? activeNav : {}) }}
            >
              <Icon size={17} />
              {label}
              {id === "orders" &&
                orders.filter((order) => order.status === "Pending").length >
                  0 && (
                  <b style={counter}>
                    {
                      orders.filter((order) => order.status === "Pending")
                        .length
                    }
                  </b>
                )}
            </button>
          ))}
        </nav>
        <div style={sidebarBottom}>
          <button onClick={() => setOverride((value) => !value)} style={toggle}>
            <Settings2 size={15} />{" "}
            {override ? "Disable override" : "Emergency override"}{" "}
            <span
              style={{
                marginLeft: "auto",
                width: 28,
                height: 16,
                borderRadius: 99,
                background: override ? "#B67538" : "#D6C6B4",
                padding: 2,
              }}
            >
              <span
                style={{
                  display: "block",
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  background: "white",
                  transform: override ? "translateX(12px)" : "none",
                  transition: ".2s",
                }}
              />
            </span>
          </button>
          <button
            onClick={() => setPasswordModal(true)}
            style={navButton}
          >
            <Settings2 size={16} />
            Change password
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem("bussin-admin-token");
              setAuthenticated(false);
            }}
            style={navButton}
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
      <main style={main}>
        <header style={topbar}>
          <button
            onClick={() => setMobileNav(true)}
            className="admin-mobile-menu"
            style={mobileMenu}
          >
            <Menu size={19} />
          </button>
          <div>
            <p style={eyebrow}>FRIDAY · STORE CONTROL</p>
            <h1 style={pageTitle}>
              {section === "dashboard"
                ? "Good morning, operator."
                : section === "orders"
                  ? "Order command"
                  : section === "menu"
                    ? "Menu & inventory"
                    : section === "discounts"
                      ? "Discounts"
                      : section === "blog"
                        ? "Blog & stories"
                        : "Reviews moderation"}
            </h1>
          </div>
          <button onClick={onExit} style={storefront}>
            <ArrowLeft size={15} /> STOREFRONT
          </button>
        </header>
        <div style={notice}>
          <Clock3 size={15} />
          <span>
            <strong>{hours.label}</strong>
            {hours.isOpen
              ? ` · closes in ${formatCountdown(hours.minutesUntilChange)}`
              : ` · next service in ${formatCountdown(hours.minutesUntilChange)}`}
          </span>
          <span style={{ marginLeft: "auto", fontSize: 11 }}>
            11:00 AM – 1:00 AM
          </span>
        </div>
        <div style={content}>
          {section === "dashboard" && (
            <AdminDashboard orders={orders} items={items} />
          )}
          {section === "orders" && (
            <AdminOrderManager
              orders={orders}
              onStatus={updateOrder}
              onReject={rejectOrder}
            />
          )}
          {section === "menu" && (
            <AdminMenuManager items={items} onChange={setItems} />
          )}
          {section === "discounts" && (
            <AdminDiscountManager
              discounts={discounts}
              onChange={setDiscounts}
            />
          )}
          {section === "blog" && (
            <AdminBlogManager posts={blogPosts} onChange={setBlogPosts} />
          )}
          {section === "reviews" && <AdminReviewsManager />}
        </div>
      </main>
      {passwordModal && <AdminPasswordModal onClose={() => setPasswordModal(false)} />}
    </div>
  );
};
const ShieldIcon = () => <ShieldCheck size={17} />;
const BookIcon = () => <span style={{ fontSize: 15, fontWeight: 800 }}>B</span>;
const PercentIcon = () => (
  <span style={{ fontSize: 15, fontWeight: 800 }}>%</span>
);
const shell: React.CSSProperties = {
  minHeight: "100vh",
  background: "#F3EADF",
  color: "#302016",
  display: "flex",
};
const brand: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 6px 28px",
};
const brandMark: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: "50%",
  objectFit: "cover",
  clipPath: "circle(50%)",
  flexShrink: 0,
};
const mobileClose: React.CSSProperties = {
  marginLeft: "auto",
  background: "transparent",
  border: 0,
  cursor: "pointer",
  color: "#F9F0E4",
};
const storeStatus: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "rgba(255,255,255,.07)",
  borderRadius: 10,
  padding: "11px 12px",
  color: "#F9F0E4",
  fontSize: 11,
};
const statusDot: React.CSSProperties = {
  width: 8,
  height: 8,
  borderRadius: "50%",
  marginRight: 7,
};
const navButton: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 11,
  background: "transparent",
  border: 0,
  borderRadius: 10,
  color: "#BDA998",
  padding: "11px 12px",
  fontFamily: "inherit",
  fontSize: 12,
  fontWeight: 700,
  textAlign: "left",
  cursor: "pointer",
  marginBottom: 4,
};
const activeNav: React.CSSProperties = {
  color: "#FFF9F2",
  background: "#4A3020",
};
const counter: React.CSSProperties = {
  marginLeft: "auto",
  display: "grid",
  placeItems: "center",
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: "#D8A15D",
  color: "#302016",
  fontSize: 10,
};
const sidebarBottom: React.CSSProperties = { marginTop: "auto" };
const toggle: React.CSSProperties = {
  width: "100%",
  border: 0,
  background: "transparent",
  color: "#BDA998",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "12px 6px",
  fontSize: 11,
  textAlign: "left",
  cursor: "pointer",
};
const main: React.CSSProperties = { flex: 1, minWidth: 0 };
const topbar: React.CSSProperties = {
  padding: "38px clamp(20px, 4vw, 54px) 22px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 20,
};
const eyebrow: React.CSSProperties = {
  color: "#B67538",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".14em",
  margin: 0,
};
const pageTitle: React.CSSProperties = {
  fontFamily: "'Playfair Display',serif",
  fontSize: "clamp(25px, 3vw, 38px)",
  margin: "8px 0 0",
};
const storefront: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  border: "1px solid #CBB69E",
  background: "transparent",
  borderRadius: 10,
  padding: "10px 13px",
  color: "#5E422E",
  fontSize: 10,
  fontWeight: 800,
  cursor: "pointer",
};
const notice: React.CSSProperties = {
  margin: "0 clamp(20px, 4vw, 54px) 24px",
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "12px 15px",
  background: "#FFF9F2",
  border: "1px solid #E4D7C7",
  borderRadius: 10,
  color: "#765A43",
  fontSize: 12,
};
const content: React.CSSProperties = {
  padding: "0 clamp(20px, 4vw, 54px) 50px",
  maxWidth: 1400,
};
const mobileMenu: React.CSSProperties = {
  border: 0,
  background: "#302016",
  color: "white",
  borderRadius: 9,
  width: 36,
  height: 36,
  alignItems: "center",
  justifyContent: "center",
};
