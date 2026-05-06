import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Link,
  Paper,
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

const Body = () => {
  const [companies, setCompanies] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    industry: "",
    location: "",
    isHiring: "",
  });
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const sentinelRef = useRef(null);

  useEffect(() => {
    fetch("/data/companies.json")
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

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

  // Load next page when sentinel enters the viewport
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8", py: 4, px: 3 }}>
      <Paper
        elevation={2}
        sx={{ maxWidth: 1200, mx: "auto", borderRadius: "16px", overflow: "hidden" }}
      >
        {/* Card Header */}
        <Box sx={{ px: 4, py: 3.5, borderBottom: "1px solid #e2e8f0", bgcolor: "#fff" }}>
          <Header
            companies={companies}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
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
          <Typography variant="body2" sx={{ color: "#718096" }}>
            Showing{" "}
            <Box component="strong" sx={{ color: "#2d3748" }}>
              {visibleRows.length}
            </Box>{" "}
            of{" "}
            <Box component="strong" sx={{ color: "#2d3748" }}>
              {filtered.length}
            </Box>{" "}
            companies
          </Typography>
          {hasMore && (
            <Typography variant="body2" sx={{ color: "#a0aec0", fontSize: "12px" }}>
              Scroll down to load more
            </Typography>
          )}
        </Box>

        {/* Table */}
        <TableContainer>
          <Table>
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
              {visibleRows.length > 0 ? (
                visibleRows.map((company, index) => (
                  <TableRow
                    key={company.id}
                    sx={{
                      bgcolor: index % 2 === 0 ? "#fff" : "#fafbfc",
                      "&:hover": { bgcolor: "#f0f7ff" },
                      transition: "background 0.15s",
                    }}
                  >
                    <TableCell sx={{ color: "#a0aec0", fontSize: "13px" }}>
                      {company.id}
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: "#1a202c" }}>
                      {company.name}
                    </TableCell>
                    <TableCell>{company.location}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.industry}
                        size="small"
                        sx={{
                          bgcolor: "#ebf8ff",
                          color: "#2b6cb0",
                          fontWeight: 600,
                          fontSize: "12px",
                          border: "none",
                        }}
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
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={COLUMNS.length}
                    align="center"
                    sx={{ py: 6, color: "#a0aec0", fontSize: "15px" }}
                  >
                    😕 No companies match your filters.
                  </TableCell>
                </TableRow>
              )}

              {/* Loading row shown while more items exist */}
              {hasMore && (
                <TableRow>
                  <TableCell colSpan={COLUMNS.length} align="center" sx={{ py: 2, border: 0 }}>
                    <CircularProgress size={22} thickness={4} sx={{ color: "#4299e1" }} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Invisible sentinel — IntersectionObserver watches this */}
        <Box ref={sentinelRef} sx={{ height: 1 }} />

        {/* End of list message */}
        {!hasMore && filtered.length > 0 && (
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
