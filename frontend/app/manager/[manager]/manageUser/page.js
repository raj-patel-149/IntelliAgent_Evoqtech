"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ManageUsers from "@/app/Components/ManageUsers";

function ManageAdminPage() {
  return <ManageUsers />;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ManageAdminPage />
    </Suspense>
  );
}
