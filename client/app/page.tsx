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
      description="Edu Flow is a platform that provides...."
      keywords="Programming ,MERN , ML"
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