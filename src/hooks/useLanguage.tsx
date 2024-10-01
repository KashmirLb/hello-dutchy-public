import { useContext } from "react";
import LanguageContext from "../context/LanguageProvider";

const useLanguage = () =>{
    return useContext(LanguageContext)!
}

export default useLanguage