import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import MatchingForm from "./MatchingForm";

export const metadata: Metadata = {
  title: "Find a Talent | Corvanta Virtual Solutions",
  description:
    "Get matched with a vetted Virtual Assistant for your business in as little as 3 days.",
};

export default async function FindATalentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {/* Page Hero */}
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / Find a Talent
          </div>
          <h1>Find the right Virtual Assistant for your business</h1>
          <p className="lead">
            Tell us what you need, and we'll match you with pre-vetted VAs ready to start - often within days.
          </p>
        </div>
      </section>

      {/* Interactive Matching Form + Reviews (client component) */}
      <MatchingForm />
    </>
  );
}
