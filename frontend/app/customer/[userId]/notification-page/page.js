"use client";
import Notification from "@/app/Components/Notification";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
      const params = useParams();
      const id = params.userId;
  return (
    <div>
      <Notification id={id}/>
    </div>
  );
};

export default page;
