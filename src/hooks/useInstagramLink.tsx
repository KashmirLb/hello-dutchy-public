import { useEffect, useState } from "react"

const useInstagramLink = () => {

    const [ instagramLink, setInstagramLink ] = useState<string>("https://www.instagram.com/hello_dutchy_design/")
    useEffect(()=>{
        if(navigator != undefined){
            const userAgent = navigator.userAgent || navigator.vendor
            //Checking Android 
            if (/android/i.test(userAgent)) {
                setInstagramLink("intent://instagram.com/_u/hello_dutchy_design#Intent;package=com.instagram.android;scheme=https;end")
            }
        
            // iOS detection from: http://stackoverflow.com/a/9039885/177710
            if (/iPad|iPhone|iPod/.test(userAgent)) {
                setInstagramLink("instagram://user?username=hello_dutchy_design")
            }
        }
        else{
            setInstagramLink("https://www.instagram.com/hello_dutchy_design/")
        }
    },[])

  
    return instagramLink
}
export default useInstagramLink