import { ProjectData } from "../data/projects";

export default function ProjectDetailModal({ item, onClose }: { item: any | null, onClose: () => void }) {
  if (!item) return null;

  const isProject = item.title !== undefined;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50, // Below the "RETURN TO CORE" button
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end", // Align to the right
        padding: "clamp(2rem, 5vw, 6rem)",
        pointerEvents: "none", // Let clicks pass through except on the modal card itself
      }}
    >
      {/* Glassmorphic Panel */}
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "rgba(10, 10, 15, 0.75)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(0, 240, 255, 0.2)",
          borderRadius: "16px",
          padding: "3rem",
          color: "#fff",
          fontFamily: "'Space Mono', monospace",
          pointerEvents: "auto", // Enable interaction for the modal
          transform: "translateX(0)",
          animation: "slideIn 0.5s var(--ease-out-expo)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.05)",
        }}
      >
        <h2 style={{ fontSize: "2rem", letterSpacing: "0.1em", marginBottom: "0.5rem", color: "#00f0ff" }}>
          {isProject ? item.title : item.name}
        </h2>
        <div style={{ fontSize: "0.9rem", color: "#8b5cf6", letterSpacing: "0.15em", marginBottom: "2rem", textTransform: "uppercase" }}>
          {isProject ? item.shortDesc : item.role}
        </div>
        
        <p style={{ fontSize: "1rem", lineHeight: "1.7", color: "rgba(255,255,255,0.8)", marginBottom: "2.5rem" }}>
          {isProject ? item.longDesc : item.bio}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.8rem", marginBottom: "3rem" }}>
          {(isProject ? item.techStack : item.skills).map((badge: string) => (
            <span key={badge} style={{ 
              fontSize: "0.75rem", 
              padding: "0.4rem 0.8rem", 
              background: "rgba(255,255,255,0.05)", 
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "4px",
              letterSpacing: "0.05em"
            }}>
              {badge}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4">
          <a 
            href={isProject ? (item.externalLink || `/project/${item.id}`) : item.linkedin}  
            target={item.externalLink ? "_blank" : "_self"}
            rel={item.externalLink ? "noopener noreferrer" : undefined}
            className="nav-pill interactive"
            style={{
              display: "inline-block",
              padding: "1rem 2.5rem",
              background: "rgba(0, 240, 255, 0.1)",
              color: "#00f0ff",
              border: "1px solid #00f0ff",
              textDecoration: "none",
              letterSpacing: "0.1em",
              fontSize: "0.9rem",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            data-hover
          >
            {isProject ? (item.externalLink ? "VISIT WWW.MUMUKSHUGAME.COM ↗" : "VIEW FULL CASE STUDY") : "ESTABLISH UPLINK"}
          </a>

          {isProject && item.externalLink && (
            <a 
              href={`/project/${item.id}`}  
              className="nav-pill interactive"
              style={{
                display: "inline-block",
                padding: "1rem 2rem",
                background: "rgba(255, 255, 255, 0.05)",
                color: "#fff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                textDecoration: "none",
                letterSpacing: "0.1em",
                fontSize: "0.85rem",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              data-hover
            >
              CASE STUDY
            </a>
          )}
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideIn {
          from { transform: translateX(50px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
