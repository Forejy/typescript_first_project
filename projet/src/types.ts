export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}


export enum EntryType {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck'
}

export interface BaseEntry {
  id: string,
  date: string,
  type: EntryType,
  specialist: string,
  diagnosisCodes?: Array<string>,
  description: string,
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital,
  discharge: {
    date: string,
    criteria: string
  }
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  type: EntryType.OccupationalHealthcare,
  sickLeave?: {
    startDate: string,
    endDate: string,
  }
}

export enum healthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: EntryType.HealthCheck,
  healthCheckRating: healthCheckRating.Healthy,
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Array<Entry>;
}

export type newEntryEntry = 
    Omit<HospitalEntry, 'id' | 'date'> 
  | Omit<OccupationalHealthcareEntry, 'id' | 'date'>
  | Omit<HealthCheckEntry, 'id' | 'date'>;

export interface EntryTypeObject {
  value: EntryType
}

export interface FormBaseEntry {
  type: EntryTypeObject,
  specialist: {value: string},
  diagnosisCodes?: {value: string},
  description: {value: string},
}

export interface FormHospitalEntry extends FormBaseEntry {
  type: {value: EntryType.Hospital},
  dischargeDate: {value: string},
  dischargeCriteria: {value: string}
}

export interface FormOccupationalHealthcareEntry extends FormBaseEntry {
  type: {value: EntryType.OccupationalHealthcare},
  sickLeaveStartDate?: {value: string},
  sickLeaveEndDate?: {value: string},
}

export interface FormHealthCheckEntry extends FormBaseEntry {
  type: {value: EntryType.HealthCheck},
  healthCheckRating: {value: healthCheckRating.Healthy},
}

export type FormEntry = FormHospitalEntry | FormOccupationalHealthcareEntry | FormHealthCheckEntry;