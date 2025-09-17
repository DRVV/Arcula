"use client";

import React from "react";
import { useTemplatesStore } from "../../store/templates";

export default function SidebarTemplates() {
  const templates = useTemplatesStore((s) => s.templates);

  const onDragStart = (event: React.DragEvent, templateType: string) => {
    event.dataTransfer.setData("application/reactflow", templateType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div style={{ width: 200, paddingRight: 8, borderRight: "1px solid #eee" }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>Agent Templates</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {templates.map((t) => (
          <div
            key={t.type}
            draggable
            onDragStart={(e) => onDragStart(e, t.type)}
            style={{
              padding: "8px 10px",
              border: "1px solid #ddd",
              borderRadius: 8,
              cursor: "grab",
              userSelect: "none",
              background: "#fafafa",
            }}
            title="Drag onto canvas"
          >
            <div style={{ fontWeight: 600 }}>{t.label}</div>
            {t.defaults?.prompt && (
              <div style={{ color: "#666", fontSize: 12 }}>
                {t.defaults.prompt.slice(0, 60)}
                {t.defaults.prompt.length > 60 ? "…" : ""}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
