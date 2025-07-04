"use client";
import AllServices3 from "@/app/Components/AllService3";

import { useParams } from "next/navigation";
import React from "react";

const page = () => {
  const params = useParams();
  const id = params.userId;
  return <AllServices3 service={"all"} id={id} page={`Services: History`} />;
};

export default page;
