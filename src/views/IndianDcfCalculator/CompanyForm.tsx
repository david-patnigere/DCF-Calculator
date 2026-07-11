import {
  Card,
  CardContent,
  TextField,
  Autocomplete,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import UploadModal from "./UploadModal";

const StyledChip = styled(Chip)({
  padding: "1rem",
  margin: "10px",
});

const CompanyForm = ({
  companyName,
  updateCompanyTicker,
  handleVerify,
  companyData,
  companyList,
  isValidCompany,
  fetchFinancialData,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const normalizedCompanyList = Array.isArray(companyList) ? companyList : [];
  const trimmedInput = (companyName || "").trim();
  const shouldShowSuggestions = trimmedInput.length >= 3;
  const filteredCompanyList = shouldShowSuggestions
    ? normalizedCompanyList.filter((option) =>
        option.toLowerCase().includes(trimmedInput.toLowerCase()),
      )
    : [];

  const handleCompanySelection = (_event, newValue) => {
    updateCompanyTicker(newValue ?? "");
  };

  const handleCompanyInputChange = (_event, newInputValue) => {
    updateCompanyTicker(newInputValue);
  };

  const handleCompanyBlur = () => {
    const isValidSelection = normalizedCompanyList.some(
      (option) => option.toLowerCase() === trimmedInput.toLowerCase(),
    );

    if (!isValidSelection && trimmedInput.length >= 3) {
      updateCompanyTicker("");
    }
  };

  console.log(companyData);
  console.log("Company List count: " + companyList?.length);
  const openUploadModal = () => {
    // Implement modal opening logic here
    setIsModalOpen(true);
  };

  return (
    <Card className="company-input">
      <CardContent>
        <Stack direction="column" spacing={2} alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <Autocomplete
              id="company-name-input"
              disableClearable
              options={filteredCompanyList}
              inputValue={companyName}
              onInputChange={handleCompanyInputChange}
              onChange={handleCompanySelection}
              onBlur={handleCompanyBlur}
              isOptionEqualToValue={(option, value) =>
                option.toLowerCase() === value.toLowerCase()
              }
              getOptionLabel={(option) => option}
              filterOptions={(options) => options}
              noOptionsText={
                trimmedInput.length >= 3
                  ? "No matching companies"
                  : "Type at least 3 characters"
              }
              sx={{ width: "80%", minWidth: "200px", maxWidth: "400px" }}
              className="company-text-input"
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Enter Company Name"
                  label="Company Name"
                  variant="outlined"
                  style={{ padding: "0.5rem" }}
                />
              )}
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
            <>
              <Button
                variant="contained"
                color="info"
                onClick={fetchFinancialData}
                disabled={!isValidCompany}
              >
                Fetch Financial Data (5 yr)
              </Button>
              <span>OR</span>
              <Button
                variant="contained"
                color="info"
                onClick={openUploadModal}
                disabled={!isValidCompany}
              >
                Upload Annual Reports (5 yr)
              </Button>
            </>
          )}

          {isModalOpen && (
            <UploadModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onUpload={() => {}}
            />
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CompanyForm;
