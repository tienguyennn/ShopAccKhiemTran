"use client";

import { Breadcrumb } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BreadcrumbHomePage = () => {
  const pathname = usePathname();
  const segments =
    pathname
      ?.split("/")
      .filter((segment) => segment && segment !== "home") ?? [];

  const items = [
    {
      title: <Link href="/" className="hover:text-[#0082ca]!">Trang chủ</Link>,
    },
    ...segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;
      const label = decodeURIComponent(segment)
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        title: isLast ? (
          <span className="capitalize text-gray-600">{label}</span>
        ) : (
          <Link href={href}>{label}</Link>
        ),
      };
    }),
  ];

    return (
    <div className={`${items.length < 2 ? "hidden" : ""} w-full mt-3 px-5 sm:px-0`}>
      <Breadcrumb items={items} />
    </div>
  );
};

export default BreadcrumbHomePage;
