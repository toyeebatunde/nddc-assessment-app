"use client"
import axios from "axios";
// import Image from "next/image";
import { useEffect, useState } from "react";
import { base } from "@/components/Endpoints";
import AppContext from "@/components/ContextProvider";
import { Box, CircularProgress } from "@mui/material";
import AlertDialog from "@/components/AlertDialogue";
import { useSearchParams } from 'next/navigation'

const initialFormDetails = {
  userName: "",
  name: "",
  age: 0,
  location: "",
  gender: "",
  religion: "",
  disabilityStatus: "",
  educationLevel: "",
  phoneNumber: "",
  email: "",
  state: "",
  stateOfOrigin: "",
  originLGA: "",
  interest: ""
}

export default function Home() {
  const [formDetails, setFormDetails] = useState(initialFormDetails)
  const [lgas, setLgas] = useState(["CHOOSE A STATE OF ORIGIN TO SELECT LGA"])
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [dialogue, setDialogue] = useState({ text: "", result: false, path: "", buttonText: "" })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const searchParams = useSearchParams()


  useEffect(() => {
    async function fetchLgas() {
      const state = toSentenceCase(formDetails.stateOfOrigin)
      const lgasResponse = await axios.get(`https://nga-states-lga.onrender.com/?state=${state}`)
      const newLgas = [...lgasResponse.data].map((lga) => {
        lga = lga.toUpperCase()
        return lga
      })
      newLgas.unshift("SELECT LGA")
      // const states = newStates
      setLgas(newLgas)
    }

    if (formDetails.stateOfOrigin == "") {
      return
    }
    fetchLgas()
  }, [formDetails.stateOfOrigin])

  useEffect(() => {
    async function fetchUserData() {
      const token = searchParams.get("token")
      token && localStorage.setItem("token", token)
      console.log("token: ", token)
      try {
        const userData = await axios.get(`${base}api/app-users/get`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        if (userData.status == 200) {
          setFormDetails(userData.data)
          setIsLoading(false)
        }
      } catch (error) {
        setIsLoading(false)
        console.log("error fetching user data: ", error)
        setDialogue({ ...dialogue, result: false, text: "Error fetching user info!", path: "" })
      }
    }
    fetchUserData()

  }, [])

  const industries = [
    "Select a department",
    "Agriculture",
    "Automotive",
    "Banking & Financial Services",
    "Construction",
    "Consumer Goods",
    "Education",
    "Energy & Utilities",
    "Entertainment & Media",
    "Healthcare & Pharmaceuticals",
    "Hospitality",
    "Information Technology",
    "Insurance",
    "Manufacturing",
    "Non-Profit",
    "Professional Services",
    "Real Estate",
    "Retail & E-commerce",
    "Telecommunications",
    "Transportation & Logistics",
    "Travel & Tourism"
  ]

  function toSentenceCase(str: string) {
    // debugger
    if (!str) return str;
    if (str == "Akwa Ibom") {
      str = str.split(" ").join("")
    }
    if (str == "Cross River") {
      str = "Cross%20River"
    }
    return str
  }


  async function sendForm(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    const token = localStorage.getItem("token")
    const formInfo = formDetails

    // debugger
    try {
      const isLogged = await axios.put(`${base}api/app-users/update`,
        formDetails,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (isLogged.status === 200) {
        localStorage.setItem("candidateInfo", JSON.stringify(isLogged.data))
        try {
          const startAssessment = await axios.post(`${base}api/assessments/start`, {},
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )
          if (startAssessment.status == 200) {
            localStorage.setItem("assessmentId", isLogged.data.assessmentId)
            setSubmitting(false)
            setDialogue({ ...dialogue, result: true, buttonText: "Begin Assessment", text: "Update Successful", path: `/take-assessment?id=${isLogged.data.assessmentId}` })
          }
        } catch (error) {
          console.log("error starting asssment: ", error)
          setDialogue({ ...dialogue, result: false, text: "Error starting assessment!", path: "" })
          setSubmitting(false)

        }
        // router.push("/dashboard/agency/post-internship-positions")
      }
    } catch (error) {
      console.error("Form error:", error)
      setDialogue({ ...dialogue, result: false, text: "Something went wrong!", path: "" })
    } finally {
      setSubmitting(false)
    }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormDetails(currentDetails => ({
      ...currentDetails,
      [name]: value
    }))
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <AppContext.Consumer>
      {({ userCookieData }) => {
        return (
          <main className="flex min-h-screen overflow-auto border w-full flex-col items-center justify-between">
            <div className={`absolute ${submitting ? "" : "hidden"} h-screen w-screen bg-black opacity-[0.1]`}></div>
            <form onSubmit={(e) => { sendForm(e) }} className="flex flex-col self-center items-center pb-[50px] mt-[20px]">
              <div className="flex flex-col rounded-[10px] border-[#2dcd7c] md:w-[500px] mt-[10px] border p-[10px] gap-[5px]">
                <h2 className="rounded-t-[10px] borde bg-[#2dcd7c] font-[600] text-[20px] text-white px-[10px] text-center">UPDATE YOUR DATA AND SUBMIT FORM TO PROCEED</h2>
                <div className="flex flex-col gap-[20px]">
                  {/* <label htmlFor="userName">Phone Number</label> */}
                  <input required onChange={handleFormChange} value={formDetails.userName} name="userName" className="pl-[10px] rounded-[10px]  outline-none border border-[lightgreen] py-[5px] " type="text" placeholder="Enter your registered phone number" />
                  <input onChange={handleFormChange} value={formDetails.name} name="name" className="pl-[10px] rounded-[10px] outline-none border border-[lightgreen] py-[5px]" type="text" placeholder="Enter your name" />
                  <input onChange={handleFormChange} value={formDetails.age} name="age" className="pl-[10px] rounded-[10px] outline-none border border-[lightgreen] py-[5px]" type="text" placeholder="Enter your age" />
                  <input required onChange={handleFormChange} value={formDetails.location} name="location" className="pl-[10px] rounded-[10px] outline-none border border-[lightgreen] py-[5px]" type="text" placeholder="Enter your address" />
                  <select required onChange={handleFormChange} name="gender" value={formDetails.gender} className="pl-[5px] outline-none border border-[lightgreen] py-[5px] rounded-[10px]">
                    {["Select your gender", "Male", "Female"].map((item, index) => (
                      <option key={item} value={index === 0 ? "" : item} disabled={index === 0}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select required onChange={handleFormChange} name="religion" value={formDetails.religion} className="pl-[5px] outline-none border border-[lightgreen] py-[5px] rounded-[10px]">
                    {["Select your religion", "Christian", "Muslim", "Traditional", "Other"].map((item, index) => (
                      <option key={item} value={index === 0 ? "" : item} disabled={index === 0}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select required onChange={handleFormChange} name="disabilityStatus" value={formDetails.disabilityStatus} className="pl-[5px] outline-none border border-[lightgreen] py-[5px] rounded-[10px]">
                    {["Do you have a disability?", "YES", "NO"].map((item, index) => (
                      <option key={item} value={index === 0 ? "" : item} disabled={index === 0}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select required onChange={handleFormChange} name="educationLevel" value={formDetails.educationLevel} className="pl-[5px] outline-none border border-[lightgreen] py-[5px] rounded-[10px]">
                    {["What is your highest level of education?", "Primary Education", "Secondary Education", "Diploma/Technical College/HND", "University", "Phd", "Other"].map((item, index) => (
                      <option key={item} value={index === 0 ? "" : item} disabled={index === 0}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <input onChange={handleFormChange} value={formDetails.phoneNumber} name="phoneNumber" className="pl-[10px] rounded-[10px] outline-none border border-[lightgreen] py-[5px]" type="text" placeholder="Enter your registered phone number" />
                  <input onChange={handleFormChange} value={formDetails.email} name="email" className="pl-[10px] rounded-[10px] outline-none border border-[lightgreen] py-[5px]" type="email" placeholder="Enter your email" />
                  <select required onChange={handleFormChange} name="state" value={formDetails.state} className="pl-[5px] outline-none border border-[lightgreen] py-[5px] rounded-[10px]">
                    {["SELECT STATE", "Abia", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Imo", "Ondo", "Rivers"].map((item, index) => (
                      <option key={index} value={index === 0 ? "" : item} disabled={index === 0}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <select
                    required
                    onChange={handleFormChange}
                    value={formDetails.stateOfOrigin}
                    name="stateOfOrigin"
                    className="pl-[5px] outline-none text py-[5px] -[10px]  border border-[lightgreen] py-[5px] rounded-[10px]"
                  >
                    {["SELECT STATE", "Abia", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Imo", "Ondo", "Rivers"].map(
                      (item, index) => {
                        if (index === 0) {
                          return (
                            <option key={item} value="" disabled selected>
                              {item}
                            </option>
                          );
                        }
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      }
                    )}
                  </select>
                  <select
                    required
                    onChange={handleFormChange}
                    value={formDetails.originLGA}
                    name="originLGA"
                    className="pl-[5px] outline-none text py-[5px] -[10px]  border border-[lightgreen] py-[5px] rounded-[10px]"
                  >
                    {lgas.map(
                      (item, index) => {
                        if (index === 0) {
                          return (
                            <option key={item} value="" disabled selected>
                              {item}
                            </option>
                          );
                        }
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      }
                    )}
                  </select>
                  { <select
                    required
                    onChange={(e) => handleFormChange(e)}
                    value={formDetails.interest}
                    name="interest"
                    className="pl-[5px] outline-none text-[10px] font-[600] md:text-[13px] border border-[lightgreen] py-[5px] rounded-[10px]"
                  >
                    {industries.map(
                      (item, index) => {
                        if (index === 0) {
                          // The first item is the placeholder and should be disabled
                          return (
                            <option key={item} value="" disabled selected>
                              {item}
                            </option>
                          );
                        }
                        return (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        );
                      }
                    )}
                  </select> }
                </div>
              </div>
              <button disabled={submitting} className="border w-[120px] py-[5px] rounded-[7px] mt-[15px] bg-[#2dcd7c] active:bg-[#cfe1f0] text-white font-[600] text-[20px]">

                {!submitting && (
                  <h2>Submit</h2>
                )}
                {submitting && (
                  <Box component={"h2"} sx={{ color: "white" }}>
                    <CircularProgress size="20px" color="inherit" />
                  </Box>
                )}
              </button>


            </form>
            <AlertDialog props={dialogue} />

          </main>
        )
      }}
    </AppContext.Consumer>
  );
}
