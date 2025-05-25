"use client";

import Webcam from 'react-webcam';
import Rect, { useRef } from 'react';
import { useState } from 'react';

export default function WebCam() {
    const [openWebcam, setOpenWebcam] = useState(false);

    const webcamRef = useRef<Webcam>(null);    

    if(openWebcam) {
        return (
            <div className="flex flex-col items-center">
                <button onClick={() => setOpenWebcam(false)} className="border bg-blue-400 p-1 rounded text-white">Close Webcam</button>
                <Webcam ref={webcamRef} />
                <h1>Webcam not functional because you look like Shrek</h1>
            </div>
            
        )
    } else {
        return (
            <div>
                <button onClick={() => setOpenWebcam(true)} className="border bg-blue-400 p-1 rounded text-white">Open Webcam</button>
            </div>
        )
    }
}