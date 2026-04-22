import { useState, useEffect, useCallback } from "react";
import {
  DataGrid,
  GridColDef,
  GridSortModel,
  GridRenderCellParams,
} from "@mui/x-data-grid";
import {
  Box,
  TextField,
  Typography,
  Rating,
  Slider,
  Stack,
  Chip,
  useTheme,
} from "@mui/material";
import { format } from "date-fns";
import { Feedback, getFilteredFeedbacks } from "../services/appwrite";

const FeedbackTable = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [sortModel, setSortModel] = useState<GridSortModel>([
    {
      field: "created_at",
      sort: "desc",
    },
  ]);
  const theme = useTheme();

  // Function to load feedbacks with current filters
  const loadFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const sortField = sortModel[0]?.field || "created_at";
      const sortDirection = sortModel[0]?.sort || "desc";

      const data = await getFilteredFeedbacks(
        searchTerm,
        sortField,
        sortDirection as "asc" | "desc",
        ratingRange[0],
        ratingRange[1]
      );

      setFeedbacks(data);
    } catch (error) {
      console.error("Error loading feedbacks:", error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, ratingRange, sortModel]);

  useEffect(() => {
    loadFeedbacks();
  }, [loadFeedbacks]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRatingChange = (_event: Event, newValue: number | number[]) => {
    setRatingRange(newValue as [number, number]);
  };

  const columns: GridColDef[] = [
    {
      field: "rating",
      headerName: "Rating",
      width: 160,
      renderCell: (params: GridRenderCellParams<Feedback>) => (
        <Rating
          name="read-only"
          value={params.value as number}
          readOnly
          precision={0.5}
        />
      ),
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
    },
    {
      field: "message",
      headerName: "Feedback",
      flex: 1,
    },
    {
      field: "created_at",
      headerName: "Date",
      minWidth: 180,
      renderCell: (params: GridRenderCellParams<Feedback>) => {
        const dateValue = params.row.created_at;
        if (dateValue) {
          return format(new Date(dateValue), "PPP p");
        }
        return "";
      },
    },
    {
      field: "user_id",
      headerName: "User ID",
      width: 220,
      renderCell: (params: GridRenderCellParams<Feedback>) => (
        <Chip
          label={`${(params.value as string).substring(0, 8)}...`}
          variant="outlined"
          size="small"
          title={params.value as string}
        />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
      }}
    >
      {/* Fixed header section with title and filters */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h5"
            component="h2"
            sx={{
              m: 0,
              flexBasis: "auto",
              flexGrow: 0,
            }}
          >
            Feedback Analysis
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "flex-end" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Search field with proper width */}
          <Box sx={{ width: { xs: "100%", md: "350px" } }}>
            <TextField
              label="Search Feedback"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              size="small"
              fullWidth
            />
          </Box>

          {/* Rating Range */}
          <Box
            sx={{
              width: { xs: "100%", md: "250px" },
            }}
          >
            <Typography
              id="rating-slider"
              variant="body2"
              color="text.secondary"
              sx={{ mb: 1, fontWeight: "medium" }}
            >
              Filter by Rating
            </Typography>
            <Slider
              value={ratingRange}
              onChange={handleRatingChange}
              valueLabelDisplay="auto"
              min={0}
              max={5}
              step={1}
              marks
              aria-labelledby="rating-slider"
              sx={{
                "& .MuiSlider-markLabel": {
                  fontSize: "0.75rem",
                },
                color: "primary.main",
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* DataGrid container */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          overflow: "hidden",
          scrollbarColor: theme.palette.scrollbarColor,
          scrollbarWidth: "thin",
        }}
      >
        <DataGrid
          rows={feedbacks}
          columns={columns}
          getRowId={(row) => row.$id}
          loading={loading}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          disableRowSelectionOnClick
          slots={{
            noRowsOverlay: () => (
              <Stack height="100%" alignItems="center" justifyContent="center">
                <Typography variant="body1" color="text.secondary">
                  No feedback entries found. Try adjusting your search filters.
                </Typography>
              </Stack>
            ),
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 25 } },
          }}
          pageSizeOptions={[5, 10, 25, 50]}
          sx={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Box>
  );
};

export default FeedbackTable;
