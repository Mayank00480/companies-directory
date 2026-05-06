import { Box, Typography } from "@mui/material";

const CompanyCard = ({ icon, label, value, accent }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderLeft: `4px solid ${accent}`,
        borderRadius: "10px",
        px: 2.5,
        py: 1.75,
        minWidth: 140,
        flex: 1,
      }}
    >
      <Box
        sx={{
          fontSize: "22px",
          lineHeight: 1,
          background: `${accent}18`,
          borderRadius: "8px",
          p: 1,
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography
          variant="h5"
          sx={{ fontWeight: 700, color: "#1a202c", lineHeight: 1 }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: "#718096", mt: 0.5, fontSize: "12px" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

export default CompanyCard;
