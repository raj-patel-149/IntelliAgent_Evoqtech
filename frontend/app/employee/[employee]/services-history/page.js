
"use client";
import AllServices2 from "@/app/Components/AllServices2";
import { useParams } from "next/navigation";
import React from "react";

const page = () => {
 const params = useParams();
 const id= params.employee
  return <AllServices2 service={"history"} id={id} page={`Services: History`}/>
  ;
};

export default page;
