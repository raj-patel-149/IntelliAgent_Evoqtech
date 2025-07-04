"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Autocomplete,
  Chip,
  Snackbar,
  IconButton,
  FormControlLabel,
  Switch,
  Typography,
  Grid,
  Paper,
  Box,
  Divider,
  Slide,
  Zoom,
  Tooltip,
  Avatar,
  Badge,
  Card,
  CardContent,
  CardActionArea,
  CardActions,
} from "@mui/material";
import { Button } from "@mui/material";
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Check,
  CloudUpload,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import CloseIcon from "@mui/icons-material/Close";
import {
  useAddTemplateMutation,
  useGetAllTemplatesQuery,
} from "@/features/teamTemplateApiSlice";
import { useGetDepartmentsQuery } from "@/features/userApiSlice";
import { arrayMoveImmutable } from "array-move";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";
import { PhotoCamera } from "@mui/icons-material";
import { useParams, useRouter } from "next/navigation";
import { te } from "date-fns/locale";

// Styled Components
const ServiceCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "all 0.3s ease",
  border: `1px solid ${theme.palette.grey[300]}`,
  "&:hover": {
    boxShadow: theme.shadows[8],
    borderColor: theme.palette.primary.main,
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.grey[800],
  color: theme.palette.common.white,
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  "& .MuiTypography-root": {
    fontWeight: 600,
    fontSize: "1.25rem",
  },
}));

const DialogActionsStyled = styled(DialogActions)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.grey[300]}`,
}));

const InputField = styled(TextField)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    "& fieldset": {
      borderColor: theme.palette.grey[400],
    },
    "&:hover fieldset": {
      borderColor: theme.palette.grey[600],
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
      borderWidth: "1px",
    },
  },
}));

const DepartmentBadge = styled(Chip)(({ theme }) => ({
  marginRight: theme.spacing(1),
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.grey[200],
  "& .MuiChip-deleteIcon": {
    color: theme.palette.grey[500],
    "&:hover": {
      color: theme.palette.error.main,
    },
  },
}));

const CountInput = styled(TextField)(({ theme }) => ({
  width: "100px",
  marginLeft: theme.spacing(2),
  "& .MuiOutlinedInput-input": {
    padding: "10px 14px",
  },
}));

const SortableItemWrapper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: "8px",
  borderLeft: `4px solid ${theme.palette.primary.main}`,
  marginBottom: theme.spacing(1.5),
  fontWeight: 500,
  color: theme.palette.text.primary,
  cursor: "grab",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  boxShadow: theme.shadows[1],
  "&:hover": {
    backgroundColor: theme.palette.grey[200],
  },
}));

function SortableItem({ id, label }) {
  const theme = useTheme(); // Add this line to access the theme
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableItemWrapper
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Box display="flex" alignItems="center">
        <GripVertical
          size={18}
          style={{ marginRight: 12, color: theme.palette.grey[600] }}
        />
        <Typography>{label}</Typography>
      </Box>
      <Tooltip title="Drag to Reorder">
        <Box sx={{ color: theme.palette.grey[600] }}>☰</Box>
      </Tooltip>
    </SortableItemWrapper>
  );
}

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.manager;
  const { data: allTemplates, refetch } = useGetAllTemplatesQuery();
  const { data: departmentData } = useGetDepartmentsQuery();
  const [addTemplate, { isLoading: isSubmitting }] = useAddTemplateMutation();
  const departments = useMemo(
    () => departmentData?.departments || [],
    [departmentData]
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [openOrderDialog, setOpenOrderDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [finalRequirementsOrder, setFinalRequirementsOrder] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [leaderRequired, setLeaderRequired] = useState(true);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [departmentCounts, setDepartmentCounts] = useState({});
  const [selectedServiceImage, setSelectedServiceImage] = useState(null);
  const [serviceImagePreview, setServiceImagePreview] = useState(null);

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleDepartmentChange = (event, value) => {
    setSelectedDepartments(value);
    setValue("selectedDepartments", value);

    // Initialize counts for new departments
    const newCounts = { ...departmentCounts };
    value.forEach((dept) => {
      if (!newCounts[dept]) {
        newCounts[dept] = 1;
      }
    });
    setDepartmentCounts(newCounts);
  };

  const handleCountChange = (department, value) => {
    setDepartmentCounts((prev) => ({
      ...prev,
      [department]: parseInt(value) || 1,
    }));
  };

  const removeDepartment = (deptToRemove) => {
    const newDepartments = selectedDepartments.filter(
      (dept) => dept !== deptToRemove
    );
    setSelectedDepartments(newDepartments);
    setValue("selectedDepartments", newDepartments);

    const newCounts = { ...departmentCounts };
    delete newCounts[deptToRemove];
    setDepartmentCounts(newCounts);
  };

  const handleServiceImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedServiceImage(file);
      setServiceImagePreview(URL.createObjectURL(file));
    }
  };

  // const onSubmit = (data) => {
  //   const requirements = selectedDepartments.map((dept) => ({
  //     department: dept,
  //     count: departmentCounts[dept] || 1,
  //   }));

  //   setFormData({
  //     service_name: data.service_name,
  //     description: data.description,
  //     completion_time: data.completion_time,
  //     tools_needed: data.tools_needed?.split(",").map((t) => t.trim()) || [],
  //     skills_tags: data.skills_tags?.split(",").map((s) => s.trim()) || [],
  //     basePrice: data.basePrice,
  //     requirements: requirements,
  //     leader_required: leaderRequired,
  //   });
  //   setFinalRequirementsOrder(selectedDepartments);
  //   setOpenDialog(false);
  //   setOpenOrderDialog(true);
  // };
  const onSubmit = async (data) => {
    const requirements = selectedDepartments.map((dept) => ({
      department: dept,
      count: departmentCounts[dept] || 1,
    }));

    // Create FormData object to handle file upload
    const formData = new FormData();
    formData.append("service_name", data.service_name);
    formData.append("description", data.description);
    formData.append("completion_time", data.completion_time);
    formData.append(
      "tools_needed",
      data.tools_needed
        ?.split(",")
        .map((t) => t.trim())
        .join(",") || ""
    );
    formData.append(
      "skills_tags",
      data.skills_tags
        ?.split(",")
        .map((s) => s.trim())
        .join(",") || ""
    );
    formData.append("basePrice", data.basePrice);
    formData.append("requirements", JSON.stringify(requirements));
    formData.append("leader_required", leaderRequired);

    if (selectedServiceImage) {
      formData.append("servicePicture", selectedServiceImage);
    }

    setFormData(formData);
    setFinalRequirementsOrder(selectedDepartments);
    setOpenDialog(false);
    setOpenOrderDialog(true);
  };
  // const handleFinalSubmit = async () => {
  //   const orderedRequirements = finalRequirementsOrder.map((dept) => ({
  //     department: dept,
  //     count: departmentCounts[dept] || 1,
  //   }));

  //   const fullData = { ...formData, requirements: orderedRequirements };

  //   try {
  //     await addTemplate(fullData).unwrap();
  //     setSnackbarOpen(true);
  //     setOpenOrderDialog(false);
  //     refetch();
  //     reset();
  //     setSelectedDepartments([]);
  //     setDepartmentCounts({});
  //   } catch (error) {
  //     console.error("Error submitting template:", error);
  //   }
  // };
  const handleFinalSubmit = async () => {
    try {
      // No need to reconstruct the data, just use the FormData we already prepared
      await addTemplate(formData).unwrap();
      setSnackbarOpen(true);
      setOpenOrderDialog(false);
      refetch();
      reset();
      setSelectedDepartments([]);
      setDepartmentCounts({});
      setSelectedServiceImage(null);
      setServiceImagePreview(null);
    } catch (error) {
      console.error("Error submitting template:", error);
    }
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
    reset();
    setSelectedDepartments([]);
    setDepartmentCounts({});
  };

  const navigateToService = useCallback(
    (serviceId) => {
      router.push(`/manager/${id}/manageServices/${serviceId}`);
    },
    [router]
  );
  return (
    <Box sx={{ p: 4, bgcolor: "#f9fafb", minHeight: "100vh" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          color="text.primary"
          fontWeight="bold"
          sx={{
            color: (theme) => theme.palette.grey[800],
            letterSpacing: "-0.5px",
          }}
        >
          Services Catalog
        </Typography>
        <Zoom in={true}>
          <Button
            onClick={() => setOpenDialog(true)}
            variant="contained"
            color="primary"
            startIcon={<Plus size={20} />}
            sx={{
              boxShadow: 2,
              borderRadius: "8px",
              px: 3,
              py: 1,
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 600,
              "&:hover": {
                boxShadow: 4,
                backgroundColor: "#266296",
              },
              backgroundColor: "#4880b0",
            }}
          >
            New Service Template
          </Button>
        </Zoom>
      </Box>

      <Grid container spacing={3}>
        {(Array.isArray(allTemplates)
          ? allTemplates
          : allTemplates?.data || []
        ).map((template) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={template._id}>
            <Slide direction="up" in={true} timeout={300}>
              <ServiceCard
                onClick={(event) => {
                  event.stopPropagation();
                  navigateToService(template._id);
                }}
              >
                <CardActionArea sx={{ p: 2, flexGrow: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Typography
                      variant="h6"
                      fontWeight="600"
                      color="text.primary"
                      sx={{ lineHeight: 1.3 }}
                    >
                      {template.service_name}
                    </Typography>
                  </Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {template.description}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      gutterBottom
                      sx={{
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Requirements
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        mb: 1,
                      }}
                    >
                      {template.requirements.slice(0, 3).map((req) => (
                        <Chip
                          key={req._id}
                          label={`${req.department} (${req.count})`}
                          size="small"
                          sx={{
                            backgroundColor: (theme) => theme.palette.grey[200],
                            color: (theme) => theme.palette.grey[800],
                            fontSize: "0.7rem",
                          }}
                        />
                      ))}
                      {template.requirements.length > 3 && (
                        <Chip
                          label={`+${template.requirements.length - 3} more`}
                          size="small"
                          sx={{
                            backgroundColor: (theme) => theme.palette.grey[200],
                            color: (theme) => theme.palette.grey[800],
                            fontSize: "0.7rem",
                          }}
                        />
                      )}
                    </Box>
                  </Box>

                  <Box sx={{ mt: "auto" }}>
                    <Divider sx={{ mb: 1.5 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ fontSize: "0.75rem" }}
                      >
                        {template.completion_time}
                      </Typography>
                    </Box>
                  </Box>
                </CardActionArea>
                {/* <CardActions
                  sx={{
                    p: 0,
                    borderTop: (theme) =>
                      `1px solid ${theme.palette.grey[300]}`,
                  }}
                >
                  <Button
                    size="small"
                    startIcon={<Edit size={16} />}
                    sx={{
                      flex: 1,
                      color: (theme) => theme.palette.grey[700],
                      borderRadius: 0,
                      borderRight: (theme) =>
                        `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    startIcon={<Trash2 size={16} />}
                    sx={{
                      flex: 1,
                      color: (theme) => theme.palette.error.main,
                      borderRadius: 0,
                    }}
                  >
                    Delete
                  </Button>
                </CardActions> */}
              </ServiceCard>
            </Slide>
          </Grid>
        ))}
      </Grid>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
        TransitionComponent={Slide}
        transitionDuration={500}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitleStyled>
          <Plus size={24} style={{ marginRight: 12 }} />
          Create New Service Template
        </DialogTitleStyled>
        <DialogContent sx={{ p: 3, mt: 5 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <InputField
                fullWidth
                label="Service Name"
                {...register("service_name", {
                  required: "Service Name is required",
                })}
                error={!!errors.service_name}
                helperText={errors.service_name?.message}
                variant="outlined"
              />

              <InputField
                fullWidth
                label="Description"
                multiline
                rows={4}
                {...register("description", {
                  required: "Description is required",
                })}
                error={!!errors.description}
                helperText={errors.description?.message}
                variant="outlined"
              />

              <Box sx={{}}>
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  sx={{ fontWeight: 600 }}
                >
                  Service Image
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  {serviceImagePreview ? (
                    <Avatar
                      src={serviceImagePreview}
                      sx={{ width: 80, height: 80, borderRadius: 2 }}
                      variant="rounded"
                    />
                  ) : (
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        bgcolor: "grey.200",
                      }}
                      variant="rounded"
                    >
                      <PhotoCamera />
                    </Avatar>
                  )}
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<CloudUpload />}
                  >
                    Upload Image
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleServiceImageChange}
                    />
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <InputField
                fullWidth
                label="Completion Time (e.g., 2 days, 5 hours)"
                {...register("completion_time", {
                  required: "Completion Time is required",
                })}
                error={!!errors.completion_time}
                helperText={errors.completion_time?.message}
                variant="outlined"
              />
              <InputField
                fullWidth
                label="Tools Needed (comma separated)"
                {...register("tools_needed")}
                variant="outlined"
                helperText="Separate tools with commas"
              />

              <InputField
                fullWidth
                label="Skill Tags (comma separated)"
                {...register("skills_tags")}
                variant="outlined"
                helperText="Separate skills with commas"
              />

              <InputField
                fullWidth
                label="Baseprice of the service in INR"
                type="number"
                {...register("basePrice", {
                  required: "base price is requires",
                })}
                error={!!errors.basePrice}
                helperText={errors.basePrice?.message}
                variant="outlined"
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography
              variant="subtitle1"
              gutterBottom
              sx={{ fontWeight: 600 }}
            >
              Department Requirements
            </Typography>

            <Controller
              name="selectedDepartments"
              control={control}
              rules={{ required: "At least one department is required" }}
              render={({ field }) => (
                <Autocomplete
                  multiple
                  options={departments}
                  value={selectedDepartments}
                  onChange={handleDepartmentChange}
                  renderTags={() => null}
                  renderInput={(params) => (
                    <InputField
                      {...params}
                      label="Select Departments"
                      error={!!errors.selectedDepartments}
                      helperText={errors.selectedDepartments?.message}
                      variant="outlined"
                      placeholder="Search and select departments..."
                    />
                  )}
                />
              )}
            />

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                mt: 2,
                p: 2,
                borderRadius: "8px",
                backgroundColor: (theme) => theme.palette.grey[100],
              }}
            >
              {selectedDepartments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No departments selected yet
                </Typography>
              ) : (
                selectedDepartments.map((dept) => (
                  <Box
                    key={dept}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      mb: 1,
                      mr: 1,
                      p: 1,
                      borderRadius: "6px",
                      backgroundColor: (theme) => theme.palette.common.white,
                      border: (theme) => `1px solid ${theme.palette.grey[300]}`,
                    }}
                  >
                    <DepartmentBadge
                      label={dept}
                      onDelete={() => removeDepartment(dept)}
                    />
                    <CountInput
                      label="Count"
                      type="number"
                      value={departmentCounts[dept] || 1}
                      onChange={(e) => handleCountChange(dept, e.target.value)}
                      inputProps={{ min: 1 }}
                      size="small"
                    />
                  </Box>
                ))
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActionsStyled>
          <Button
            variant="outlined"
            onClick={handleCloseDialog}
            sx={{
              borderRadius: "6px",
              px: 3,
              py: 1,
              borderColor: (theme) => theme.palette.grey[400],
              color: (theme) => theme.palette.grey[700],
              "&:hover": {
                borderColor: (theme) => theme.palette.grey[600],
              },
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit(onSubmit)}
            disabled={selectedDepartments.length === 0}
            sx={{
              borderRadius: "6px",
              px: 3,
              py: 1,
              "&:disabled": {
                backgroundColor: (theme) => theme.palette.grey[300],
                color: (theme) => theme.palette.grey[500],
              },
            }}
          >
            Define WorkFlow
          </Button>
        </DialogActionsStyled>
      </Dialog>

      <Dialog
        open={openOrderDialog}
        onClose={() => setOpenOrderDialog(false)}
        fullWidth
        maxWidth="sm"
        TransitionComponent={Slide}
        transitionDuration={500}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            overflow: "hidden",
          },
        }}
      >
        <DialogTitleStyled>
          <GripVertical size={24} style={{ marginRight: 12 }} />
          Set Department Priority for WorkFlow
        </DialogTitleStyled>
        <DialogContent sx={{ mt: 2, p: 3 }}>
          <Typography variant="body2" color="text.secondary" mb={2}>
            Drag and drop to arrange departments in order of priority. The first
            department will be assigned first when creating teams.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: "8px",
              backgroundColor: (theme) => theme.palette.grey[100],
              border: (theme) => `1px dashed ${theme.palette.grey[400]}`,
            }}
          >
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={({ active, over }) => {
                if (active.id !== over?.id) {
                  const oldIndex = finalRequirementsOrder.indexOf(active.id);
                  const newIndex = finalRequirementsOrder.indexOf(over.id);
                  setFinalRequirementsOrder((items) =>
                    arrayMoveImmutable(items, oldIndex, newIndex)
                  );
                }
              }}
            >
              <SortableContext
                items={finalRequirementsOrder}
                strategy={verticalListSortingStrategy}
              >
                {finalRequirementsOrder.map((dept) => (
                  <SortableItem
                    key={dept}
                    id={dept}
                    label={`${dept} (${departmentCounts[dept] || 1} required)`}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Box>
        </DialogContent>
        <DialogActionsStyled>
          <Button
            variant="outlined"
            onClick={() => {
              setOpenOrderDialog(false);
              setOpenDialog(true);
            }}
            sx={{
              borderRadius: "6px",
              px: 3,
              py: 1,
              borderColor: (theme) => theme.palette.grey[400],
              color: (theme) => theme.palette.grey[700],
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleFinalSubmit}
            disabled={isSubmitting}
            startIcon={<Check size={18} />}
            sx={{
              borderRadius: "6px",
              px: 3,
              py: 1,
              "&:disabled": {
                backgroundColor: (theme) => theme.palette.grey[300],
                color: (theme) => theme.palette.grey[500],
              },
            }}
          >
            {isSubmitting ? "Saving..." : "Save Template"}
          </Button>
        </DialogActionsStyled>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        message="Service template added successfully!"
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => setSnackbarOpen(false)}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        ContentProps={{
          sx: {
            backgroundColor: (theme) => theme.palette.grey[800],
            color: (theme) => theme.palette.common.white,
            borderRadius: "8px",
          },
        }}
      />
      {/* <Department /> */}
    </Box>
  );
};

export default Page;
