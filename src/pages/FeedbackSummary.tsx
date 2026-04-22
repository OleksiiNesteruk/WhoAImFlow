import { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Rating,
  LinearProgress,
  Stack,
  Divider,
  Paper,
  Typography,
} from "@mui/material";
import { getFeedbacks } from "../services/appwrite";

const FeedbackSummary = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalFeedbacks: 0,
    ratingDistribution: [0, 0, 0, 0, 0, 0],
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await getFeedbacks();

        if (data.length > 0) {
          const totalFeedbacks = data.length;

          const sum = data.reduce((acc, feedback) => acc + feedback.rating, 0);
          const averageRating = sum / totalFeedbacks;

          const distribution = [0, 0, 0, 0, 0, 0]; // For ratings 0-5
          data.forEach((feedback) => {
            const ratingIndex = Math.round(feedback.rating);
            if (ratingIndex >= 0 && ratingIndex <= 5) {
              distribution[ratingIndex]++;
            }
          });

          setStats({
            averageRating,
            totalFeedbacks,
            ratingDistribution: distribution,
          });
        }
      } catch (error) {
        console.error("Error loading summary data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
        gap: 3,
      }}
    >
      {/* Summary Statistics */}
      <Paper
        elevation={3}
        sx={{
          p: 3,
          height: "100%",
        }}
      >
        <Typography variant="h6" gutterBottom>
          Feedback Summary
        </Typography>
        <Box
          sx={{
            my: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Average Rating
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", my: 1 }}>
            <Typography variant="h3" component="div" sx={{ mr: 1 }}>
              {stats.averageRating.toFixed(1)}
            </Typography>
            <Rating value={stats.averageRating} readOnly precision={0.5} />
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Total Feedbacks
        </Typography>
        <Typography variant="h4" component="div" align="center">
          {stats.totalFeedbacks}
        </Typography>
      </Paper>

      {/* Rating Distribution */}
      <Paper elevation={3} sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" gutterBottom>
          Rating Distribution
        </Typography>
        <Stack spacing={2} sx={{ mt: 3 }}>
          {[5, 4, 3, 2, 1, 0].map((rating) => {
            const count = stats.ratingDistribution[rating] || 0;
            const percentage =
              stats.totalFeedbacks > 0
                ? (count / stats.totalFeedbacks) * 100
                : 0;

            return (
              <Box key={rating} sx={{ display: "flex", alignItems: "center" }}>
                <Box sx={{ minWidth: 40 }}>
                  <Typography variant="body2">{rating} ★</Typography>
                </Box>
                <Box sx={{ width: "100%", ml: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      bgcolor: "grey.200",
                    }}
                  />
                </Box>
                <Box sx={{ minWidth: 60 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    align="right"
                  >
                    {count} ({percentage.toFixed(0)}%)
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Paper>
    </Box>
  );
};

export default FeedbackSummary;
