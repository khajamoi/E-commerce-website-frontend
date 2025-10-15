import React, { useEffect, useState } from "react";
import api from "../../api/api";
import {
  Box,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  ExpandMore,
  ExpandLess,
  Add,
  Delete,
  UploadFile,
  Download,
  Edit,
  Launch,
} from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";

// ---------------------------
// Styled components
// ---------------------------
const GradientTableCell = styled(TableCell)(() => ({
  background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
  color: "#fff",
  fontWeight: 600,
  fontSize: 14,
  textAlign: "center",
  padding: "6px 8px",
}));

const HoverTableRow = styled(TableRow)(() => ({
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#f9f9ff",
  },
}));

const SectionBox = styled(Box)(({ theme }) => ({
  backgroundColor: "#fff",
  padding: theme.spacing(1.5),
  borderRadius: 6,
  marginBottom: theme.spacing(1.5),
  boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
}));

const AttributeLabel = styled("span")({
  fontWeight: 600,
  color: "#333",
});

// ---------------------------
// PLACE TO PASTE LAB URLs
// ---------------------------
const LAB_URLS = {
  "Pathkind lab": "https://edos.pathkindlabs.com/3200/CL10%7CSE10%7CPL39/true", // <-- dummy link
  "redcliffe lab": "https://www.youtube.com/",
  // TODO: Paste your labName: "https://yourlink.com" pairs here.
};

export default function AdminMedicalReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  // Add/Edit forms
  const ATTRIBUTES = [
    "ageRange",
    "bodyPart",
    "bookingCutoff",
    "centerName",
    "colorName",
    "component",
    "reportCondition",
    "container",
    "department",
    "departmentName",
    "disease",
    "doctorSpecialty",
    "fastingTime",
    "gender",
    "homeCollection",
    "investigationName",
    "lab",
    "locationName",
    "packageName",
    "parameters",
    "preRequisites",
    "prescription",
    "price",
    "priceUpdatedOn",
    "processingDays",
    "quantity",
    "reportDeliveryDays",
    "reportTat",
    "reportingCutoff",
    "sampleReceiveTat",
    "sampleType",
    "sampleTypeName",
    "specimen",
    "sraCutoff",
    "stabilityRefrigerated",
    "stabilityRoom",
    "synonymous",
    "temperature",
    "testCode",
    "testMethod",
    "testName",
    "testUpdatedOn",
    "reportUsage",
  ];

  const [openForm, setOpenForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(
    ATTRIBUTES.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
  );
  const [file, setFile] = useState(null);

  // Search states
  const [searchTestCode, setSearchTestCode] = useState("");
  const [searchTestName, setSearchTestName] = useState("");
  const [searchCenter, setSearchCenter] = useState("");
  const [searchLab, setSearchLab] = useState("");
  const [searchDisease, setSearchDisease] = useState("");
  const [searchSpecialty, setSearchSpecialty] = useState("");

  // Lab external selector state (for UI, not required)
  const [labExternalValue, setLabExternalValue] = useState(null);

  // --- NEW: configure how many items appear visibly in Autocomplete dropdown ---
  // Number of visible items you'd like to see (10 as requested)
  const LISTBOX_MAX_ITEMS = 10;
  // height of one item (approx). Adjust if your item height differs.
  const ITEM_HEIGHT = 48;
  const listboxStyle = { style: { maxHeight: ITEM_HEIGHT * LISTBOX_MAX_ITEMS } };
  // ---------------------------------------------------------------------------

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/reports");
      setReports(res.data || []);
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit && editId) {
        await api.put(`/admin/reports/${editId}`, form);
      } else {
        await api.post("/admin/reports", form);
      }
      setOpenForm(false);
      setIsEdit(false);
      setEditId(null);
      setForm(ATTRIBUTES.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
      fetchReports();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (report) => {
    setIsEdit(true);
    setEditId(report.id);
    setForm({ ...report });
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await api.delete(`/admin/reports/${id}`);
    fetchReports();
  };

  const handleImportSubmit = async () => {
    if (!file) return alert("Select a file first");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await api.post("/admin/reports/import", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Import successful!");
      setFile(null);
      fetchReports();
    } catch (err) {
      console.error(err);
      alert("Import failed!");
    }
  };

  const handleDownloadTemplate = () => {
    window.open("http://localhost:8080/api/admin/reports/template", "_blank");
  };

  const handleReset = () => {
    setSearchTestCode("");
    setSearchTestName("");
    setSearchCenter("");
    setSearchLab("");
    setSearchDisease("");
    setSearchSpecialty("");
  };

  // Unique options
  const testCodeOptions = [...new Set(reports.map((r) => r.testCode).filter(Boolean))];
  const testNameOptions = [...new Set(reports.map((r) => r.testName).filter(Boolean))];
  const diseaseOptions = [...new Set(reports.map((r) => r.disease).filter(Boolean))];
  const specialtyOptions = [...new Set(reports.map((r) => r.doctorSpecialty).filter(Boolean))];
  const centerOptions = [...new Set(reports.map((r) => r.centerName).filter(Boolean))];
  const labOptions = [...new Set(reports.map((r) => r.lab).filter(Boolean))];

  // Filtered reports
  const filteredReports = reports.filter((r) => {
    const matchTestCode =
      !searchTestCode || (r.testCode || "").toLowerCase().includes(searchTestCode.toLowerCase());
    const matchTestName =
      !searchTestName || (r.testName || "").toLowerCase().includes(searchTestName.toLowerCase());
    const matchCenter = !searchCenter || (r.centerName || "").toLowerCase().includes(searchCenter.toLowerCase());
    const matchLab = !searchLab || (r.lab || "").toLowerCase().includes(searchLab.toLowerCase());
    const matchDisease = !searchDisease || (r.disease || "").toLowerCase().includes(searchDisease.toLowerCase());
    const matchSpecialty = !searchSpecialty || (r.doctorSpecialty || "").toLowerCase().includes(searchSpecialty.toLowerCase());

    return (
      matchTestCode &&
      matchTestName &&
      matchCenter &&
      matchLab &&
      matchDisease &&
      matchSpecialty
    );
  });

  // Utility to get URL for a lab name.
  // If your backend already returns an `externalUrl` field for each lab/report, prefer that.
  const getLabUrl = (labName) => {
    if (!labName) return null;
    // 1) First prefer if there's an exact mapping in LAB_URLS
    if (LAB_URLS[labName]) return LAB_URLS[labName];
    // 2) If any report has externalUrl property matching the lab, use it.
    const rep = reports.find((r) => r.lab === labName && (r.externalUrl || r.external_link));
    if (rep) return rep.externalUrl || rep.external_link;
    // 3) fallback: null
    return null;
  };

  // When user selects a lab from the external dropdown, open its URL in new tab.
  const onSelectExternalLab = (event, value) => {
    setLabExternalValue(value);
    const url = getLabUrl(value);
    if (url) {
      // open in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      alert("No external URL configured for this lab. Paste URL into the LAB_URLS mapping in code.");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={2} display="flex" flexDirection="column" height="100vh">
      {/* Reports Table */}
      <Box flex={1} mb={2}>
        <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, maxHeight: "80vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <GradientTableCell />
                <GradientTableCell>Lab</GradientTableCell>
                <GradientTableCell>Test Code</GradientTableCell>
                <GradientTableCell>Test Name</GradientTableCell>
                <GradientTableCell>Disease</GradientTableCell>
                <GradientTableCell>Specialty</GradientTableCell>
                <GradientTableCell>Center</GradientTableCell>
                <GradientTableCell>Price (₹)</GradientTableCell>
                <GradientTableCell>Actions</GradientTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReports.length ? (
                filteredReports.map((report) => (
                  <React.Fragment key={report.id}>
                    <HoverTableRow>
                      <TableCell align="center">
                        <IconButton size="small" onClick={() => toggleRow(report.id)}>
                          {expandedRow === report.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">{report.lab || "-"}</TableCell>
                      <TableCell align="center">{report.testCode || "-"}</TableCell>
                      <TableCell align="center">{report.testName || "-"}</TableCell>
                      <TableCell align="center">{report.disease || "-"}</TableCell>
                      <TableCell align="center">{report.doctorSpecialty || "-"}</TableCell>
                      <TableCell align="center">{report.centerName || "-"}</TableCell>
                      <TableCell align="center">{report.price ? `₹${report.price}` : "-"}</TableCell>
                      <TableCell align="center">
                        <IconButton color="primary" size="small" onClick={() => handleEdit(report)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton color="error" size="small" onClick={() => handleDelete(report.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </HoverTableRow>

                    <TableRow>
                      <TableCell colSpan={9} sx={{ p: 0 }}>
                        <Collapse in={expandedRow === report.id} timeout="auto" unmountOnExit>
                          <Box m={2}>
                            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                              Report Details
                            </Typography>
                            <SectionBox>
                              <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
                                {Object.entries(report).map(([key, value]) => (
                                  <Typography key={key} variant="body2">
                                    <AttributeLabel>{key}:</AttributeLabel> {value || "-"}
                                  </Typography>
                                ))}
                              </Box>
                              {/* If this report has an external link stored per-report, show a quick launch button */}
                              {report.externalUrl || report.external_link ? (
                                <Box mt={1}>
                                  <Button
                                    variant="outlined"
                                    size="small"
                                    endIcon={<Launch />}
                                    onClick={() => window.open(report.externalUrl || report.external_link, "_blank")}
                                  >
                                    Open External Link for this Report
                                  </Button>
                                </Box>
                              ) : null}
                            </SectionBox>
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={9}>
                    No reports found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Search Section */}
      <SectionBox>
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          🔍 Search Reports
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1} alignItems="center">
          <Autocomplete
            freeSolo
            options={testCodeOptions}
            value={searchTestCode}
            onInputChange={(e, v) => setSearchTestCode(v || "")}
            renderInput={(params) => <TextField {...params} label="Test Code" size="small" />}
            sx={{ minWidth: 130 }}
            ListboxProps={listboxStyle}
          />

          <Autocomplete
            freeSolo
            options={testNameOptions}
            value={searchTestName}
            onInputChange={(e, v) => setSearchTestName(v || "")}
            renderInput={(params) => <TextField {...params} label="Test Name" size="small" />}
            sx={{ minWidth: 130 }}
            ListboxProps={listboxStyle}
          />

          <Autocomplete
            freeSolo
            options={centerOptions}
            value={searchCenter}
            onInputChange={(e, v) => setSearchCenter(v || "")}
            renderInput={(params) => <TextField {...params} label="Center" size="small" />}
            sx={{ minWidth: 120 }}
            ListboxProps={listboxStyle}
          />

          <Autocomplete
            freeSolo
            options={labOptions}
            value={searchLab}
            onInputChange={(e, v) => setSearchLab(v || "")}
            renderInput={(params) => <TextField {...params} label="Lab" size="small" />}
            sx={{ minWidth: 120 }}
            ListboxProps={listboxStyle}
          />

          <Autocomplete
            freeSolo
            options={diseaseOptions}
            value={searchDisease}
            onInputChange={(e, v) => setSearchDisease(v || "")}
            renderInput={(params) => <TextField {...params} label="Disease" size="small" />}
            sx={{ minWidth: 120 }}
            ListboxProps={listboxStyle}
          />

          <Autocomplete
            freeSolo
            options={specialtyOptions}
            value={searchSpecialty}
            onInputChange={(e, v) => setSearchSpecialty(v || "")}
            renderInput={(params) => <TextField {...params} label="Specialty" size="small" />}
            sx={{ minWidth: 120 }}
            ListboxProps={listboxStyle}
          />

          <Button variant="contained" color="primary" size="small">
            Search
          </Button>

          <Button variant="outlined" color="secondary" size="small" onClick={handleReset}>
            Reset
          </Button>

          {/* -----------------------------
              Lab External Dropdown Button
              - placed beside Reset as requested
              - different shape (rounded-pill) and custom gradient color
              - searchable (case-insensitive via Autocomplete)
              - when user selects a lab, it opens the configured external URL in new tab
              ------------------------------*/}
          <Autocomplete
            size="small"
            options={labOptions}
            value={labExternalValue}
            onChange={onSelectExternalLab}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Lab External"
                placeholder="Search & open external link"
                sx={{ minWidth: 220 }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2">{option}</Typography>
                  {/* show a small launch icon if URL exists */}
                  {getLabUrl(option) ? <Launch fontSize="small" sx={{ ml: 1 }} /> : null}
                </Box>
              </li>
            )}
            sx={{
              '& .MuiAutocomplete-endAdornment': { right: 10 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '999px', // pill shape
                background: 'linear-gradient(90deg,#ff8a00 0%,#e52e71 100%)',
                color: '#fff',
                '& .MuiInputBase-input': { color: '#fff' },
                '& label': { color: '#fff' },
              },
            }}
            ListboxProps={listboxStyle}
          />
        </Box>
      </SectionBox>

      {/* Manage Section */}
      <SectionBox>
        <Typography variant="subtitle2" fontWeight={600} mb={1}>
          ⚙️ Manage Reports
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={1}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<Add />}
            onClick={() => {
              setIsEdit(false);
              setEditId(null);
              setForm(ATTRIBUTES.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
              setOpenForm(true);
            }}
          >
            Add Report
          </Button>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
            id="import-file"
          />
          <label htmlFor="import-file">
            <Button variant="outlined" component="span" size="small" startIcon={<UploadFile />}>
              {file ? file.name : "Choose File"}
            </Button>
          </label>

          <Button variant="contained" color="success" size="small" onClick={handleImportSubmit}>
            Import
          </Button>
          <Button variant="outlined" size="small" startIcon={<Download />} onClick={handleDownloadTemplate}>
            Template
          </Button>
        </Box>
      </SectionBox>

      {/* Add/Edit Dialog */}
      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? "Edit Report" : "Add New Report"}</DialogTitle>
        <DialogContent dividers>
          <Box
            component="form"
            onSubmit={handleSubmit}
            display="grid"
            gridTemplateColumns="repeat(2, 1fr)"
            gap={2}
          >
            {ATTRIBUTES.map((field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                fullWidth
                size="small"
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" color={isEdit ? "primary" : "success"}>
            {isEdit ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

    

///








// import React, { useEffect, useState } from "react";
// import api from "../../api/api";
// import {
//   Box,
//   Typography,
//   CircularProgress,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Collapse,
//   IconButton,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
// } from "@mui/material";
// import { styled } from "@mui/material/styles";
// import {
//   ExpandMore,
//   ExpandLess,
//   Add,
//   Delete,
//   UploadFile,
//   Download,
// } from "@mui/icons-material";
// import Autocomplete from "@mui/material/Autocomplete";

// // --- Styled Components ---
// const GradientTableCell = styled(TableCell)({
//   background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
//   color: "#fff",
//   fontWeight: 600,
//   fontSize: 15,
//   textAlign: "center",
// });

// const HoverTableRow = styled(TableRow)({
//   transition: "all 0.2s ease",
//   "&:hover": {
//     backgroundColor: "#f9f9ff",
//   },
// });

// const SectionBox = styled(Box)(({ theme }) => ({
//   backgroundColor: "#fff",
//   padding: theme.spacing(2),
//   borderRadius: 8,
//   marginBottom: theme.spacing(2),
//   boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
// }));

// const AttributeLabel = styled("span")({
//   fontWeight: 600,
//   color: "#333",
// });

// // --- Attributes Schema ---
// const ATTRIBUTES = [
//   "ageRange",
//   "bodyPart",
//   "bookingCutoff",
//   "centerName",
//   "colorName",
//   "component",
//   "reportCondition",
//   "container",
//   "department",
//   "departmentName",
//   "disease",
//   "doctorSpecialty",
//   "fastingTime",
//   "gender",
//   "homeCollection",
//   "investigationName",
//   "lab",
//   "locationName",
//   "packageName",
//   "parameters",
//   "preRequisites",
//   "prescription",
//   "price",
//   "priceUpdatedOn",
//   "processingDays",
//   "quantity",
//   "reportDeliveryDays",
//   "reportTat",
//   "reportingCutoff",
//   "sampleReceiveTat",
//   "sampleType",
//   "sampleTypeName",
//   "specimen",
//   "sraCutoff",
//   "stabilityRefrigerated",
//   "stabilityRoom",
//   "synonymous",
//   "temperature",
//   "testCode",
//   "testMethod",
//   "testName",
//   "testUpdatedOn",
//   "reportUsage",
// ];

// export default function AdminMedicalReports() {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [openForm, setOpenForm] = useState(false);
//   const [file, setFile] = useState(null);

//   const [form, setForm] = useState(
//     ATTRIBUTES.reduce((acc, field) => ({ ...acc, [field]: "" }), {})
//   );

//   // --- Search states ---
//   const [searchTestCode, setSearchTestCode] = useState("");
//   const [searchTestName, setSearchTestName] = useState("");
//   const [searchCenter, setSearchCenter] = useState("");
//   const [searchLab, setSearchLab] = useState("");
//   const [searchDisease, setSearchDisease] = useState("");
//   const [searchSpecialty, setSearchSpecialty] = useState("");

//   useEffect(() => {
//     fetchReports();
//   }, []);

//   const fetchReports = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/admin/reports");
//       setReports(res.data || []);
//     } catch (err) {
//       console.error(err);
//       setReports([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleRow = (id) => setExpandedRow(expandedRow === id ? null : id);
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await api.post("/admin/reports", form);
//       setOpenForm(false);
//       setForm(ATTRIBUTES.reduce((acc, f) => ({ ...acc, [f]: "" }), {}));
//       fetchReports();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this report?")) return;
//     await api.delete(`/admin/reports/${id}`);
//     fetchReports();
//   };

//   const handleImportSubmit = async () => {
//     if (!file) return alert("Select a file first");
//     const formData = new FormData();
//     formData.append("file", file);
//     try {
//       await api.post("/admin/reports/import", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Import successful!");
//       setFile(null);
//       fetchReports();
//     } catch (err) {
//       console.error(err);
//       alert("Import failed!");
//     }
//   };

//   const handleDownloadTemplate = () => {
//     window.open("http://localhost:8080/api/admin/reports/template", "_blank");
//   };

//   const handleReset = () => {
//     setSearchTestCode("");
//     setSearchTestName("");
//     setSearchCenter("");
//     setSearchLab("");
//     setSearchDisease("");
//     setSearchSpecialty("");
//   };

//   // --- Options ---
//   const testCodeOptions = [...new Set(reports.map((r) => r.testCode).filter(Boolean))];
//   const testNameOptions = [...new Set(reports.map((r) => r.testName).filter(Boolean))];
//   const diseaseOptions = [...new Set(reports.map((r) => r.disease).filter(Boolean))];
//   const specialtyOptions = [...new Set(reports.map((r) => r.doctorSpecialty).filter(Boolean))];
//   const centerOptions = [...new Set(reports.map((r) => r.centerName).filter(Boolean))];
//   const labOptions = [...new Set(reports.map((r) => r.lab).filter(Boolean))];

//   // --- Filtered Reports ---
//   const filteredReports = reports.filter((r) => {
//     const matchTestCode = !searchTestCode || (r.testCode || "").toLowerCase().includes(searchTestCode.toLowerCase());
//     const matchTestName = !searchTestName || (r.testName || "").toLowerCase().includes(searchTestName.toLowerCase());
//     const matchCenter = !searchCenter || (r.centerName || "").toLowerCase().includes(searchCenter.toLowerCase());
//     const matchLab = !searchLab || (r.lab || "").toLowerCase().includes(searchLab.toLowerCase());
//     const matchDisease = !searchDisease || (r.disease || "").toLowerCase().includes(searchDisease.toLowerCase());
//     const matchSpecialty = !searchSpecialty || (r.doctorSpecialty || "").toLowerCase().includes(searchSpecialty.toLowerCase());

//     return matchTestCode && matchTestName && matchCenter && matchLab && matchDisease && matchSpecialty;
//   });

//   if (loading)
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
//         <CircularProgress />
//       </Box>
//     );

//   return (
//     <Box p={3} display="flex" flexDirection="column" height="100vh">
//       {/* <Typography variant="h5" fontWeight="bold" mb={2} textAlign="center">
      
//       </Typography> */}

//       {/* --- Search Section --- */}
//       <SectionBox>
//         <Typography variant="subtitle1" fontWeight={600} mb={1}>
//           🔍 Search Reports
//         </Typography>
//         <Box display="flex" flexWrap="wrap" gap={1.5}>
//           <Autocomplete freeSolo options={testCodeOptions} value={searchTestCode} onInputChange={(e, v) => setSearchTestCode(v || "")} renderInput={(params) => <TextField {...params} label="Test Code" size="small" />} sx={{ minWidth: 160 }} />
//           <Autocomplete freeSolo options={testNameOptions} value={searchTestName} onInputChange={(e, v) => setSearchTestName(v || "")} renderInput={(params) => <TextField {...params} label="Test Name" size="small" />} sx={{ minWidth: 160 }} />
//           <Autocomplete freeSolo options={centerOptions} value={searchCenter} onInputChange={(e, v) => setSearchCenter(v || "")} renderInput={(params) => <TextField {...params} label="Center" size="small" />} sx={{ minWidth: 140 }} />
//           <Autocomplete freeSolo options={labOptions} value={searchLab} onInputChange={(e, v) => setSearchLab(v || "")} renderInput={(params) => <TextField {...params} label="Lab" size="small" />} sx={{ minWidth: 140 }} />
//           <Autocomplete freeSolo options={diseaseOptions} value={searchDisease} onInputChange={(e, v) => setSearchDisease(v || "")} renderInput={(params) => <TextField {...params} label="Disease" size="small" />} sx={{ minWidth: 140 }} />
//           <Autocomplete freeSolo options={specialtyOptions} value={searchSpecialty} onInputChange={(e, v) => setSearchSpecialty(v || "")} renderInput={(params) => <TextField {...params} label="Specialty" size="small" />} sx={{ minWidth: 140 }} />
//           <Button variant="contained" color="primary" size="small">Search</Button>
//           <Button variant="outlined" color="secondary" size="small" onClick={handleReset}>Reset</Button>
//         </Box>
//       </SectionBox>

//       {/* --- Manage Section --- */}
//       <SectionBox>
//         <Typography variant="subtitle1" fontWeight={600} mb={1}>
//           ⚙️ Manage Reports
//         </Typography>
//         <Box display="flex" flexWrap="wrap" gap={1.5}>
//           <Button variant="contained" color="primary" size="small" startIcon={<Add />} onClick={() => setOpenForm(true)}>
//             Add Report
//           </Button>

//           <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files[0])} style={{ display: "none" }} id="import-file" />
//           <label htmlFor="import-file">
//             <Button variant="outlined" component="span" size="small" startIcon={<UploadFile />}>{file ? file.name : "Choose File"}</Button>
//           </label>

//           <Button variant="contained" color="success" size="small" onClick={handleImportSubmit}>Import</Button>
//           <Button variant="outlined" size="small" startIcon={<Download />} onClick={handleDownloadTemplate}>Template</Button>
//         </Box>
//       </SectionBox>

//       {/* --- Add Report Dialog --- */}
//       <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
//         <DialogTitle>Add New Report</DialogTitle>
//         <DialogContent dividers>
//           <Box component="form" onSubmit={handleSubmit} display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={2}>
//             {ATTRIBUTES.map((field) => (
//               <TextField key={field} label={field.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())} name={field} value={form[field]} onChange={handleChange} fullWidth size="small" />
//             ))}
//           </Box>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenForm(false)}>Cancel</Button>
//           <Button onClick={handleSubmit} variant="contained" color="success">Save</Button>
//         </DialogActions>
//       </Dialog>

//       {/* --- Reports Table --- */}
//       <Box flex={1} mt={2}>
//         <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, maxHeight: "60vh" }}>
//           <Table stickyHeader size="small">
//             <TableHead>
//               <TableRow>
//                 <GradientTableCell />
//                 <GradientTableCell>Lab</GradientTableCell>
//                 <GradientTableCell>Test Code</GradientTableCell>
//                 <GradientTableCell>Test Name</GradientTableCell>
//                 <GradientTableCell>Disease</GradientTableCell>
//                 <GradientTableCell>Specialty</GradientTableCell>
//                 <GradientTableCell>Center</GradientTableCell>
//                 <GradientTableCell>Price (₹)</GradientTableCell>
//                 <GradientTableCell>Actions</GradientTableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {filteredReports.length ? (
//                 filteredReports.map((report) => (
//                   <React.Fragment key={report.id}>
//                     <HoverTableRow>
//                       <TableCell align="center">
//                         <IconButton size="small" onClick={() => toggleRow(report.id)}>
//                           {expandedRow === report.id ? <ExpandLess /> : <ExpandMore />}
//                         </IconButton>
//                       </TableCell>
//                       <TableCell align="center">{report.lab || "-"}</TableCell>
//                       <TableCell align="center">{report.testCode || "-"}</TableCell>
//                       <TableCell align="center">{report.testName || "-"}</TableCell>
//                       <TableCell align="center">{report.disease || "-"}</TableCell>
//                       <TableCell align="center">{report.doctorSpecialty || "-"}</TableCell>
//                       <TableCell align="center">{report.centerName || "-"}</TableCell>
//                       <TableCell align="center">{report.price ? `₹${report.price}` : "-"}</TableCell>
//                       <TableCell align="center">
//                         <IconButton color="error" size="small" onClick={() => handleDelete(report.id)}>
//                           <Delete fontSize="small" />
//                         </IconButton>
//                       </TableCell>
//                     </HoverTableRow>

//                     <TableRow>
//                       <TableCell colSpan={9} sx={{ p: 0 }}>
//                         <Collapse in={expandedRow === report.id} timeout="auto" unmountOnExit>
//                           <Box m={2}>
//                             <Typography variant="subtitle2" fontWeight={600} gutterBottom>
//                               Report Details
//                             </Typography>
//                             <SectionBox>
//                               <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap={1}>
//                                 {Object.entries(report).map(([key, value]) => (
//                                   <Typography key={key} variant="body2">
//                                     <AttributeLabel>{key}:</AttributeLabel> {value || "-"}
//                                   </Typography>
//                                 ))}
//                               </Box>
//                             </SectionBox>
//                           </Box>
//                         </Collapse>
//                       </TableCell>
//                     </TableRow>
//                   </React.Fragment>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell align="center" colSpan={9}>
//                     No reports found
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Box>
//     </Box>
//   );
// }


// //  /its old code where the list is below 