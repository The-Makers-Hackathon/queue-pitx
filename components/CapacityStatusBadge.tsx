"use client";

interface Props {
  status: "available" | "full";
}

export default function CapacityStatusBadge({ status }: Props) {
  const colors = {
    available: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    full: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colors[status]}`}
    >
      {status === "available" ? "Available" : "Full"}
    </span>
  );
}
