"use client";
import AllServices from "@/app/Components/AllServices";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const s = params.service;
  return <AllServices serv={s} page={`Services: ${s}`}/>
  ;
};

export default page;
