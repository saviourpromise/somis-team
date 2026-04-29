"use client";

import dynamic from "next/dynamic";

// Dynamically import the PDF viewer to avoid SSR issues with 'window' and canvas
const PdfViewer = dynamic(() => import("./components/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontFamily: 'sans-serif',
      color: '#64748b'
    }}>
      Preparing PDF viewer...
    </div>
  ),
});

export default function Home() {
  return (
    <main style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
      <PdfViewer file="/assets/SOMI STEAM NEW FULL_PRICELIST.pdf" />
    </main>


  );
}

