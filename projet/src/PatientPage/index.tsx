import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { apiBaseUrl } from "../constants";
import { useStateValue } from "../state";
import { EntryType, Patient, Entry, Diagnosis, HospitalEntry as HospitalEntryType, HealthCheckEntry as HealthCheckEntryType, OccupationalHealthcareEntry as OccupationalHealthcareEntryType } from "../types";



const entries = (entries: Entry[], diagnoses: {[code: string]: Diagnosis} ) => {

  return (
    <section>
      <h4>Entries</h4>
      {entries.map((e,i) => 
        <article key={i}>
          <div>{e.id}</div>
          <div>{e.date}</div>
          <div>{e.type}</div>
          <div>{e.specialist}</div>
          {
            e.diagnosisCodes 
            ? <ul>

              {
                e.diagnosisCodes && e.diagnosisCodes.length > 0 && Object.keys(diagnoses).length > 0 ?
                e.diagnosisCodes.map((d,i) => <li key={i}>{diagnoses[d].code} : {diagnoses[d].name} (latin name: {diagnoses[d].latin})</li>)
                : null 
                }
              {
                e.diagnosisCodes && e.diagnosisCodes.length > 0 && Object.keys(diagnoses).length === 0?
                e.diagnosisCodes.map((d, i) => <li key={i}>{d}</li>)
                : null
              }
            </ul>
            : null
          }
          <div>{e.description}</div>
          {entryType(e)}
          <br/>
        </article>)
      }
    </section>
  );
};

const HospitalEntry:React.FC<{entry: HospitalEntryType}> = ({entry}) => {
  return (<div>{entry.discharge.date} : {entry.discharge.criteria}</div>)
}

const HealthCheckEntry:React.FC<{entry: HealthCheckEntryType}> = ({entry}) => {
  return (<div>Health Check Rating : {entry.healthCheckRating}</div>)
}

const OccupationalHealthcareEntry:React.FC<{entry: OccupationalHealthcareEntryType}> = ({entry}) => {
  return <div>Leave : {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</div>;
}

const entryType = (entry: Entry) => {
  switch (entry.type) {
    case EntryType.Hospital:
      return <HospitalEntry entry={entry} />
    case EntryType.HealthCheck:
      return <HealthCheckEntry entry={entry} />
    case EntryType.OccupationalHealthcare:
      return <OccupationalHealthcareEntry entry={entry} />
  }
};

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  console.log("PatientPage id", id)
  const [{ patients, diagnoses }] = useStateValue();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [patient, setPatient] = useState<Patient | undefined>(id ? patients[id] : undefined);
  const [diagnosesList, setDiagnosesList] = useState<{ [code: string]: Diagnosis }>(Object.keys(diagnoses).length > 0 ? diagnoses : {});

  const fetchOnePatient = useCallback(
    async () => {
      try {
        if (id === undefined) { throw new Error('Incorrect or missing id');}
        console.log("  PatientPage useEffect fetchOnePatient")
        const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        console.log("  PatientPage useEffect, fetchOnePatient, data: ", data)
        setPatient(data);
      } catch (e) {
        console.log(e);
      }
    },[id]);

  const fetchDiagnoseList = useCallback(
    async () => {
      try {
        console.log("  PatientPage useEffect fetchDiagnoseList")
        const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
        console.log("  PatientPage useEffect, fetchDiagnoseList, data: ", diagnoses)

        setDiagnosesList(diagnoses.reduce(
          (memo, diagnose) => ({ ...memo, [diagnose.code]: diagnose }), 
          {}
        ),);

      } catch (e) {
        console.log(e);
      }
    }, []);


  useEffect( () => {
    console.log("PatientPage useEffect")
    
    if (patient === undefined) void fetchOnePatient();

    if (Object.keys(diagnosesList).length === 0) {
      void fetchDiagnoseList();
    }

    {console.log("PatientPage useEffect, apres fetch patient et diagnosesList")}

  }, [fetchOnePatient, fetchDiagnoseList, patient, diagnosesList]);

  const rendPatient = () => {
    if (patient === undefined) return <article>Patient not found</article>;
    else return (
      <article>
        <br/>
        <br/>        
        <div>{patient.name}</div>
        <div>{patient.dateOfBirth}</div>
        <div>{patient.gender}</div>
        <div>{patient.occupation}</div>
        {patient.entries.length > 0 ? entries(patient.entries, diagnosesList): null}
        <div></div>
      </article>
    );
  };
  return (
    <div>j
    {console.log("PatientPage")}
    {console.log("  PatientPage, patient: ", patient)}
    {console.log("  PatientPage, diagnosesList: ", diagnosesList)}

      {rendPatient()}
    </div>
  );
};

export default PatientPage;