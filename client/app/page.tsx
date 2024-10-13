'use client'
import React,{FC,useState} from "react";
import Heading from "./Utils/Heding";
import Header from "./components/Header";   
import Hero from "./components/Route/Hero";

interface Props{};
const Page:FC<Props> = (props)=>{
  const [open, setOpen] = useState(false);
  const[activeItem,setActiveItem] = useState(0);
  return (
    <div>
      <Heading 
      title="EduFlow"
      description="EEduFlow is a platform offering interactive learning experiences. It enables seamless course management, collaboration, and assessments, making education engaging and effective for both students and teachers."
      keywords="Programming ,MERN , ML, Redux"
      />
      <Header
      open={open}
      setOpen={setOpen}
      activeItem={activeItem}
      />
      <Hero/>
    </div>
  )
};

export default Page;