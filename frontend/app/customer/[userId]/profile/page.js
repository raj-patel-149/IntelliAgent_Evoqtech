"use client"

import ProfileForm from "@/app/Components/EmployeeProfile";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const id = params.userId;
  return (
    <div className="pt-9">
      <ProfileForm id={id}/>
    </div>
  );
};

export default page;
