"use client";
import AllServices from "@/app/Components/AllServices";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  return <AllServices serv={"history"} page={`Services: History`} />;
};

export default page;
