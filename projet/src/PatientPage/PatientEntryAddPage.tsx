/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from "axios";
import React from "react";
import { useState } from "react"
import { useParams } from "react-router";
import { apiBaseUrl } from "../constants";
import { EntryType, healthCheckRating, newEntryEntry, BaseEntry, HospitalEntry, HealthCheckEntry, OccupationalHealthcareEntry, FormHospitalEntry, FormOccupationalHealthcareEntry, FormHealthCheckEntry, FormEntry } from "../types";

const PatientEntryAddPage = () => {
  const { id } = useParams<{ id: string }>()
  const [menuStatus, setMenuStatus] = React.useState<EntryType>(EntryType.Hospital)

  const changeMenuStatus = (e:React.ChangeEvent<HTMLSelectElement>) => {
    setMenuStatus(e.target.value as EntryType)
  }
  
  // const onSubmit = async (e:React.FormEvent<Element>) => {
  //   if (!id) {
  //     //flash
  //   } else {
  //     e.preventDefault()
  //     const f = document.forms as HTMLCollectionOf<HTMLFormElement> & {
  //       entry: {
  //         specialist: {value: string},
  //         diagnosisCodes: {value: string},
  //         description: {value: string},
  //       }
  //     }

  //     console.log(f.entry)
  //     console.log(f.entry.specialist)
  
  //     type Entry = {
  //       specialist: string,
  //       diagnosisCodes: string,
  //       description: string,
  //   }

  //     const t:Entry = {
  //       specialist: f.entry.specialist.value,
  //       diagnosisCodes: f.entry.diagnosisCodes.value,
  //       description: f.entry.description.value,
  //     }
  //     console.log(t)

  //     await axios.post<Entry>(`${apiBaseUrl}/patients/${id}/entries/`, t )
  //   }
  // }

  const onSubmit = async (e:React.FormEvent<Element>) => {
    if (!id) {
      //flash
    } else {
      e.preventDefault()
      const f = document.forms as HTMLCollectionOf<HTMLFormElement> & {
        entry: FormEntry
      }
      console.log(f.entry)
      console.log(menuStatus)


      const entry:Omit<BaseEntry, 'id' | 'date'> = {
        type: menuStatus,
        specialist: f.entry.specialist.value,
        description:f.entry.description.value
      }

      if (f.entry.diagnosisCodes) { entry.diagnosisCodes = f.entry.diagnosisCodes.value.split(',') }

      let entrybis:newEntryEntry | undefined
      if (menuStatus === EntryType.Hospital) {
        const tempEntry = f.entry as FormHospitalEntry
        entrybis = {...entry as HospitalEntry, discharge: { date: tempEntry.dischargeDate.value, criteria: tempEntry.dischargeCriteria.value }}
      } else if (menuStatus === EntryType.OccupationalHealthcare) {
        const tempEntry = f.entry as FormOccupationalHealthcareEntry
        console.log(tempEntry.sickLeaveStartDate, " ", tempEntry.sickLeaveEndDate)
        if (tempEntry.sickLeaveStartDate && tempEntry.sickLeaveEndDate) { 
          entrybis = {...entry as OccupationalHealthcareEntry, sickLeave: {startDate: tempEntry.sickLeaveStartDate.value, endDate: tempEntry.sickLeaveEndDate.value }
         }
       }
      } else {
        const tempEntry = f.entry as FormHealthCheckEntry
        entrybis = {...entry as HealthCheckEntry, healthCheckRating: tempEntry.healthCheckRating.value }
      }
      if (entrybis === undefined) { throw new Error('entrybis undefined') }
      console.log(entrybis)
  
      await axios.post<newEntryEntry>(`${apiBaseUrl}/patients/${id}/entries/`,  entrybis)
    }
  }

  return (
    <form name="entry" onSubmit={onSubmit}>
      <input name="type" type={"hidden"} />
      <Input name="specialist" />
      <Input name="diagnosisCodes" />
      <Input name="description" />
      <Select name="EntryTypes" selection={Object.keys(EntryType)} onChange={changeMenuStatus} />
      {menuStatus === EntryType.Hospital ?
       <fieldset>
         <div>Discharge</div>
        <DateInput name="dischargeDate" />
        <Input name="dischargeCriteria" />
       </fieldset> 
       : menuStatus === EntryType.OccupationalHealthcare ?
      <fieldset>
        <div>SickLeave</div>
        <DateInput name="sickLeaveStartDate" min={"2010-01-01"}/>
        <DateInput name="sickLeaveEndDate" min={"2022-01-01"} />
      </fieldset>
      :
      <fieldset>
         <div>HealthCheckRating</div>
        <NumberInput name="healthCheckRating" min={healthCheckRating.Healthy} max={healthCheckRating.CriticalRisk}/>
      </fieldset>} 
      <button type="submit">Submit</button>
    </form>
  )
}

interface InputProps {
  name: string,
}

interface NumberInputProps extends InputProps {
  min: number,
  max: number,
}

interface DateInputProps extends InputProps {
  min?: string,
  max?: string,
}

interface SelectProps {
  name: string,
  selection: Array<string>,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void,
}

const useTestCustom = (n:number) => {
  const [s] = useState(n + 2)
  console.log("useTestCustom ", s)
}



const Input = (props: InputProps) => {
  const [value, setValue] = useState('')
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }

  const rendInput = () => {
    const { name } = props
    return (
      <div>
        <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <input name={name} onChange={handleChange} value={value}/>
      </div>
    )
  }

  return (
    <>
      {rendInput()}
    </>
  )
}

const NumberInput = (props: NumberInputProps) => {
  const [value, setValue] = useState('')
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValue(e.target.value)
  }

  const rendInput = () => {
    const { name, min, max } = props
    return (
      <div>
        <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <input name={name} onChange={handleChange} value={value} type={"number"} min={min} max={max}/>
      </div>
    )
  }

  return (
    <>
      {rendInput()}
    </>
  )
}

const DateInput = (props: DateInputProps) => {
  const [value, setValue] = useState('')
  const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value)
    setValue(e.target.value)
    //verif
  }

  const rendInput = () => {
    const { name, min, max } = props
    return (
      <div>
        <label>{name.charAt(0).toUpperCase() + name.slice(1)}</label>
        <input name={name} onChange={handleChange} value={value} type={"date"} min={min} max={max}/>
      </div>
    )
  }

  return (
    <>
      {rendInput()}
    </>
  )
}

const Select = (props: SelectProps) => {

  const rendSelect = () => {
    const { name, selection, onChange } = props
    return (
      <select name={name} onChange={(e) => {onChange(e)}}>
        {selection.map((s, i) => {
          return (<option value={s} key={i}>{s}</option>)
        })}
      </select>
    )
  }

  return (
    <>
    {rendSelect()}
    </>
  )
}

export default PatientEntryAddPage