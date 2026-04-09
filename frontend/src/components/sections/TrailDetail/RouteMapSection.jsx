import React from "react";

const RouteMapSection = ({ routeMapUrl, route }) => (
  <div className="overflow-hidden rounded-2xl border border-[#4A3B2A]/15 bg-[#F3EFE9]">
    <img
      src={routeMapUrl}
      alt="Route map"
      className="h-[420px] w-full object-cover"
    />
    <div className="border-t border-[#4A3B2A]/15 p-4 text-[#4A3B2A]">
      <span className="font-semibold">Trail Route: </span>
      {route}
    </div>
  </div>
);

export default RouteMapSection;
