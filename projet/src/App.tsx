import React, { useCallback } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Button, Divider, Container } from "@material-ui/core";

import { apiBaseUrl } from "./constants";
import { useStateValue, setPatientList, setDiagnosesList } from "./state";
import { Diagnosis, Patient } from "./types";

import PatientListPage from "./PatientListPage";
import PatientEntryAddPage from "./PatientPage/PatientEntryAddPage";
import { Typography } from "@material-ui/core";
import PatientPage from "./PatientPage";

const App = () => {
  const [, dispatch] = useStateValue();

  const fetchPatientList = useCallback(
    async () => {
      try {
        console.log("App useEffect, fetchPatientList")
        const { data: patientListFromApi } = await axios.get<Patient[]>(
          `${apiBaseUrl}/patients`
        );
  
        dispatch(setPatientList(patientListFromApi));
        console.log("setPatientList just happened")
      } catch (e) {
        console.error(e);
      }
    }, [dispatch])

  const fetchDiagnoseList = useCallback(
    async () => {
      try {
        const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        console.log(diagnoses);
        dispatch(setDiagnosesList(diagnoses));
        console.log("fetchDiagnoseList just happened")
  
      } catch (e) {
        console.log(e);
      }
    }, [dispatch])

  React.useEffect(() => {
    console.log("App useEffect")
    void axios.get<void>(`${apiBaseUrl}/ping`);
    // const [{ patients }] = useStateValue();
    // console.log("patients:", patients);
    
    void fetchPatientList();
    // const [{ patients }] = useStateValue()
    // console.log("patients:", patients);
    void fetchDiagnoseList();
    console.log("App useEffect fin")
  }, [dispatch, fetchPatientList, fetchDiagnoseList]);

  return (
    <div className="App">
    {console.log("App")}
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={Link} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider hidden />
          <Routes>
            <Route path="/" element={<PatientListPage />} />
            <Route path="/patients/:id" element={<PatientPage/>} />
            <Route path="/patients/:id/entries/new" element={<PatientEntryAddPage/>} />
          </Routes>
        </Container>
      </Router>
    </div>
  );
};

export default App;
