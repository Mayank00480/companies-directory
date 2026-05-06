import {
  Box,
  Button,

  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,

} from "@mui/material";

const Header = ({ companies, filters, onFilterChange }) => {
  const industries = [...new Set(companies.map((c) => c.industry))];
  const locations = [...new Set(companies.map((c) => c.location))];

  return (
    <Box>
     
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
          label="Search by Company Name"
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
