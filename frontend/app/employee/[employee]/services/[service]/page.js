"use client";
import AllServices2 from "@/app/Components/AllServices2";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const s = params.service;
  const id = params.employee;
  return <AllServices2 service={s}id={id} page={`Services: ${s}`}/>
  ;
};

export default page;
