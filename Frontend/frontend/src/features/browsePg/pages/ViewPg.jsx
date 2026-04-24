import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllPgById } from "../browsePgService";
import { createBooking } from "../browsePgService";

// ── icons ─────────────────────────────────────────────────────────────────────
const BackIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);
const LocationIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);
const UserIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
  </svg>
);
const WifiIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);
const FoodIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
  </svg>
);
const AcIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="1" y="3" width="22" height="13" rx="2" /><path d="M5 21l4-6M12 21v-6M19 21l-4-6" />
  </svg>
);
const ParkingIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
  </svg>
);
const SecurityIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const PhoneIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.31 2 2 0 0 1 3.6 1.1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6 6l.95-1.04a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.9 16l.02.92z" />
  </svg>
);
const MessageIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);
const BookmarkIcon = ({ filled }) => (
  <svg width="18" height="18" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);

const LaundryIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="3" />
    <circle cx="12" cy="13" r="4" />
    <circle cx="7" cy="6" r="1" fill="currentColor" />
    <circle cx="10" cy="6" r="1" fill="currentColor" />
  </svg>
);
const TvIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <path d="M8 21h8M12 17v4" />
  </svg>
);
const GeyserIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2a5 5 0 0 1 5 5c0 3-2 5-2 8H9c0-3-2-5-2-8a5 5 0 0 1 5-5z" />
    <path d="M9 18h6v2a1 1 0 0 1-1 1h-4a1 1 0 0 1-1-1v-2z" />
    <path d="M12 6v4M10 8l2-2 2 2" />
  </svg>
);
const FridgeIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <path d="M5 10h14" />
    <path d="M9 6v2M9 14v3" />
  </svg>
);
const GymIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M6 4v16M18 4v16M2 9h4M18 9h4M2 15h4M18 15h4M6 12h12" />
  </svg>
);
const PowerBackupIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const HousekeepingIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 21h18" />
    <path d="M9 8h1" />
    <path d="M3 21V10l9-7 9 7v11" />
    <path d="M14 21v-5a2 2 0 0 0-4 0v5" />
  </svg>
);
const CctvIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M2 8l4 4-4 4" />
    <rect x="6" y="9" width="10" height="6" rx="1" />
    <path d="M16 12h3" />
    <circle cx="20" cy="12" r="1" fill="currentColor" />
    <path d="M12 15v3M10 18h4" />
  </svg>
);
const LiftIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="3" y="2" width="18" height="20" rx="2" />
    <path d="M12 2v20M8 8l-2 2 2 2M16 8l2 2-2 2" />
  </svg>
);
const BathIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4z" />
    <path d="M4 12V6a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2v1" />
    <path d="M6 20v2M18 20v2" />
  </svg>
);
const StudyIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 17h18" />
    <path d="M3 17V9a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v8" />
    <path d="M7 17v3M17 17v3" />
    <path d="M10 13h4" />
  </svg>
);
const WardrobeIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M12 2v20" />
    <circle cx="9" cy="12" r="1" fill="currentColor" />
    <circle cx="15" cy="12" r="1" fill="currentColor" />
  </svg>
);
const RoWaterIcon = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14z" />
    <path d="M8 17a4 4 0 0 0 8 0" />
  </svg>
);

// ── amenity definitions ───────────────────────────────────────────────────────
const AMENITY_MAP = {
  wifi:        { icon: <WifiIcon />,        label: "High-speed WiFi" },
  food:        { icon: <FoodIcon />,        label: "Meals included" },
  ac:          { icon: <AcIcon />,          label: "Air conditioning" },
  parking:     { icon: <ParkingIcon />,     label: "Parking" },
  security:    { icon: <SecurityIcon />,    label: "24/7 Security" },
  laundry:     { icon: <LaundryIcon />,     label: "Laundry / Washing machine" },
  tv:          { icon: <TvIcon />,          label: "TV in room" },
  geyser:      { icon: <GeyserIcon />,      label: "Geyser / Hot water" },
  fridge:      { icon: <FridgeIcon />,      label: "Refrigerator" },
  gym:         { icon: <GymIcon />,         label: "Gym access" },
  powerbackup: { icon: <PowerBackupIcon />, label: "Power backup" },
  housekeeping:{ icon: <HousekeepingIcon />,label: "Housekeeping" },
  cctv:        { icon: <CctvIcon />,        label: "CCTV surveillance" },
  lift:        { icon: <LiftIcon />,        label: "Lift / Elevator" },
  attached_bath:{ icon: <BathIcon />,       label: "Attached bathroom" },
  study_table: { icon: <StudyIcon />,       label: "Study table & chair" },
  wardrobe:    { icon: <WardrobeIcon />,    label: "Wardrobe / Storage" },
  ro_water:    { icon: <RoWaterIcon />,     label: "RO / Purified water" },
};

const GENDER_CONFIG = {
  MALE:   { label: "Male only",   bg: "#DBEAFE", color: "#1d4ed8" },
  FEMALE: { label: "Female only", bg: "#FCE7F3", color: "#9d174d" },
  ANY:    { label: "Any gender",  bg: "#EEF2FF", color: "#3730a3" },
};

// ── skeleton ──────────────────────────────────────────────────────────────────
function ViewPgSkeleton() {
  return (
    <div style={styles.page}>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      <div style={{ ...styles.imgHero, background: "#f3f4f6", animation: "pulse 1.5s ease-in-out infinite" }} />
      <div style={styles.body}>
        <div style={styles.mainCol}>
          {[70, 40, 100, 100, 60].map((w, i) => (
            <div key={i} style={{
              height: 14, width: `${w}%`, borderRadius: 6,
              background: "#f3f4f6", marginBottom: 14,
              animation: "pulse 1.5s ease-in-out infinite",
              animationDelay: `${i * 0.08}s`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────
function ViewPg() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pg, setPg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingNote, setBookingNote] = useState("");
  const [booked, setBooked] = useState(false);

  useEffect(() => {
    const fetchPg = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getAllPgById(id);
        setPg(res.data);
      } catch {
        setError("Could not load this listing. It may have been removed.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPg();
  }, [id]);

const handleBookingSubmit = async () => {
  try {
    await createBooking({
      pgId: pg.id,
      visitDate: bookingDate,
      note: bookingNote
    });

    setBooked(true);
    setShowBookingModal(false);
  } catch (err) {
    console.error(err);
    alert("Booking failed");
  }
};
  if (loading) return <ViewPgSkeleton />;

  if (error) {
    return (
      <div style={{ ...styles.page, textAlign: "center", paddingTop: 80 }}>
        <p style={{ color: "#991b1b", fontSize: 15, marginBottom: 16 }}>{error}</p>
        <button onClick={() => navigate(-1)} style={styles.btnOutline}>Go back</button>
      </div>
    );
  }

  if (!pg) return null;

  const gender = GENDER_CONFIG[pg.genderPreference] || GENDER_CONFIG.ANY;

  // infer amenities from description if not an array on the object
  const AMENITY_KEYWORDS = {
    wifi:         ["wifi", "wi-fi", "internet"],
    food:         ["food", "meal", "tiffin", "breakfast", "lunch", "dinner"],
    ac:           ["ac", "air condition", "air-condition"],
    parking:      ["parking", "bike stand", "vehicle"],
    security:     ["security", "guard", "gated"],
    laundry:      ["laundry", "washing machine", "washer"],
    tv:           ["tv", "television", "cable"],
    geyser:       ["geyser", "hot water", "geezer"],
    fridge:       ["fridge", "refrigerator"],
    gym:          ["gym", "fitness", "workout"],
    powerbackup:  ["power backup", "generator", "inverter", "ups"],
    housekeeping: ["housekeeping", "cleaning", "maid"],
    cctv:         ["cctv", "camera", "surveillance"],
    lift:         ["lift", "elevator"],
    attached_bath:["attached bath", "attached washroom", "private bath", "en-suite"],
    study_table:  ["study table", "study room", "reading table"],
    wardrobe:     ["wardrobe", "cupboard", "almirah", "storage"],
    ro_water:     ["ro water", "purified water", "water purifier", "ro system"],
  };
  const desc = (pg.description || "").toLowerCase();
  const amenityKeys = pg.amenities || (
    Object.entries(AMENITY_KEYWORDS)
      .filter(([, keywords]) => keywords.some((kw) => desc.includes(kw)))
      .map(([key]) => key)
  );

  const rules = pg.rules || [
    "No smoking inside rooms",
    "Guests must leave by 10 PM",
    "Keep common areas clean",
  ];

  const tabs = ["overview", "amenities", "rules"];

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        @keyframes slideUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:none}}
        .fade-in{animation:fadeIn 0.35s ease forwards}
        .booking-modal{animation:slideUp 0.3s ease forwards}
      `}</style>

      {/* ── back breadcrumb ── */}
      <div style={styles.breadcrumb}>
        <button onClick={() => navigate(-1)} style={styles.backBtn}>
          <BackIcon /> Back to listings
        </button>
        <span style={{ color: "#d1d5db", fontSize: 13 }}>›</span>
        <span style={{ fontSize: 13, color: "#6b7280" }}>{pg.title}</span>
      </div>

      {/* ── hero image ── */}
      <div style={styles.imgHero} className="fade-in">
        const imageIndex = Number(id) ? (Number(id) % 6) + 1 : 1;
        <img
          src={`/public/assets/Image${(parseInt(id) % 6) + 1}.jpg`}
          alt={pg.title}
          onError={(e) => { e.target.style.display = "none"; }}
          style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
        />
        <div style={styles.imgOverlay} />

        {/* top-right action buttons */}
        <div style={styles.imgActions}>
          <button
            onClick={() => setSaved((v) => !v)}
            style={{ ...styles.imgActionBtn, color: saved ? "#f59e0b" : "currentColor" }}
            title={saved ? "Saved" : "Save"}
          >
            <BookmarkIcon filled={saved} />
          </button>
          <button style={styles.imgActionBtn} title="Share"><ShareIcon /></button>
        </div>

        {/* bottom-left title overlay */}
        <div style={styles.imgTitleBox}>
          <div style={{ ...styles.genderBadge, background: gender.bg, color: gender.color }}>
            {gender.label}
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "6px 0 4px" }}>
            {pg.title}
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
            <LocationIcon /> {pg.location}
          </div>
        </div>
      </div>

      {/* ── two-column body ── */}
      <div style={styles.body}>

        {/* ── left main column ── */}
        <div style={styles.mainCol}>

          {/* tabs */}
          <div style={styles.tabRow}>
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                style={{ ...styles.tab, ...(activeTab === t ? styles.tabActive : {}) }}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {/* tab: overview */}
          {activeTab === "overview" && (
            <div className="fade-in">
              <h2 style={styles.sectionTitle}>About this PG</h2>
              <p style={styles.desc}>{pg.description || "No description provided."}</p>

              <div style={styles.infoGrid}>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Monthly rent</div>
                  <div style={styles.infoValue}>
                    ₹{Number(pg.price).toLocaleString("en-IN")}
                    <span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280" }}>/mo</span>
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Gender</div>
                  <div style={styles.infoValue}>{gender.label}</div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Location</div>
                  <div style={{ ...styles.infoValue, fontSize: 15 }}>{pg.location}</div>
                </div>
                <div style={styles.infoCard}>
                  <div style={styles.infoLabel}>Listed by</div>
                  <div style={styles.infoValue}>{pg.ownerName || "Owner"}</div>
                </div>
              </div>
            </div>
          )}

          {/* tab: amenities */}
          {activeTab === "amenities" && (
            <div className="fade-in">
              <h2 style={styles.sectionTitle}>Amenities</h2>
              {amenityKeys.length === 0
                ? <p style={styles.desc}>No amenities listed.</p>
                : (
                  <div style={styles.amenityGrid}>
                    {amenityKeys.map((key) => {
                      const a = AMENITY_MAP[key];
                      if (!a) return null;
                      return (
                        <div key={key} style={styles.amenityItem}>
                          <div style={styles.amenityIcon}>{a.icon}</div>
                          <span style={{ fontSize: 14, color: "#374151" }}>{a.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )
              }
            </div>
          )}

          {/* tab: rules */}
          {activeTab === "rules" && (
            <div className="fade-in">
              <h2 style={styles.sectionTitle}>House rules</h2>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {rules.map((rule, i) => (
                  <li key={i} style={styles.ruleItem}>
                    <span style={styles.ruleCheck}><CheckIcon /></span>
                    <span style={{ fontSize: 14, color: "#374151" }}>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── right sticky sidebar ── */}
        <div style={styles.sidebar}>
          <div style={styles.priceCard}>

            {/* price */}
            <div style={styles.priceRow}>
              <span style={styles.priceAmount}>₹{Number(pg.price).toLocaleString("en-IN")}</span>
              <span style={styles.priceUnit}>/month</span>
            </div>

            <div style={styles.priceDivider} />

            {/* owner info */}
            {pg.ownerName && (
              <div style={styles.ownerRow}>
                <div style={styles.ownerAvatar}>
                  {pg.ownerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{pg.ownerName}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Property owner</div>
                </div>
              </div>
            )}

            {/* booking success */}
            {booked && (
              <div style={styles.successBanner}>
                <CheckIcon /> Booking request sent!
              </div>
            )}

            {/* CTA buttons */}
            <button
              onClick={() => setShowBookingModal(true)}
              style={{ ...styles.btnPrimary, width: "100%", justifyContent: "center", marginBottom: 10 }}
              disabled={booked}
            >
              <CalendarIcon />
              {booked ? "Requested" : "Book a visit"}
            </button>

            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ ...styles.btnOutline, flex: 1, justifyContent: "center" }}>
                <PhoneIcon /> Call
              </button>
              <button style={{ ...styles.btnOutline, flex: 1, justifyContent: "center" }}>
                <MessageIcon /> Message
              </button>
            </div>

            <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", marginTop: 14 }}>
              Listing goes live after our team review — usually within 24 hours.
            </p>
          </div>

          {/* quick facts */}
          <div style={styles.quickFacts}>
            {[
              { icon: <UserIcon />, label: "For", val: gender.label },
              { icon: <LocationIcon />, label: "Area", val: pg.location },
            ].map(({ icon, label, val }) => (
              <div key={label} style={styles.factRow}>
                <span style={{ color: "#9ca3af", display: "flex" }}>{icon}</span>
                <span style={{ fontSize: 13, color: "#6b7280" }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: "#111827", marginLeft: "auto" }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── booking modal ── */}
      {showBookingModal && (
        <div
          style={styles.modalOverlay}
          onClick={(e) => { if (e.target === e.currentTarget) setShowBookingModal(false); }}
        >
          <div style={styles.modal} className="booking-modal">
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>Book a visit</h2>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>
              Choose a date and we'll notify the owner.
            </p>

            <label style={styles.modalLabel}>Preferred visit date</label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              style={{ ...styles.filterInput, width: "100%", marginBottom: 16 }}
            />

            <label style={styles.modalLabel}>Message to owner</label>
            <textarea
              value={bookingNote}
              onChange={(e) => setBookingNote(e.target.value)}
              placeholder="Any specific requirements or questions?"
              rows={3}
              style={{ ...styles.filterInput, width: "100%", resize: "vertical", marginBottom: 20 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleBookingSubmit}
                style={{ ...styles.btnPrimary, flex: 1, justifyContent: "center" }}
                disabled={!bookingDate}
              >
                Confirm request
              </button>
              <button onClick={() => setShowBookingModal(false)} style={styles.btnOutline}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── styles ────────────────────────────────────────────────────────────────────
const styles = {
  page: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "20px 28px 60px",
    fontFamily: "'DM Sans', system-ui, sans-serif",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: 14,
    color: "#6b7280",
    padding: 0,
    fontWeight: 500,
  },
  imgHero: {
    width: "100%",
    height: 400,
    borderRadius: 16,
    overflow: "hidden",
    position: "relative",
    background: "linear-gradient(135deg,#c7d2fe,#a5f3fc)",
    marginBottom: 28,
  },
  imgOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)",
    pointerEvents: "none",
  },
  imgActions: {
    position: "absolute",
    top: 14,
    right: 14,
    display: "flex",
    gap: 8,
  },
  imgActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 50,
    background: "rgba(255,255,255,0.85)",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151",
    backdropFilter: "blur(4px)",
  },
  imgTitleBox: {
    position: "absolute",
    bottom: 20,
    left: 20,
  },
  genderBadge: {
    display: "inline-block",
    fontSize: 12,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 99,
  },
  body: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 32,
    alignItems: "start",
  },
  mainCol: {
    minWidth: 0,
  },
  tabRow: {
    display: "flex",
    gap: 4,
    borderBottom: "1px solid #f3f4f6",
    marginBottom: 24,
  },
  tab: {
    padding: "10px 18px",
    background: "none",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    color: "#6b7280",
    marginBottom: -1,
    transition: "color 0.15s",
  },
  tabActive: {
    color: "#3730a3",
    borderBottomColor: "#3730a3",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: 600,
    color: "#111827",
    marginBottom: 12,
    marginTop: 0,
  },
  desc: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 1.7,
    marginBottom: 24,
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  infoCard: {
    background: "#f9fafb",
    border: "1px solid #f3f4f6",
    borderRadius: 10,
    padding: "14px 16px",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: 600,
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: 6,
  },
  infoValue: {
    fontSize: 17,
    fontWeight: 600,
    color: "#111827",
  },
  amenityGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: 12,
  },
  amenityItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#f9fafb",
    border: "1px solid #f3f4f6",
    borderRadius: 10,
    padding: "12px 14px",
  },
  amenityIcon: {
    width: 36,
    height: 36,
    background: "#EEF2FF",
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#3730a3",
  },
  ruleItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "11px 0",
    borderBottom: "1px solid #f9fafb",
  },
  ruleCheck: {
    width: 22,
    height: 22,
    background: "#d1fae5",
    borderRadius: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#065f46",
    flexShrink: 0,
  },
  sidebar: {
    position: "sticky",
    top: 24,
  },
  priceCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "20px",
    marginBottom: 12,
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
  },
  priceRow: {
    display: "flex",
    alignItems: "baseline",
    gap: 6,
    marginBottom: 16,
  },
  priceAmount: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
  },
  priceUnit: {
    fontSize: 14,
    color: "#6b7280",
  },
  priceDivider: {
    height: 1,
    background: "#f3f4f6",
    margin: "0 0 16px",
  },
  ownerRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 50,
    background: "#EEF2FF",
    color: "#3730a3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 16,
    fontWeight: 600,
  },
  successBanner: {
    background: "#d1fae5",
    color: "#065f46",
    borderRadius: 8,
    padding: "10px 14px",
    fontSize: 13,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  quickFacts: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: "14px 16px",
  },
  factRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 0",
    borderBottom: "1px solid #f9fafb",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    zIndex: 50,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  modal: {
    background: "#fff",
    borderRadius: 16,
    padding: "28px",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
  },
  modalLabel: {
    display: "block",
    fontSize: 13,
    fontWeight: 500,
    color: "#374151",
    marginBottom: 6,
  },
  filterInput: {
    padding: "9px 12px",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    fontSize: 14,
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
    display: "block",
  },
  btnPrimary: {
    background: "#3730a3",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transition: "background 0.15s",
  },
  btnOutline: {
    background: "#fff",
    color: "#374151",
    border: "1px solid #e5e7eb",
    padding: "10px 16px",
    borderRadius: 9,
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
  },
};

export default ViewPg;
