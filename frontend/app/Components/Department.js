"use client";

import React from "react";
import {
  useGetDepartmentsQuery,
  useGetSkillsByDepartmentQuery,
} from "@/features/userApiSlice";

const Department = () => {
  const { data: departmentData, isLoading: loadingDepartments } =
    useGetDepartmentsQuery();

  if (loadingDepartments)
    return <div className="text-center py-10">Loading departments...</div>;

  return (
    <div className="p-2 bg-gray-50 min-h-screen mt-6">
      <h1 className="text-3xl font-bold mb-6 text-left text-gray-700">
        Services by Department
      </h1>

      {departmentData?.departments?.map((dept) => (
        <DepartmentServices key={dept} departmentName={dept} />
      ))}
    </div>
  );
};

const DepartmentServices = ({ departmentName }) => {
  const { data: servicesData, isLoading } =
    useGetSkillsByDepartmentQuery(departmentName);

  if (isLoading) {
    return (
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-2 text-gray-700">
          {departmentName}
        </h2>
        <div className="text-sm text-gray-500">Loading services...</div>
      </div>
    );
  }

  if (!servicesData || servicesData.length === 0) return null;

  return (
    <div className="mb-12 bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800">
          {departmentName.toUpperCase()}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-300 text-black ">
            <tr>
              <th className="px-6 py-3">Service Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Base Price (INR)</th>
              <th className="px-6 py-3">Duration</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {servicesData.map((service) => (
              <tr key={service._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {service.skill_Name}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {service.description}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  ₹{service.basePrice}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {service.duration.value} {service.duration.unit}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;
