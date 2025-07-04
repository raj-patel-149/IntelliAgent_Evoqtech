"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { useGetTeamServicesByEmployeeIdQuery } from "@/features/teamServiceApiSlice";
import { useGetCasesByIdsMutation } from "@/features/caseApiSlice";

export default function AcceptedServices() {
  const router = useRouter();
  const params = useParams();
  const id = params?.employee;

  // Fetch team services data
  const { data = [], isLoading: isTeamLoading } =
    useGetTeamServicesByEmployeeIdQuery(id);

  const caseIds = useMemo(() => data.map((service) => service.caseId), [data]);

  const [assignedCases, setAssignedCases] = useState([]);
  const [getCasesByIds, { isLoading: isCasesLoading }] =
    useGetCasesByIdsMutation();

  useEffect(() => {
    if (caseIds.length > 0) {
      getCasesByIds(caseIds).then((response) => {
        if (response?.data?.cases) {
          setAssignedCases(response.data.cases);
        }
      });
    }
  }, [caseIds, getCasesByIds]);

  if (isTeamLoading || isCasesLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "in-progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const navigateToService = (Cid) => {
    router.push(`/employee/${id}/team-services/${Cid}`);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="relative pb-8">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Assigned Tasks By Manager
            </h1>
            <p className="mt-2 text-lg text-gray-600">
              Manage your assigned service cases
            </p>
            <div className="absolute bottom-0 left-0 w-16 h-1 bg-gray-300 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-10 h-1 bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {assignedCases.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="mx-auto h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800">
              No cases assigned
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              When you're assigned to team services, they'll appear here for you
              to manage.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {assignedCases.map((caseData) => (
              <div
                key={caseData._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden  border-gray-200 hover:shadow-md transition-all duration-300 hover:border-gray-900 hover:border-1 border-1 group cursor-pointer"
                onClick={(event) => {
                  event.stopPropagation();
                  navigateToService(caseData._id);
                }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                        caseData.service_status
                      )}`}
                    >
                      {caseData.service_status.replace("-", " ").toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {formatDate(caseData.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-center space-x-4 mb-5 ">
                    <div className="flex-shrink-0 bg-gray-100 rounded-lg text-gray-600 group-hover:bg-gray-200 transition-colors duration-300">
                      <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>

                    <h2 className="text-lg font-bold text-gray-800 truncate">
                      {caseData.service}
                    </h2>
                  </div>

                  {caseData.description && (
                    <p className="text-gray-600 mb-6 text-sm line-clamp-2">
                      {caseData.description}
                    </p>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start text-sm text-gray-600">
                      <svg
                        className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="truncate">{caseData.location}</span>
                    </div>

                    <div className="flex items-start text-sm text-gray-600">
                      <svg
                        className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span>
                        {caseData.date} at {caseData.time}
                      </span>
                    </div>

                    <div className="flex items-start text-sm text-gray-600">
                      <svg
                        className="flex-shrink-0 mr-3 h-5 w-5 text-gray-400 mt-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span>Customer: {caseData.sender}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                  <span className="text-xs text-gray-500 font-medium">
                    Updated: {formatDate(caseData.updatedAt)}
                  </span>
                  <button
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateToService(caseData._id);
                    }}
                  >
                    Details
                    <svg
                      className="ml-1 h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
