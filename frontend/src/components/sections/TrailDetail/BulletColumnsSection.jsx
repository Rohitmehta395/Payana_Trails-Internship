import React from "react";

const BulletColumnsSection = ({
  leftTitle,
  leftItems = [],
  rightTitle,
  rightItems = [],
}) => (
  <div className="grid gap-6 md:grid-cols-2">
    <BulletCard title={leftTitle} items={leftItems} />
    <BulletCard title={rightTitle} items={rightItems} />
  </div>
);

const BulletCard = ({ title, items }) => (
  <div className="rounded-2xl border border-[#4A3B2A]/10 bg-[#F8F1E6] p-5">
    <h3 className="text-xl font-serif text-[#4A3B2A]">{title}</h3>
    <ul className="mt-4 space-y-2">
      {items.map((item, idx) => (
        <li key={`${title}-${idx}`} className="flex gap-2 text-[#5A4738]">
          <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#6F4E37]" />
          <span>{item}</span>
        </li>
      ))}
      {items.length === 0 && (
        <li className="text-[#7A6351]">No details added yet.</li>
      )}
    </ul>
  </div>
);

export default BulletColumnsSection;
