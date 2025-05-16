"use client";

import Webcam from 'react-webcam';
import Rect, { useRef } from 'react';
import { useState } from 'react';

export default function WebCam() {
    const webcamRef = useRef<Webcam>(null);
    
    return (
        <Webcam ref={webcamRef} />
    )
}