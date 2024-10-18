"use client"
import { useState, useEffect, Fragment } from "react"
import AssessmentBuilder from "@/components/AssessmentBuilder"
import useSWR, { mutate } from 'swr'
import { base } from "@/components/Endpoints"
import axios from "axios"
import AlertDialog from "@/components/AlertDialogue"
import { Box, CircularProgress } from "@mui/material"
import { useSearchParams } from 'next/navigation'



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
    const [description, setDescription] = useState<any>("")







    // useEffect(() => {
    //     if (assessmentsList) {
    //         let newAssessmentsList = [...assessmentsList]
    //         newAssessmentsList.unshift({ title: "SELECT ASSESSMENT", id: "" })
    //         setAllAssessments(newAssessmentsList)
    //     }
    // }, [assessmentsList])

    // useEffect(() => {
    //     mutate(`${base}api/question/list/${assessmentToView.id}`)
    //     setSolutions([])
    // }, [assessmentToView])

    // useEffect(() => {
    //     if (assessmentQuestions) {
    //         setCurrentAssessmentQuestions(assessmentQuestions)
    //     }
    // }, [assessmentQuestions])

    useEffect(() => {
        async function fetchDescription() {
            const assessmentId = searchParams.get("id")
            // const assessmentsResponse = await axios.get(`${base}api/assessments/list`)
            try {

                const assessment = await axios.get(`${base}api/assessments/list`)
                if (assessment.status === 200) {
                    const thisAssessment = assessment.data.find((item: any) => item.id == assessmentId)
                    setDescription(thisAssessment.description)
                }
            } catch (error) {
                // debugger
                console.error("description error:", error)
                // setDialogue({ ...dialogue, result: false, text: "Error submitting assessment", path: "" })
                // setSubmitting(false)
            }

        }
        async function fetchAssessment() {
            // const assessment = await axios.get(`${base}api/question/list/1`)
            const assessmentId = searchParams.get("id")
            try {

                const assessment = await axios.get(`${base}api/question/list/${assessmentId}`)
                if (assessment.status === 200) {
                    // setSubmitting(false)
                    // setSolutions([])
                    // setDialogue({ ...dialogue, result: true, text: "Assessment submitted successfully", path: "/" })
                    setCurrentAssessmentQuestions(assessment.data)
                    setLoading(false)
                }
            } catch (error) {
                // debugger
                // console.error("Signin error:", error)
                setDialogue({ ...dialogue, result: false, text: "Error fetching assessment", path: "" })
                setSubmitting(false)
            }
        }
        fetchAssessment()
        fetchDescription()
    }, [])

    function removeCheckboxAnswer(text: string | number, arr: (string | number)[]) {
        const newArr = arr.filter((item) => item !== text)
        return newArr
    }

    function addCheckboxAnswer(text: string | number, arr: (string | number)[]) {
        const newArr = [...arr, text]
        return newArr
    }

    function handleMultiChoice(e: any, id: any, option: { isCorrect: any, optionText: any }) {
        const isAnswered: any = solutions.find((question: any) => question.questionId == id)
        // debugger
        if (!e.target.checked) {
            // debugger
            isAnswered.selectedOptions = isAnswered.selectedOptions.filter((option: any) => {
                return option.optionText != e.target.name
            })
            const newSolutions: any = solutions.map((solution: any) => {
                if (solution.questionId == id) {
                    solution = isAnswered
                    return solution
                }
                return solution
            })
            setSolutions(newSolutions)
        }
        if (isAnswered && e.target.checked) {
            isAnswered.selectedOptions = [...isAnswered.selectedOptions, { optionText: e.target.name, isCorrect: e.target.value == "true" ? true : false }]
            // debugger
            const newSolutions: any = solutions.map((solution: any) => {
                if (solution.questionId == id) {
                    solution = isAnswered
                    return solution
                }
                return solution
            })
            setSolutions(newSolutions)
            return
        }
        if (e.target.checked) {
            // debugger
            setSolutions([...solutions, {
                questionId: id, selectedOptions: [
                    {
                        optionText: e.target.name,
                        isCorrect: e.target.value == "true" ? true : false
                    }
                ]
            }])
        }
    }

    function handleSingleChoice(e: any, id: any, options: []) {
        // debugger
        let isAnswered: any = solutions.find((question: any) => question.questionId == id)
        let thisOption = options.find((option: any) => option.optionText == e.target.value)
        if (isAnswered) {
            isAnswered.selectedOptions = [thisOption]
            const newSolutions: any = solutions.map((solution: any) => {
                if (solution.questionId == id) {
                    solution = isAnswered
                    return solution
                }
                return solution
            })
            setSolutions(newSolutions)
            return
        }
        setSolutions([...solutions, {
            questionId: id, selectedOptions: [
                thisOption
            ]
        }])

    }

    function handleShortAnswer(e: any, id: any) {
        let isAnswered: any = solutions.find((question: any) => question.questionId == id)
        if (isAnswered) {
            isAnswered.shortAnswer = e.target.value
            const newSolutions: any = solutions.map((solution: any) => {
                if (solution.questionId == id) {
                    solution = isAnswered
                    return solution
                }
                return solution
            })
            setSolutions(newSolutions)
            return
        }
        setSolutions([...solutions, {
            questionId: id, shortAnswer: e.target.value
        }])
    }

    function handleTrueFalse(e: any, id: any, options: []) {
        // debugger
        let isAnswered: any = solutions.find((question: any) => question.questionId == id)
        let thisOption = options.find((option: any) => option.optionText == e.target.value)
        if (isAnswered) {
            isAnswered.selectedOptions = [thisOption]
            const newSolutions: any = solutions.map((solution: any) => {
                if (solution.questionId == id) {
                    solution = isAnswered
                    return solution
                }
                return solution
            })
            setSolutions(newSolutions)
            return
        }
        setSolutions([...solutions, {
            questionId: id, selectedOptions: [
                thisOption
            ]
        }])

    }

    function handleAssessmentSelect(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        // debugger
        setAssessmentToView(allAssessments[Number(value)])
    }

    async function submitAssessment(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setSubmitting(true)
        const id = localStorage.getItem("assessmentId")
        const token = localStorage.getItem("token") || ""
        debugger
        // console.log("body: ", JSON.stringify(solutions))

        try {
            // debugger
            const submitted = await axios.post(
                `${base}api/assessments/submit/${id}`,
                solutions,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    //   withCredentials: true
                }
            )

            if (submitted.status === 200) {
                setSubmitting(false)
                setSolutions([])
                setDialogue({ ...dialogue, result: true, text: "Assessment submitted successfully", path: "/completed" })
            }
        } catch (error) {
            console.error("Signin error:", error)
            setDialogue({ ...dialogue, result: false, text: "Error submitting assessment", path: "" })
            setSubmitting(false)
        }
    }



    return (
        <div className="flex flex-col w-full h-fit justify-center">
            {isLoading && (<div>Loading...</div>)}

            {currentAssessmentQuestions.length > 0 && (
                <form onSubmit={submitAssessment} className=" border-4 self-center pb-[20px] rounded-[5px] p-[5px] borde w-fit flex flex-col gap-[15px] items-center">
                    <h2 className="rounded-t-[10px] mb-[5px] borde bg-[#2dcd7c] font-[600] text-[20px] text-white px-[10px] text-center">
                        {description}
                    </h2>
                    {currentAssessmentQuestions.map((question, index) => {
                        return (
                            <Fragment key={index}>
                                <AssessmentBuilder
                                    questionText={question.questionText}
                                    options={question.options}
                                    questionType={question.questionType}
                                    id={question.id}
                                    handleSolution={
                                        question.questionType == "MULTI_CORRECT" ? handleMultiChoice :
                                            question.questionType == "MCQ" ? handleSingleChoice :
                                                question.questionType == "SHORT_ANSWER" ? handleShortAnswer : handleTrueFalse
                                    }
                                />
                            </Fragment>
                        )
                    })}
                    <button disabled={submitting} className={`border w-[120px] py-[5px] rounded-[7px] mt-[15px] bg-[#2dcd7c] active:bg-[#cfe1f0] text-white font-[600] text-[20px]`}>
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
            )}
            <AlertDialog props={dialogue} />
        </div>
    )
}