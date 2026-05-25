"use client";

export default function Logo({ className = "w-12 h-12" }) {
  return (
    // Max width aur max height set kar di taaki control se bahar na bhaage
    <div className={`flex items-center justify-center shrink-0 max-w-full ${className}`}>
      <img 
        src="/logos/TheMockMaster.jpg" 
        alt="TheMockMaster Logo" 
        className="w-full h-full object-contain rounded-full shadow-sm"
      />
    </div>
  );
}