import type { Metadata } from "next";
import Link from "next/link";
import VAApplicationForm from "./VAApplicationForm";

export const metadata: Metadata = {
  title: "VA Application | Corvanta Virtual Solutions",
  description:
    "Apply to join the Corvanta Virtual Assistant network. Record your intro, skills, and answer videos directly in your browser.",
};

export default function VAApplicationPage() {
  return (
    <>
      <section className="page-hero text-white">
        <div className="container text-center">
          <div className="breadcrumb">
            <Link href="/">Home</Link> / VA Application
          </div>
          <h1>Apply to Join Our VA Network</h1>
          <p className="lead">
            Tell us about yourself and record your answers directly in your
            browser. Each video is 30 seconds max - be clear and concise.
          </p>
        </div>
      </section>

      <section>
        <div className="container" style={{ maxWidth: 740 }}>
          <VAApplicationForm />
        </div>
      </section>
    </>
  );
}
