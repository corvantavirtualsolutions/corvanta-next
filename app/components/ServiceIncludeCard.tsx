"use client";

import { CheckCircle2 } from "lucide-react";
import { serviceIconMap } from "./serviceIconMap";

interface ServiceIncludeCardProps {
  title: string;
  body: string;
  color: string;
  bg: string;
}

export default function ServiceIncludeCard({
  title,
  body,
  color,
  bg,
}: ServiceIncludeCardProps) {
  const UniqueIcon = serviceIconMap[title] ?? CheckCircle2;

  return (
    <div
      className="card feature-card svc-include-card"
      style={
        {
          "--svc-color": color,
          "--svc-bg": bg,
          textAlign: "center",
        } as React.CSSProperties
      }
    >
      <div className="svc-icon-wrap">
        {/* Checkmark — visible at rest, fades out on hover */}
        <span className="svc-icon-check">
          <CheckCircle2 size={24} />
        </span>
        {/* Unique icon — hidden at rest, fades in on hover */}
        <span className="svc-icon-unique">
          <UniqueIcon size={24} />
        </span>
      </div>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}
