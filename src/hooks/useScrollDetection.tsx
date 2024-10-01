"use client";
import { useScroll, useMotionValueEvent } from "framer-motion";
import React from "react";

const useScrollDetection = () => {
    const [scrolledTop, setScrolledTop] = React.useState(true);
    const { scrollY } = useScroll();

    useMotionValueEvent(scrollY, "change", (latest) => {
        
        if(latest == 0){
            setScrolledTop(true)
        }
        else{
            setScrolledTop(false)
        }
    });

    return scrolledTop;
};

export default useScrollDetection;