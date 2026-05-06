"use client"
import { UserButton } from '@clerk/nextjs'
import { Bell, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation';

function DashboardHeader() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const pathname = usePathname();

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
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Dashboard Overview</h1>
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
