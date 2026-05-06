import {
  Box,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import CompanyCard from "./CompanyCard";

const Header = ({ companies, filters, onFilterChange }) => {
  const totalCompanies = companies.length;
  const hiringCount = companies.filter((c) => c.isHiring).length;
  const industries = [...new Set(companies.map((c) => c.industry))];
  const locations = [...new Set(companies.map((c) => c.location))];

  return (
    <Box>
      {/* Title */}
      <Box sx={{ mb: 2.5 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1a202c" }}>
          🏢 Companies Directory
        </Typography>
        <Typography variant="body2" sx={{ color: "#718096", mt: 0.5 }}>
          Browse and filter companies across industries
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mb: 2.5 }}>
        <CompanyCard icon="🏢" label="Total Companies" value={totalCompanies} accent="#4299e1" />
        <CompanyCard icon="✅" label="Actively Hiring" value={hiringCount} accent="#48bb78" />
        <CompanyCard icon="🏭" label="Industries" value={industries.length} accent="#ed8936" />
        <CompanyCard icon="📍" label="Locations" value={locations.length} accent="#9f7aea" />
      </Box>

      <Divider sx={{ mb: 2.5 }} />

      {/* Filter Controls */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "2fr 1fr 1fr 1fr auto" },
          gap: 1.5,
          alignItems: "flex-end",
        }}
      >
        {/* Search by Name */}
        <TextField
          label="Search Name"
          placeholder="e.g. TechNova..."
          size="small"
          value={filters.name}
          onChange={(e) => onFilterChange("name", e.target.value)}
          fullWidth
        />

        {/* Industry */}
        <FormControl size="small" fullWidth>
          <InputLabel>Industry</InputLabel>
          <Select
            label="Industry"
            value={filters.industry}
            onChange={(e) => onFilterChange("industry", e.target.value)}
          >
            <MenuItem value="">All Industries</MenuItem>
            {industries.map((ind) => (
              <MenuItem key={ind} value={ind}>{ind}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Location */}
        <FormControl size="small" fullWidth>
          <InputLabel>Location</InputLabel>
          <Select
            label="Location"
            value={filters.location}
            onChange={(e) => onFilterChange("location", e.target.value)}
          >
            <MenuItem value="">All Locations</MenuItem>
            {locations.map((loc) => (
              <MenuItem key={loc} value={loc}>{loc}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Hiring Status */}
        <FormControl size="small" fullWidth>
          <InputLabel>Hiring</InputLabel>
          <Select
            label="Hiring"
            value={filters.isHiring}
            onChange={(e) => onFilterChange("isHiring", e.target.value)}
          >
            <MenuItem value="">Any Status</MenuItem>
            <MenuItem value="true">Hiring</MenuItem>
            <MenuItem value="false">Not Hiring</MenuItem>
          </Select>
        </FormControl>

        {/* Reset Button */}
        <Button
          variant="outlined"
          color="error"
          size="medium"
          onClick={() => onFilterChange("reset")}
          sx={{ whiteSpace: "nowrap", height: 40 }}
        >
          ✕ Reset
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
