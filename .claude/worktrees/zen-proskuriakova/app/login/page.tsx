"use client";

import { useRouter } from "next/navigation";
import FeatureCarousel from "@/components/FeatureCarousel";

function CanopiLogo() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* Canopi tree-cloud logo */}
      <circle cx="28" cy="22" r="14" fill="#1a1a1a" />
      <circle cx="20" cy="27" r="10" fill="#1a1a1a" />
      <circle cx="36" cy="27" r="10" fill="#1a1a1a" />
      <rect x="24" y="33" width="8" height="14" rx="2" fill="#1a1a1a" />
      {/* Letter P cutout */}
      <rect x="23" y="17" width="4" height="12" rx="1" fill="white" />
      <rect x="23" y="17" width="7" height="4" rx="1" fill="white" />
      <rect x="23" y="21" width="7" height="3" rx="1" fill="white" />
      <circle cx="28" cy="19.5" r="2" fill="white" />
      {/* Letter C cutout */}
      <path
        d="M32 22C32 20.5 33 19.5 34.5 19.5C35.5 19.5 36.2 19.9 36.6 20.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M32 22C32 23.5 33 24.5 34.5 24.5C35.5 24.5 36.2 24.1 36.6 23.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M14.6 10.5C14.58 8.7 15.52 7.5 17.4 6.6C16.38 5.14 14.82 4.32 12.74 4.18C10.76 4.04 8.6 5.3 7.8 5.3C6.96 5.3 5.04 4.22 3.52 4.22C0.38 4.28 -2.67e-07 7.52 -2.67e-07 7.52C-2.67e-07 7.52 -0.62 12.28 2.22 17.02C3.42 18.86 4.5 20 5.94 20C7.38 20 7.96 19.06 9.76 19.06C11.56 19.06 12.1 20 13.56 20C14.98 20 16.04 18.82 17.12 17.04C17.86 15.76 18.3 14.38 18.3 14.38C14.92 13.06 14.6 10.5 14.6 10.5ZM11.72 2.7C12.64 1.58 13.2 0.06 13.06 -1.07374e-06C11.62 0.06 9.96 0.94 8.98 2.1C8.1 3.14 7.44 4.66 7.62 6.14C9.18 6.24 10.74 5.04 11.72 2.7Z"
        fill="white"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="login-gradient min-h-[100svh] flex flex-col">
      {/* Main content */}
      <div className="flex flex-col items-center pt-20 flex-1 px-5">
        {/* Logo */}
        <div className="mb-8">
          <CanopiLogo />
        </div>

        {/* Title */}
        <p className="text-gray-400 text-xl font-medium mb-1">Welcome to</p>
        <h1
          className="text-6xl font-black text-black tracking-tight mb-8"
          style={{ fontFamily: "var(--font-geist-sans)" }}
        >
          Canopi
        </h1>

        {/* Subtitle */}
        <p className="text-gray-500 text-lg text-center leading-relaxed mb-12 px-4">
          Share Memorable Moments
          <br />
          with your Friends.
        </p>

        {/* Feature cards carousel */}
        <div className="w-[calc(100%+40px)] -mx-5">
          <FeatureCarousel />
        </div>
      </div>

      {/* Sign in button */}
      <div className="px-5 pb-12 pt-6">
        <button
          onClick={() => router.push("/home")}
          className="w-full bg-black text-white py-4 rounded-full text-lg font-semibold flex items-center justify-center gap-2.5 active:scale-[0.98] transition-transform"
        >
          <AppleLogo />
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}
