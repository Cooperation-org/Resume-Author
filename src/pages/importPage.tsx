import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";

const InnerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "#FFFFFF",
  justifyContent: "space-between",
  paddingTop: "100px",
  width: "100%",
}));

const Section = styled(Box)(({ theme }) => ({
  width: 280,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "12px",
  borderRadius: 10,
  border: "1px solid #2563EB",
  paddingTop: 30,
  paddingBottom: 30,
  boxShadow: "none",
  minHeight: 160,
  cursor: "pointer",
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: "10px 15px",
  display: "flex",
  alignItems: "center",
  borderRadius: 50,
  justifyContent: "center",
  backgroundColor: "#6B79F6",
  "&:hover": {
    backgroundColor: "#5A68E6",
  },
  color: "#FFFFFF",
  marginTop: "10px",
}));

export default function ImportPage(props: any) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#FFFFFF",
        height: "100vh",
      }}
    >
      <InnerContainer>
        <Typography
          variant="h4"
          sx={{
            color: "#07142B",
            textAlign: "center",
            mb: 8,
          }}
        >
          Where do you want to import from?
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: "30px",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            mb: { xs: "30px", md: 0 },
          }}
        >
          <Section sx={{ width: { xs: "280px", md: "430px" } }}>
            <Typography
              variant="h6"
              sx={{ color: "#07142B", fontWeight: "bold" }}
            >
              Choose an existing resume
            </Typography>
            <Box
              component="img"
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3931be67-58fb-4780-bc18-f60c628f1a4a"
              sx={{
                height: 44,
                marginX: "auto",
                objectFit: "fill",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "#1F2937" }}>
                  Drop your file here or
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "#2563EB", cursor: "pointer" }}
                >
                  browse
                </Typography>
              </Box>
              <Typography
                variant="caption"
                sx={{ color: "#9CA3AF", textAlign: "center", marginX: 12 }}
              >
                Maximum size: 50MB
              </Typography>
            </Box>
          </Section>

          <Section sx={{ width: { xs: "280px", md: "430px" } }}>
            <Typography
              variant="h6"
              sx={{ color: "#07142B", fontWeight: "bold" }}
            >
              Import LinkedIn profile
            </Typography>
            <Box
              component="img"
              src="https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/3931be67-58fb-4780-bc18-f60c628f1a4a"
              sx={{
                height: 53,
                marginX: "auto",
                objectFit: "fill",
              }}
            />
            <Typography
              variant="body2"
              sx={{ color: "#1F2937", textAlign: "center" }}
            >
              Must have a LinkedIn account
            </Typography>
          </Section>
        </Box>
      </InnerContainer>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          backgroundColor: "#FFFFFF",
          boxShadow: "4px -4px 10px #1456FF40",
          pr: "20px",
          pb: "10px",
        }}
      >
        <StyledButton onClick={() => alert("Pressed!")}>Continue</StyledButton>
      </Box>
    </Box>
  );
}
