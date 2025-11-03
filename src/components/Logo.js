"use client";

import { Feather } from "lucide-react";

export default function Logo({ size = "default", showText = true }) {
  const sizeClasses = {
    small: "h-6 w-6",
    default: "h-8 w-8",
    large: "h-12 w-12",
    xl: "h-16 w-16",
  };

  const textSizeClasses = {
    small: "text-lg",
    default: "text-xl",
    large: "text-2xl",
    xl: "text-4xl",
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Feather className={`${sizeClasses[size]} text-primary-600`} />
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold gradient-text`}>
            XPosts
          </span>
        </div>
      )}
    </div>
  );
}
