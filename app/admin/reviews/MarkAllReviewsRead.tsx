"use client";

import { useEffect } from "react";
import { markAllReviewsRead } from "./actions";

export default function MarkAllReviewsRead() {
  useEffect(() => {
    void markAllReviewsRead();
  }, []);
  return null;
}
