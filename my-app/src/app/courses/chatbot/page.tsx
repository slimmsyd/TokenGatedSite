"use client";

import { useState } from "react";
import CourseContainer from "../courseContainer";

export default function ChatBot() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");

  return( 
    <CourseContainer/>

)


}