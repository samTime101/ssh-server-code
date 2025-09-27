import {useContext} from "react";
import {QuestionContext} from "../contexts/QuestionContext.js";

export const useQuestions = () => {
    if (!QuestionContext) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return useContext(QuestionContext);
}
