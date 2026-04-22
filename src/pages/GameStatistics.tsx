/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stack,
  CircularProgress,
  useTheme,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { getAllGameData, getWorldStatistics } from "../services/gameStats";

const GameStatistics = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [gameData, setGameData] = useState<any[]>([]);
  const [worlds, setWorlds] = useState<string[]>([]);
  const [selectedWorld, setSelectedWorld] = useState<string>("");
  const [worldStats, setWorldStats] = useState<any>(null);

  // Fetch all game data and worlds
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const allData = await getAllGameData();
      setGameData(allData);
      const uniqueWorlds = Array.from(
        new Set(allData.map((d: any) => d.world))
      );
      setWorlds(uniqueWorlds);
      setSelectedWorld(uniqueWorlds[0] || "");
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fetch world stats when selectedWorld changes
  useEffect(() => {
    if (!selectedWorld) return;
    setWorldStats(null);
    getWorldStatistics(selectedWorld).then(setWorldStats);
  }, [selectedWorld]);

  // Overall stats
  const totalGames = gameData.length;
  const uniquePlayers = new Set(gameData.map((d: any) => d.user_id)).size;
  const avgStars = totalGames
    ? (
        gameData.reduce((sum: number, d: any) => sum + d.stars, 0) / totalGames
      ).toFixed(2)
    : 0;
  const avgNeurons = totalGames
    ? (
        gameData.reduce((sum: number, d: any) => sum + d.neurons, 0) /
        totalGames
      ).toFixed(2)
    : 0;

  if (loading) {
    return (
      <Box sx={{ p: { xs: 1, md: 3 }, maxHeight: "100%", overflowY: "auto" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (gameData.length === 0) {
    return (
      <Box
        sx={{
          p: { xs: 1, md: 3 },
          maxHeight: "100%",
          overflowY: "auto",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Game Statistics
        </Typography>
        <Paper elevation={3} sx={{ p: 6, mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No game data available yet
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            Statistics will appear here once players start playing the game.
          </Typography>
        </Paper>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        p: { xs: 1, md: 3 },
        maxHeight: "100%",
        overflowY: "auto",
        scrollbarColor: theme.palette.scrollbarColor,
        scrollbarWidth: "thin",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Game Statistics
      </Typography>

      <Stack spacing={3}>
        {/* Overall Summary */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Overall Summary
          </Typography>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Games
              </Typography>
              <Typography variant="h5">{totalGames}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Unique Players
              </Typography>
              <Typography variant="h5">{uniquePlayers}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Stars
              </Typography>
              <Typography variant="h5">{avgStars}</Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                Average Neurons
              </Typography>
              <Typography variant="h5">{avgNeurons}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Answers Statistics */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Answers Statistics (All Worlds)
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Stack direction={{ sm: "row" }} spacing={4} flex={1}>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Correct
                </Typography>
                <Typography variant="h5">
                  {gameData.reduce((sum: number, d: any) => sum + d.correct, 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Incorrect
                </Typography>
                <Typography variant="h5">
                  {gameData.reduce(
                    (sum: number, d: any) => sum + d.incorrect,
                    0
                  )}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Skipped
                </Typography>
                <Typography variant="h5">
                  {gameData.reduce((sum: number, d: any) => sum + d.skipped, 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Missed
                </Typography>
                <Typography variant="h5">
                  {gameData.reduce((sum: number, d: any) => sum + d.missed, 0)}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Overall Accuracy
                </Typography>
                <Typography variant="h5">
                  {(
                    (gameData.reduce(
                      (sum: number, d: any) => sum + d.correct,
                      0
                    ) /
                      (gameData.reduce(
                        (sum: number, d: any) => sum + d.correct,
                        0
                      ) +
                        gameData.reduce(
                          (sum: number, d: any) => sum + d.incorrect,
                          0
                        ) +
                        gameData.reduce(
                          (sum: number, d: any) => sum + d.missed,
                          0
                        )) || 0) * 100
                  ).toFixed(2)}
                  %
                </Typography>
              </Box>
            </Stack>

            {/* Chart: Answers Distribution (%) */}
            <Box
              sx={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                flexDirection: "column",
              }}
            >
              <Typography variant="subtitle1">
                Answers Distribution (%)
              </Typography>
              {(() => {
                const totalAnswers =
                  gameData.reduce(
                    (sum: number, d: any) =>
                      sum + d.correct + d.incorrect + d.skipped + d.missed,
                    0
                  ) || 1;
                const correct = gameData.reduce(
                  (sum: number, d: any) => sum + d.correct,
                  0
                );
                const incorrect = gameData.reduce(
                  (sum: number, d: any) => sum + d.incorrect,
                  0
                );
                const skipped = gameData.reduce(
                  (sum: number, d: any) => sum + d.skipped,
                  0
                );
                const missed = gameData.reduce(
                  (sum: number, d: any) => sum + d.missed,
                  0
                );
                const data = [correct, incorrect, skipped, missed].map(
                  (v) => (v / totalAnswers) * 100
                );
                return (
                  <BarChart
                    xAxis={[
                      {
                        data: ["Correct", "Incorrect", "Skipped", "Missed"],
                        scaleType: "band",
                      },
                    ]}
                    yAxis={[
                      {
                        min: 0,
                        max: 100,
                        tickInterval: "auto",
                        valueFormatter: (value: number) => `${value}%`,
                      },
                    ]}
                    series={[
                      {
                        data: data.map((v) => parseFloat(v.toFixed(2))),
                        color: theme.palette.primary.main,
                      },
                    ]}
                    height={320}
                  />
                );
              })()}
            </Box>
          </Box>
        </Paper>

        {/* World-specific Statistics */}
        <Paper elevation={3} sx={{ p: 3 }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6">World Statistics</Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel id="world-select-label">World</InputLabel>
              <Select
                labelId="world-select-label"
                value={selectedWorld}
                label="World"
                onChange={(e) => setSelectedWorld(e.target.value)}
              >
                {worlds.map((w) => (
                  <MenuItem key={w} value={w}>
                    {w.replace(/_/g, " ").charAt(0).toUpperCase() +
                      w.replace(/_/g, " ").slice(1)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
          <Divider sx={{ my: 2 }} />
          {worldStats ? (
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Entries
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.totalEntries}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Unique Players
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.uniquePlayers}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Accuracy
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.answers.accuracy.toFixed(2)}%
                  </Typography>
                </Box>
              </Stack>
              {/* Answers Statistics for World */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Correct
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.answers.correct.total}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Incorrect
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.answers.incorrect.total}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Skipped
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.answers.skipped.total}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Missed
                  </Typography>
                  <Typography variant="h6">
                    {worldStats.answers.missed.total}
                  </Typography>
                </Box>
              </Stack>
              {/* Chart: Answers Distribution for World */}
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>
                  Answers Distribution (%)
                </Typography>
                {(() => {
                  const totalAnswers =
                    worldStats.answers.correct.total +
                      worldStats.answers.incorrect.total +
                      worldStats.answers.skipped.total +
                      worldStats.answers.missed.total || 1;
                  const data = [
                    worldStats.answers.correct.total,
                    worldStats.answers.incorrect.total,
                    worldStats.answers.skipped.total,
                    worldStats.answers.missed.total,
                  ].map((v) => (v / totalAnswers) * 100);
                  return (
                    <BarChart
                      xAxis={[
                        {
                          data: ["Correct", "Incorrect", "Skipped", "Missed"],
                          scaleType: "band",
                        },
                      ]}
                      yAxis={[
                        {
                          min: 0,
                          max: 100,
                          tickInterval: "auto",
                          valueFormatter: (value: number) => `${value}%`,
                        },
                      ]}
                      series={[
                        {
                          data: data.map((v) => parseFloat(v.toFixed(2))),
                          color: theme.palette.primary.main,
                        },
                      ]}
                      width={400}
                      height={220}
                    />
                  );
                })()}
              </Box>
            </Stack>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
              <CircularProgress size={32} />
            </Box>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};

export default GameStatistics;
