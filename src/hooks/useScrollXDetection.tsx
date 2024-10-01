"use client";
import React, { useEffect } from "react";

const useScrollXDetection = (element: HTMLDivElement | null, wrapperElement: HTMLDivElement | null) => {
    const [scrolledStart, setScrolledStart] = React.useState(true);
    const [scrolledEnd, setScrolledEnd] = React.useState(true);

    useEffect(() => {
        if(element && wrapperElement){
            if(element.scrollWidth == wrapperElement.scrollWidth){
                setScrolledEnd(true);
            }
            else{
                setScrolledEnd(false);
            }
        }
    }, [element, wrapperElement])

    if(element && wrapperElement){

        element.addEventListener("scroll", function (e) {            
            if(element.scrollLeft === 0) {
                setScrolledStart(true);
            }
            else{
                setScrolledStart(false);
            }
            if(element.scrollLeft + element.clientWidth === element.scrollWidth){
                setScrolledEnd(true);
            }
            else{
                setScrolledEnd(false);
            }
        }); 
    }

    const scrollRight = () => {
        if(element){
            // divide element scroll width into pieces of 266px
            const pieces = Math.round(element.scrollWidth / 266);
            // get the index of the piece that is currently visible
            const currentPiece = Math.trunc(element.scrollLeft / 266);
            // if the current piece is the last piece, scroll to the end
            if(currentPiece === 0){
                element.scrollTo({ left: 0, behavior: "smooth" });
            }
            // if the current piece is not the last piece, scroll to the next piece
            else{
                element.scrollTo({ left:(currentPiece * 266) -1, behavior: "smooth" });
            }       
        }
    }

    const scrollLeft = () => {
        if(element && wrapperElement){

            // Get the number of pieces that fit in the wrapper
            const wrapperPieces = Math.trunc(wrapperElement.scrollWidth / 266);
            const wrapperPiecesPlusPartial = wrapperElement.scrollWidth / 266;
            const leftScrolled = (element.scrollLeft / 266);

            // Remaining block:
            const partialBlockSize = wrapperPiecesPlusPartial - wrapperPieces;
            
            const scrollDifference = (266 - (partialBlockSize * 266));

            const scrollDecimails = leftScrolled - Math.trunc(leftScrolled)

            const scrollBlock = scrollDecimails * 266;


            // If next block is barely in screen...
            if(scrollBlock < (scrollDifference / 2)){
                element.scrollTo({ left: element.scrollLeft + (scrollDifference - scrollBlock), behavior: "smooth" });

            }
            // If most of next block is in screen...
            else{
                element.scrollTo({ left: element.scrollLeft + (scrollDifference - scrollBlock) + 266, behavior: "smooth" });
            }
        }
    }

   
    
    return { scrolledStart, scrolledEnd, scroll, scrollRight, scrollLeft };
};

export default useScrollXDetection;