"use client"
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

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
}

export default function Home() {
  const [formDetails, setFormDetails] = useState(initialFormDetails)
  const [lgas, setLgas] = useState(["CHOOSE A STATE OF ORIGIN TO SELECT LGA"])


  useEffect(() => {
    async function fetchLgas() {
      const state = toSentenceCase(formDetails.state)
      const lgasResponse = await axios.get(`https://nga-states-lga.onrender.com/?state=${state}`)
      const newLgas = [...lgasResponse.data].map((lga) => {
        lga = lga.toUpperCase()
        return lga
      })
      newLgas.unshift("SELECT LGA")
      // const states = newStates
      setLgas(newLgas)
    }

    if (formDetails.state == "") {
      // setLgas()
      return
    }

    fetchLgas()
  }, [formDetails.stateOfOrigin])

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
    // const authId = JSON.parse(localStorage.getItem("userDetails")).id
    // const userName = JSON.parse(localStorage.getItem("userDetails")).phoneNumber
    // const token = localStorage.getItem("token")
    e.preventDefault()
    // setSubmitting(true)
    // await holdPlay(5000)
    // debugger
    // const token = localStorage.getItem("token")
    const formInfo = {
      companyName: formDetails.companyName,
      industry: formDetails.industry,
      cacCertificationAvailable: formDetails.cacRegistered == "YES" ? true : false,
      companyType: formDetails.companyType,
      yearsPostIncorporation: formDetails.yearsPostIncorporation,
      location: {
        address: formDetails.location,
        state: formDetails.state,
        country: formDetails.country,
        lga: formDetails.lga,
        longitude: 0,
        latitude: 0
      },
      contactInformation: {
        email: formDetails.email,
        phoneNumber: formDetails.phone,
        website: formDetails.website,
        faxNumber: formDetails.fax
      },
      authId: authId
    }

    // debugger

    // let verified = false

    // if (verified) {
    //   // console.log("token: ", token)
    //   // debugger
    //   try {
    //     const isLogged = await axios.post(`${base}api/employers`,
    //       formInfo,
    //       {
    //         headers: {
    //           Authorization: `Bearer ${token}`
    //         }
    //       }
    //     )
    //     if (isLogged.status === 200) {
    //       localStorage.setItem("employer", JSON.stringify(isLogged.data))
    //       setDialogue({ ...dialogue, result: true, text: "Form Submission Successful!", path: "/dashboard/employee-management/post-internship-positions" })
    //       // router.push("/dashboard/agency/post-internship-positions")
    //     }
    //   } catch (error) {
    //     console.error("Form error:", error)
    //     setSubmitting(false)
    //     setDialogue({ ...dialogue, result: false, text: "Something went wrong!", path: "" })
    //   } finally {
    //     setSubmitting(false)
    //   }
    // } else {
    //   setSubmitting(false)
    //   console.log("unverified")
    // }
  }

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setFormDetails(currentDetails => ({
      ...currentDetails,
      [name]: value
    }))
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form onSubmit={(e) => { sendForm(e) }} className="flex flex-col  items-center pb-[50px] mt-[20px]">
        <div className="flex flex-col rounded-[10px] border-[#2dcd7c] md:w-[500px] mt-[10px] border p-[10px] gap-[5px]">
          <h2 className="rounded-t-[10px] borde bg-[#2dcd7c] font-[600] text-[20px] text-white px-[10px] text-center">COMPLETE VERIFICATION TO PROCEED</h2>
          <div className="flex flex-col gap-[20px]">
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
              {[["SELECT STATE", "Abia", "Akwa Ibom", "Bayelsa", "Cross River", "Delta", "Edo", "Imo", "Ondo", "Rivers"]].map((item, index) => (
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
          </div>
        </div>
        {/* <button disabled={submitting} className="border w-[120px] py-[5px] rounded-[7px] mt-[15px] bg-[#2dcd7c] active:bg-[#cfe1f0] text-white font-[600] text-[20px]">

          {!submitting && (
            <h2>Submit</h2>
          )}
          {submitting && (
            <Box component={"h2"} sx={{ color: "white" }}>
              <CircularProgress size="20px" color="inherit" />
            </Box>
          )}
        </button> */}


      </form>

    </main>
  );
}
