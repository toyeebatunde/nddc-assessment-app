"use client"
import { useState, useEffect, Fragment } from "react"
import AssessmentBuilder from "@/components/AssessmentBuilder"
import useSWR, { mutate } from 'swr'
import { base } from "@/components/Endpoints"
import axios from "axios"
import AlertDialog from "@/components/AlertDialogue"
import { Box, CircularProgress } from "@mui/material"
import { useSearchParams } from 'next/navigation'
import Image from "next/image"



export default function ViewAssessments() {
    const fetching = (url: string) => axios.get(url).then(res => res.data).catch(error => console.log(error))
    // const { data: assessmentsList, error: assessmentsListError } = useSWR(`${base}api/assessments/list`, fetching) //api/question/list/1
    const [solutions, setSolutions] = useState<any[]>([])
    const [allAssessments, setAllAssessments] = useState<any[]>([{ title: "SELECT AN ASSESSMENT TO VIEW", id: "" }])
    const [assessmentToView, setAssessmentToView] = useState<any>({ title: "", id: "" })
    // const { data: assessmentQuestions, error: assessmentQustionsError } = useSWR(`${base}api/question/list/${assessmentToView.id}`, fetching) //api/question/list/1
    const [currentAssessmentQuestions, setCurrentAssessmentQuestions] = useState<any[]>([])
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [dialogue, setDialogue] = useState<{ text: string, result: boolean, path: string, handler?: any }>({ text: "", result: false, path: "" })
    const searchParams = useSearchParams()
    const [isLoading, setLoading] = useState<boolean>(true)







    return (
        <div className="flex flex-col w-screen gap-[20px] items-center h-screen">
            <div className="w-[350px] h-[100px] mt-[100px] relative borde">
                <Image src="/images/splash.svg" alt="splash image" fill={true} />
            </div>
            <div>CONGRATULATIONS YOU HAVE COMPLETED THE ASSESSMENT</div>
        </div>
    )
}
