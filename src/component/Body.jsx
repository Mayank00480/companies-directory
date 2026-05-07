import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Link,
  Paper,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Header from "./Header";

const COLUMNS = ["#", "Name", "Location", "Industry", "Founded", "Employees", "Website", "Hiring"];
const PAGE_SIZE = 10;
const SKELETON_ROWS = 8;

// ── Skeleton row shown while data is loading ──────────────────────────────────
const SkeletonRow = () => (
  <TableRow>
    {COLUMNS.map((col) => (
      <TableCell key={col}>
        <Skeleton
          variant="rectangular"
          height={20}
          sx={{ borderRadius: "6px", bgcolor: "#edf2f7" }}
          animation="wave"
        />
      </TableCell>
    ))}
  </TableRow>
);

const Body = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    name: "",
    industry: "",
    location: "",
    isHiring: "",
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);
  const tableContainerRef = useRef(null);

  const fetchCompanies = useCallback(() => {
    setLoading(true);
    setError(null);

    fetch("/data/companies.json")
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to load data (HTTP ${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (!Array.isArray(data)) throw new Error("Unexpected data format received.");
        setCompanies(data);
        setVisibleCount(PAGE_SIZE);
      })
      .catch((err) => {
        setError(err.message || "Something went wrong. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleFilterChange = (key, value) => {
    if (key === "reset") {
      setFilters({ name: "", industry: "", location: "", isHiring: "" });
    } else {
      setFilters((prev) => ({ ...prev, [key]: value }));
    }
    setVisibleCount(PAGE_SIZE);
  };

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchName = c.name.toLowerCase().includes(filters.name.toLowerCase());
      const matchIndustry = filters.industry ? c.industry === filters.industry : true;
      const matchLocation = filters.location ? c.location === filters.location : true;
      const matchHiring =
        filters.isHiring !== "" ? String(c.isHiring) === filters.isHiring : true;
      return matchName && matchIndustry && matchLocation && matchHiring;
    });
  }, [companies, filters]);

  const visibleRows = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = tableContainerRef.current;
    if (!sentinel || !container) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) loadMore();
      },
      { threshold: 0.1, root: container }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  // ── Full-page error state ────────────────────────────────────────────────────
  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f0f4f8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Paper
          elevation={2}
          sx={{
            borderRadius: "16px",
            p: 5,
            textAlign: "center",
            maxWidth: 480,
            width: "100%",
          }}
        >
          <Typography fontSize="52px" lineHeight={1} mb={2}>⚠️</Typography>
          <Typography variant="h6" fontWeight={700} color="#1a202c" mb={1}>
            Failed to Load Data
          </Typography>
          <Alert
            severity="error"
            sx={{ mb: 3, textAlign: "left", borderRadius: "10px" }}
          >
            {error}
          </Alert>
          <Button
            variant="contained"
            onClick={fetchCompanies}
            sx={{
              bgcolor: "#4299e1",
              borderRadius: "8px",
              px: 4,
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { bgcolor: "#3182ce" },
            }}
          >
            🔄 Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8", py: 4, px: 3 }}>
      <Paper
        elevation={2}
        sx={{ maxWidth: 1200, mx: "auto", borderRadius: "16px", overflow: "hidden" }}
      >
        {/* Card Header — disabled while loading */}
        <Box sx={{ px: 4, py: 3.5, borderBottom: "1px solid #e2e8f0", bgcolor: "#fff" }}>
          {loading ? (
           <Box sx={{ display: "flex", gap: 1.5 }}>
           {[2, 1, 1, 1, 0.4].map((flex, i) => (
             <Skeleton key={i} variant="rectangular" height={40} sx={{ flex, borderRadius: "8px" }} animation="wave" />
           ))}
         </Box>
          ) : (
            <Header
              companies={companies}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}
        </Box>

        {/* Results Count Bar */}
        <Box
          sx={{
            px: 4,
            py: 1.5,
            bgcolor: "#fafbfc",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {loading ? (
            <Skeleton variant="text" width={180} height={20} animation="wave" />
          ) : (
            <>
              <Typography variant="body2" sx={{ color: "#718096" }}>
                Showing{" "}
                <Box component="strong" sx={{ color: "#2d3748" }}>{visibleRows.length}</Box>
                {" "}of{" "}
                <Box component="strong" sx={{ color: "#2d3748" }}>{filtered.length}</Box>
                {" "}companies
              </Typography>
              {hasMore && (
                <Typography variant="body2" sx={{ color: "#a0aec0", fontSize: "12px" }}>
                  Scroll down to load more
                </Typography>
              )}
            </>
          )}
        </Box>

        {/* Table */}
        <TableContainer
          ref={tableContainerRef}
          sx={{
            maxHeight: "69vh",
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "10px",
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#e9eef4",
              borderRadius: "100px",
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#8a96a3",
              borderRadius: "100px",
              border: "2px solid #e9eef4",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              bgcolor: "#5a6470",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {COLUMNS.map((col) => (
                  <TableCell
                    key={col}
                    sx={{
                      bgcolor: "#f8fafc",
                      fontWeight: 600,
                      fontSize: "13px",
                      color: "#718096",
                      borderBottom: "1px solid #e2e8f0",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {col}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {/* ── Loading: skeleton rows ── */}
              {loading &&
                Array.from({ length: SKELETON_ROWS }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))
              }

              {/* ── Loaded: data rows ── */}
              {!loading && visibleRows.length > 0 &&
                visibleRows.map((company, index) => (
                  <TableRow
                    key={company.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#fff" : "#fafbfc",
                      "&:hover": { bgcolor: "#f0f7ff" },
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell sx={{ color: "#a0aec0", fontSize: "13px" }}>{company.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1a202c" }}>{company.name}</TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.industry}
                        size="small"
                        sx={{ bgcolor: "#ebf8ff", color: "#2b6cb0", fontWeight: 600, fontSize: "12px", border: "none" }}
                      />
                    </TableCell>
                    <TableCell>{company.founded}</TableCell>
                    <TableCell>{company.employees.toLocaleString()}</TableCell>
                    <TableCell>
                      <Link
                        href={company.website}
                        target="_blank"
                        rel="noreferrer"
                        underline="hover"
                        sx={{ color: "#4299e1", fontSize: "13px" }}
                      >
                        {company.website.replace("https://", "")}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={company.isHiring ? "✅ Hiring" : "❌ Not Hiring"}
                        size="small"
                        sx={{
                          bgcolor: company.isHiring ? "#f0fff4" : "#fff5f5",
                          color: company.isHiring ? "#276749" : "#c53030",
                          fontWeight: 600,
                          fontSize: "12px",
                          border: "none",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              }

              {/* ── Empty: no results after filtering ── */}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                    <Typography fontSize="40px">🔍</Typography>
                    <Typography variant="body1" fontWeight={600} color="#2d3748" mt={1}>
                      No companies found
                    </Typography>
                    <Typography variant="body2" color="#a0aec0" mt={0.5}>
                      Try adjusting your filters or search term.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {/* ── Infinite scroll: spinner row ── */}
              {!loading && hasMore && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 2, border: 0 }}>
                    <CircularProgress size={22} thickness={4} sx={{ color: "#4299e1" }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Infinite scroll sentinel — must be inside the scrollable container */}
          <Box ref={sentinelRef} sx={{ height: 1 }} />
        </TableContainer>

        {/* End of list */}
        {!loading && !hasMore && filtered.length > 0 && (
          <Box sx={{ py: 2, textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#a0aec0" }}>
              ✅ All {filtered.length} companies loaded
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Body;
