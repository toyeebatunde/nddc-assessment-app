"use client"
import { useState, useEffect, Fragment } from "react"
import { RadioGroup, FormControlLabel, Radio, FormGroup, Checkbox } from "@mui/material"

type AssessmentBuilderProps = {
    questionText: string,
    questionType: string, //MCQ, MULTI_CORRECT, SHORT_ANSWER, TRUE_FALSE
    options?: any[],
    correctAnswer?: string,
    id: any,
    handleSolution?: any
}



export default function AssessmentBuilder({ questionText, questionType, options = ["TRUE", "FALSE"], id, handleSolution }: AssessmentBuilderProps) {
    const [selectedAnswers, setSelectedAnswers] = useState([])

    return (
        <div className="w-[350px] md:w-[600px] flex gap-[10px] flex-col">
            <div className={`text-[15px] md:text-[25px] borde bg-[#2dcd7c p-[16px] font-[400] text-[20px] text-[gray] `}>
                {questionText}
                {questionType == "MULTI_CORRECT" && (<h2 className="text-[14px] mt-[10px] font-[400]">
                    {"*This is a multiple choice question. Select all answers that apply"}
                </h2>)}
            </div>



            {questionType == "MULTI_CORRECT" && (
                <div className="flex flex-col gap-[5px] items-start">
                    {options.map((option: any, index: any) => {
                        return (
                            <Fragment key={index}>
                                <div className="flex gap-[5px] bg-[beige] w-full items-center text-[20px] font-[600]">
                                    <Checkbox
                                        name={option.optionText}
                                        value={option.isCorrect}
                                        onChange={(e) => { handleSolution(e, id, option) }}
                                    />
                                    <label htmlFor={option.optionText}>{option.optionText}</label>
                                </div>
                            </Fragment>
                        )
                    })}
                </div>
            )}

            {questionType == "MCQ" && (
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => { handleSolution(e, id, options) }}
                    className="borde pl-[10px] flex flex-col gap-[5px]"
                >
                    {options.map((option: any, index: any) => {
                        return (
                            <Fragment key={index}>
                                <FormControlLabel className="borde w-[103%] bg-[beige]" value={option.optionText} control={<Radio />} label={option.optionText} />
                            </Fragment>
                        )
                    })}
                </RadioGroup>
            )}

            {questionType == "TRUE_FALSE" && (
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    name="radio-buttons-group"
                    onChange={(e) => { handleSolution(e, id, options) }}
                    className="borde px-[10px] bg-[beige]"
                >
                    {options.map((option: any, index: any) => {
                        return (
                            <Fragment key={index}>
                                <FormControlLabel value={option.optionText} control={<Radio />} label={option.optionText} />
                            </Fragment>
                        )
                    })}
                </RadioGroup>
            )}

            {questionType == "SHORT_ANSWER" && (
                <textarea
                    onChange={(e) => { handleSolution(e, id) }}
                    className="border-[#2dcd7c] border mt-[5px]"
                />
            )}

        </div>
    )
}