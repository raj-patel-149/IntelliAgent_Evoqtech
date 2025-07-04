"use client";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Typography,
    Chip,
    Button,
    Divider,
    Avatar,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Stack,
    TextField
} from "@mui/material";
import {
    ArrowBack as BackIcon,
    AccessTime as TimeIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Description as DetailsIcon,
    Construction as ServiceIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    Error as ProblemIcon,
    Edit as EditIcon,
    HourglassBottom as HourglassBottomIcon,
    CheckCircleOutline as CheckCircleOutlineIcon,
    PauseCircleOutline as PauseCircleOutlineIcon,
    HighlightOff as HighlightOffIcon,
    HourglassEmpty as HourglassEmptyIcon,
    EventBusy as EventBusyIcon,
    PersonAdd as PersonAddIcon,
    EventAvailable as EventAvailableIcon,
    Build as BuildIcon,
    Settings as SettingsIcon,
    ReportProblem as ReportProblemIcon,
    Replay as ReplayIcon,
    Cancel as CancelIcon,
    DoNotDisturb as DoNotDisturbIcon,
    Lock as LockIcon
} from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { format } from "date-fns";
import Link from "next/link";
import { useGetCaseDetailsQuery, useUpdateServiceManagerStatusMutation, useUpdateServiceStatusMutation } from "@/features/caseApiSlice";
import { useGetUserByIdQuery } from "@/features/userApiSlice";

export default function CaseDetailPage() {
    const params = useParams();
    const id = params.caseId;
    const eid = params.employee;
    const pathname = usePathname();
    const { data } = useGetUserByIdQuery(eid);
    const user = data?.user;
    // console.log("pathname", pathname);

    const {
        data: caseData,
        isLoading,
        isError,
        refetch
    } = useGetCaseDetailsQuery(id);

    const [updateServiceStatus] = useUpdateServiceStatusMutation();
    const [approvalDialog, setApprovalDialog] = useState(false);
    const [notes, setNotes] = useState("");
    const [serviceStatus, setServiceStatus] = useState(caseData?.service_status || "missed");

    console.log("caseData", caseData?.service_status)
    useEffect(() => {
        setServiceStatus(caseData?.service_status);
    }, [caseData?.service_status]);


    const statusConfig = {
        pending: {
            label: "Pending",
            color: "warning",
            icon: <HourglassEmptyIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-amber-100 text-amber-800"
        },
        expired: {
            label: "Expired",
            color: "error",
            icon: <EventBusyIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-red-100 text-red-800"
        },
        accepted: {
            label: "Accepted",
            color: "success",
            icon: <CheckCircleIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-green-100 text-green-800"
        },
        assigned: {
            label: "Assigned",
            color: "info",
            icon: <PersonAddIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-blue-100 text-blue-800"
        },
        scheduled: {
            label: "Scheduled",
            color: "primary",
            icon: <EventAvailableIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-purple-100 text-purple-800"
        },
        inProgress: {
            label: "In Progress",
            color: "secondary",
            icon: <BuildIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-cyan-100 text-cyan-800"
        },
        waitingForCustomer: {
            label: "Waiting for Customer",
            color: "warning",
            icon: <PersonIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-yellow-100 text-yellow-800"
        },
        waitingToStart: {
            label: "Waiting To Start",
            color: "primary",
            icon: <EventAvailableIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-orange-100 text-orange-800"
        },
        waitingForParts: {
            label: "Waiting for Parts",
            color: "warning",
            icon: <SettingsIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-orange-100 text-orange-800"
        },
        completed: {
            label: "Completed",
            color: "success",
            icon: <CheckCircleOutlineIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-green-100 text-green-800"
        },
        missed: {
            label: "Missed",
            color: "error",
            icon: <ReportProblemIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-red-100 text-red-800"
        },
        waitingForApproval: {
            label: "Waiting for Approval",
            color: "info",
            icon: <HourglassBottomIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-blue-100 text-blue-800"
        },
        reopened: {
            label: "Reopened",
            color: "primary",
            icon: <ReplayIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-indigo-100 text-indigo-800"
        },
        halted: {
            label: "Halted",
            color: "error",
            icon: <PauseCircleOutlineIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-pink-100 text-pink-800"
        },
        rejected: {
            label: "Rejected",
            color: "error",
            icon: <CancelIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-red-100 text-red-800"
        },
        cancelled: {
            label: "Cancelled",
            color: "error",
            icon: <DoNotDisturbIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-gray-300 text-gray-800"
        },
        closed: {
            label: "Closed",
            color: "default",
            icon: <LockIcon sx={{ fontSize: 30 }} />,
            bgColor: "bg-gray-500 text-white"
        }
    };
    console.log("caseData.service_status", serviceStatus)

    // const handleStatusUpdate = async (newStatus) => {
    //     try {
    //         await updateServiceStatus({
    //             id: caseData._id,
    //             service_status: newStatus,
    //         }).unwrap();
    //         refetch(); // Refresh the data after update
    //     } catch (error) {
    //         console.error("Failed to update case status:", error);
    //     }
    // };
    const handleStatusUpdate = async (newStatus) => {
        try {
            await updateServiceStatus({
                id: caseData._id,
                service_status: newStatus,
                receiver: user?.name,
                receiver_id: user?._id,
            }).unwrap();
            setServiceStatus(newStatus);
        } catch (error) {
            console.error("Failed to update case status:", error);
        }
    };

    const handleApproval = async () => {
        try {
            setApprovalDialog(false);
            await handleStatusUpdate("waitingForApproval");
        } catch (error) {
            console.error("Error updating service status:", error);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (isError) return <div className="p-8 text-center">Error loading case details</div>;
    if (!caseData) return <div className="p-8 text-center">Case not found</div>;

    const status = statusConfig[serviceStatus] || statusConfig.default;

    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="mb-6">
                <Link
                    href={`${pathname.split("/").slice(0, -1).join("/")}`}
                    className="flex items-center text-blue-600 hover:text-blue-800"
                >
                    <BackIcon className="mr-1" /> Back to all cases
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Header with Status Actions */}

                <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                        <div className="flex-1">
                            <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                                {caseData.header}
                            </Typography>
                            <Stack direction="row" spacing={2} alignItems="center" className="mb-2 sm:mb-0">
                                <Typography variant="body1" className="text-gray-600">
                                    {caseData.service}
                                </Typography>
                            </Stack>

                            {/* Chip moved here for mobile */}
                            <div className="sm:hidden mt-2">
                                <Chip
                                    label={status?.label}
                                    color={status?.color}
                                    className={`${status?.bgColor} capitalize font-medium`}
                                    icon={status?.icon}
                                    sx={{
                                        width: "75%",

                                        fontSize: "1rem",
                                        py: 1,
                                        px: 2,
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </div>
                        </div>

                        <Box sx={{ display: "flex", gap: 1 }} className="flex-col sm:flex-row items-start sm:items-center">
                            {/* Chip hidden on mobile (shown above) */}
                            <div className="hidden sm:block">

                                <Chip
                                    label={status?.label}
                                    color={status?.color}
                                    className={`${status?.bgColor} capitalize font-medium`}
                                    icon={status?.icon}
                                    sx={{
                                        fontSize: "1rem",

                                        px: 2,
                                        fontWeight: "bold",
                                        borderRadius: 2,
                                        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                    }}
                                />
                            </div>

                            {caseData.service_status === "waitingForApproval" && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setApprovalDialog(true)}
                                    className="w-full sm:w-auto"
                                >
                                    Approve Service
                                </Button>
                            )}
                        </Box>
                    </div>
                </div>
                {/* Main Content */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <Section title="Parties Involved">
                            <DetailItem icon={<PersonIcon />} label="Customer">
                                {caseData.sender}
                            </DetailItem>
                            <DetailItem icon={<PersonIcon />} label="Receiver">
                                {caseData.receiver}
                            </DetailItem>
                        </Section>

                        <Section title="Location">
                            <DetailItem icon={<LocationIcon />} label="Address">
                                {caseData.location}
                            </DetailItem>
                        </Section>

                        <Section title="Description">
                            <Typography className="text-gray-700">
                                {caseData.description}
                            </Typography>
                        </Section>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <Section title="Timeline">
                            <DetailItem icon={<CalendarIcon />} label="Scheduled Date">
                                {caseData.date}
                            </DetailItem>
                            <DetailItem icon={<TimeIcon />} label="Scheduled Time">
                                {caseData.time}
                            </DetailItem>

                            {caseData.scheduled_start_time && (
                                <DetailItem icon={<TimeIcon />} label="Scheduled Start">
                                    {format(new Date(caseData.scheduled_start_time), "MMM d, yyyy 'at' h:mm a")}
                                </DetailItem>
                            )}

                            {caseData.actual_start_time && (
                                <DetailItem icon={<TimeIcon />} label="Actual Start">
                                    {format(new Date(caseData.actual_start_time), "MMM d, yyyy 'at' h:mm a")}
                                </DetailItem>
                            )}

                            {caseData.actual_end_time && (
                                <DetailItem icon={<TimeIcon />} label="Completed At">
                                    {format(new Date(caseData.actual_end_time), "MMM d, yyyy 'at' h:mm a")}
                                </DetailItem>
                            )}
                        </Section>

                        <Section title="Additional Information">
                            {caseData.halted_time && (
                                <DetailItem icon={<ProblemIcon />} label="Halted At">
                                    {format(new Date(caseData.halted_time), "MMM d, yyyy 'at' h:mm a")}
                                </DetailItem>
                            )}
                            {caseData.reminder_sent && (
                                <Chip
                                    label="Reminder Sent"
                                    color="info"
                                    variant="outlined"
                                    className="self-start"
                                />
                            )}
                        </Section>
                    </div>
                </div>
                {/* Action Buttons */}
                <Box sx={{
                    display: "flex",
                    gap: 1,
                    m: 3,
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}>
                    {serviceStatus === "missed" ?
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // if (serviceStatus === "missed") {
                                setApprovalDialog(true);
                                // } else {
                                //   setServiceStatus("inProgress");
                                // }
                                // handleStatusUpdate("waitingForApproval");
                            }}
                            disabled={caseData.service_status !== "missed"}
                        >
                            Restart Service
                        </Button>
                        :
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                if (serviceStatus === "missed") {
                                    // setApprovalDialog(true);
                                } else {
                                    setServiceStatus("inProgress");
                                }
                                handleStatusUpdate("inProgress");
                            }}
                            disabled={serviceStatus === "completed" || serviceStatus === "inProgress" || serviceStatus === "waitingForApproval"}
                        >
                            Start Service
                        </Button>
                    }
                    <Button
                        variant="contained"
                        color="warning"
                        onClick={() => handleStatusUpdate("halted")}
                        disabled={serviceStatus === "halted" || serviceStatus === "missed" || serviceStatus === "completed" || serviceStatus === "waitingToStart" || serviceStatus === "waitingForApproval"}
                    >
                        Halt
                    </Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleStatusUpdate("completed")}
                        disabled={serviceStatus === "completed" || serviceStatus === "missed" || serviceStatus === "waitingToStart" || serviceStatus === "waitingForApproval"}
                    >
                        Completed
                    </Button>
                </Box>
                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-200 text-sm text-gray-500">
                    <div className="flex justify-between">
                        <span>Case ID: {caseData._id}</span>
                        <span>Last updated: {format(new Date(caseData.updatedAt), "MMM d, yyyy")}</span>
                    </div>
                </div>
            </div>

            {/* Approval Dialog */}
            <Dialog open={approvalDialog} onClose={() => setApprovalDialog(false)}>
                <DialogTitle>Approval Required</DialogTitle>
                <DialogContent>
                    <Typography>Do you want to request approval to restart this service?</Typography>
                    <Typography>This will send a notification to the manager.</Typography>

                    {/* Notes Input Field */}
                    <TextField
                        label="Notes"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={3}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setApprovalDialog(false)} color="error">
                        Cancel
                    </Button>
                    <Button onClick={() => handleApproval(notes)} color="primary">
                        Request Approval
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="space-y-3">
            <Typography variant="h6" className="font-semibold text-gray-800">
                {title}
            </Typography>
            <Divider className="!my-2" />
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
}

function DetailItem({ icon, label, children }) {
    return (
        <div className="flex space-x-3">
            <div className="text-gray-400 mt-0.5">{icon}</div>
            <div>
                <Typography variant="caption" className="text-gray-500 font-medium">
                    {label}
                </Typography>
                <Typography variant="body1" className="text-gray-800">
                    {children}
                </Typography>
            </div>
        </div>
    );
}