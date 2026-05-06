"use client"
import { UserButton } from '@clerk/nextjs'
import { ArrowLeft, Bell, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';

function DashboardHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const showBackButton = pathname !== "/" && pathname !== "/dashboard";

  const getFallbackPath = () => {
    const courseMatch = pathname?.match(/^\/course\/([^/]+)(?:\/.+)?$/);

    if (courseMatch && pathname !== `/course/${courseMatch[1]}`) {
      return `/course/${courseMatch[1]}`;
    }

    return "/dashboard";
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(getFallbackPath());
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setSearchValue(params.get("q") || "");
  }, [pathname]);

  const handleSearchChange = (event) => {
    const nextValue = event.target.value;
    setSearchValue(nextValue);

    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );

    if (nextValue.trim()) {
      params.set("q", nextValue);
    } else {
      params.delete("q");
    }

    const targetPath = pathname?.startsWith("/dashboard") ? pathname : "/dashboard";
    const queryString = params.toString();
    router.replace(queryString ? `${targetPath}?${queryString}` : targetPath);
    window.dispatchEvent(new CustomEvent("dashboard-search-change", { detail: nextValue }));
  };

  return (
    <div className='header-bar px-6 py-3 flex items-center justify-between sticky top-0 z-30'>
      {/* Left side - Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        {showBackButton && (
          <button
            type="button"
            onClick={handleBack}
            className="outline-btn flex items-center gap-2 px-3 py-2 text-text-primary bg-dark-tertiary/80 border-white/10"
            aria-label="Go back"
            title="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm font-medium">Back</span>
          </button>
        )}
        <h1 className="text-lg font-semibold text-text-primary truncate">Dashboard Overview</h1>
      </div>

      {/* Center - Search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Search courses, topics, materials..."
          className="search-input"
          value={searchValue}
          onChange={handleSearchChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="notification-bell">
          <Bell className="w-[18px] h-[18px]" />
          <span className="notification-badge">3</span>
        </div>

        {/* User Profile */}
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9 rounded-lg",
            },
          }}
        />
      </div>
    </div>
  )
}

export default DashboardHeader
