import React from "react";

interface RestaurantLogoProps {
  logo: string;
  className?: string;
  alt?: string;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({
  logo = "🍽️",
  className = "",
  alt = "Logo"
}) => {
  const isImage = logo && (logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("data:image"));

  if (isImage) {
    return (
      <img
        src={logo}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
        onError={(e) => {
          // fallback if image fails to load
          (e.currentTarget as HTMLElement).style.display = 'none';
          if (e.currentTarget.parentElement) {
            const span = document.createElement("span");
            span.innerText = "🍽️";
            span.className = className;
            e.currentTarget.parentElement.appendChild(span);
          }
        }}
      />
    );
  }

  return <span className={`inline-block text-center select-none ${className}`}>{logo}</span>;
};
