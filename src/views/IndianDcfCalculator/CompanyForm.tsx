import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
});

const CompanyForm = ({
  companyName,
  updateCompanyTicker,
  handleVerify,
  companyData,
  isValidCompany,
  fetchCashFlows,
}) => {
  return (
    <Card className="company-input">
      <CardContent>
        <Stack direction="column" spacing={2} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              id="company-name-input"
              placeholder="Enter Company Name"
              label="Company Name"
              variant="outlined"
              value={companyName}
              onChange={updateCompanyTicker}
              style={{ padding: "0.5rem" }}
              className="company-text-input"
            />
            <Button variant="outlined" onClick={handleVerify}>
              Verify Company Name
            </Button>
          </Stack>
          <Stack direction="row" spacing={2} alignItems="center">
            {companyData && (
              <>
                <StyledChip
                  label={companyData.name}
                  color="primary"
                  variant="outlined"
                />
                <span>
                  Verified{" "}
                  <CheckCircleIcon sx={{ color: "green", fontSize: 16 }} />
                </span>
              </>
            )}
          </Stack>
          {companyData && (
            <Button
              variant="contained"
              color="info"
              onClick={fetchCashFlows}
              disabled={!isValidCompany}
            >
              Fetch Cash Flows (5 yr)
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
