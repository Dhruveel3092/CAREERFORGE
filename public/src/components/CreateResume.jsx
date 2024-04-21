import React,{useEffect,useState,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import './Resume.css';
import  {useReactToPrint}  from "react-to-print";
import styled from "styled-components";
import Topbar from "../components/Topbar/index";
import axios from 'axios';
import { host} from "../utils/APIRoutes";
import { Container } from '@mui/system';
import { Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faEnvelope, faLocationDot } from "@fortawesome/free-solid-svg-icons";

export default function CreateResume() {
    const componentRef = useRef();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [values, setValues] = useState({ firstname: "", middlename: "" ,lastname:"",designation:"",address:"",email:"",phoneno:"",summary:"",});
    const[ach,setach]=useState('');
    const [Items, setItems] = React.useState([
        { id: 1, achieve_title:"",achieve_description:""},
      ]);
      const [Items2, setItems2] = React.useState([
        { id: 1, exp_title:"",exp_organization:"",exp_location:"",exp_start_date:"",exp_end_date:"",exp_description:"" },
      ]);
      const [Items3, setItems3] = React.useState([
        { id: 1, edu_school:"",edu_degree:"",edu_city:"",edu_start_date:"",edu_graduation_date:"",edu_description:"" },
      ]);
      const [Items4, setItems4] = React.useState([
        { id: 1 ,project_title:"",project_link:"",proj_description:"" },
      ]);
      const [Items5, setItems5] = React.useState([
        { id: 1, skill:"" },
      ]);
      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get(`${host}/login/sucess`, { withCredentials: true });
           if(response.data.user) setCurrentUser(response.data.user);
           // console.log("current",currentUser)
           // console.log("response",response.data.user)
        } catch (error) {
          console.log(error)
          navigate("/login")
        }
    
        }
        
        fetchData();
      }, []);
      const addAccordion = () => {
        let newAccordion = { id: Date.now(), achieve_title:"",achieve_description:"" };
        setItems([...Items, newAccordion]);
      };
    
     const deleteAccordion = (id) => {
      let updatedAccordions = Items.filter((item) => item.id !== id);
      setItems(updatedAccordions);
    };
    const addAccordion2 = () => {
        let newAccordion = { id: Date.now(), exp_title:"",exp_organization:"",exp_location:"",exp_start_date:"",exp_end_date:"",exp_description:"" };
        setItems2([...Items2, newAccordion]);
      };
    
     const deleteAccordion2 = (id) => {
      let updatedAccordions = Items2.filter((item) => item.id !== id);
      setItems2(updatedAccordions);
    };
    const addAccordion3 = () => {
        let newAccordion = { id: Date.now(), edu_school:"",edu_degree:"",edu_city:"",edu_start_date:"",edu_graduation_date:"",edu_description:"" };
        setItems3([...Items3, newAccordion]);
      };
    
     const deleteAccordion3 = (id) => {
      let updatedAccordions = Items3.filter((item) => item.id !== id);
      setItems3(updatedAccordions);
    };
    const addAccordion4 = () => {
        let newAccordion = { id: Date.now(), project_link:"",proj_description:"" };
        setItems4([...Items4, newAccordion]);
      };
    
     const deleteAccordion4 = (id) => {
      let updatedAccordions = Items4.filter((item) => item.id !== id);
      setItems4(updatedAccordions);
    };
    const addAccordion5 = () => {
        let newAccordion = { id: Date.now(), skill:"" };
        setItems5([...Items5, newAccordion]);
      };
    
     const deleteAccordion5 = (id) => {
      let updatedAccordions = Items5.filter((item) => item.id !== id);
      setItems5(updatedAccordions);
    };


    const printCV = useReactToPrint({
        content: () => componentRef.current,
      });

    const navigate=useNavigate();

  

        const handleChange=(event)=>{
                setValues({ ...values, [event.target.name]: event.target.value });
        }
      

  return (

    <>
   <Topbar currentUser={currentUser}/>
<Container>
    <div class="body" >
        <section id = "about-sc" class = "">
            <div class = "container resume-container">
                <div class = "about-cnt">
                    <form action="" class="cv-form" id = "cv-form" >
                        <div class = "cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>about section</h3>
                            </div>
                            <div class = "cv-form-row cv-form-row-about">
                                <div class = "cols-3">
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">First Name</label>
                                        <input name = "firstname" type = "text" class = "form-control firstname" id = ""  placeholder="firstname" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Middle Name <span class = "opt-text">(optional)</span></label>
                                        <input name = "middlename" type = "text" class = "form-control middlename" id = ""  placeholder="middlename" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Last Name</label>
                                        <input name = "lastname" type = "text" class = "form-control lastname" id = ""  placeholder="lastname" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>

                                <div class="cols-3">
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Your Image Link</label>
                                        <input name = "image" type = "text" class = "form-control image" id = "" accept = "image/*" onchange="previewImage()" onChange={(e)=>handleChange(e)}/>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Designation</label>
                                        <input name = "designation" type = "text" class = "form-control designation" id = ""  placeholder="e.g. Softare Enginner" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Address</label>
                                        <input name = "address" type = "text" class = "form-control address" id = ""  placeholder="e.g. Location" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>

                                <div class = "cols-3">
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Email</label>
                                        <input name = "email" type = "text" class = "form-control email" id = "" placeholder="e.g. krish@gmail.com" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Phone No:</label>
                                        <input name = "phoneno" type = "text" class = "form-control phoneno" id = ""  placeholder="e.g. 4526768798" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Summary</label>
                                        <input name = "summary" type = "text" class = "form-control summary" id = ""  placeholder="e.g. Info about yourself" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>achievements</h3>
                            </div>
                            {Items.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-a">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-achievement">
                                            <div class = "cols-2">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Title</label>
                                                    <input name = "achieve_title" type = "text" class = "form-control achieve_title" id = "" placeholder="e.g. Achievement" 
                                                    onChange={(e)=>{
                                                        acc.achieve_title=e.target.value;
                                                        setach(['scas']);
                                                        
                                                    }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "achieve_description" type = "text" class = "form-control achieve_description" id = ""  placeholder=""
                                                     onChange={(e)=>{
                                                        acc.achieve_description=e.target.value;
                                                        setach([]);
                                                     }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>
                                            <button data-repeater-delete type = "button resume-btn" class = "repeater-remove-btn"   onClick={(e) => {  deleteAccordion(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                               
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn resume-btn" onClick={addAccordion}>+</button>

                            </div>
                                )}
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>experience</h3>
                            </div>
                            {Items2.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-b">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Title</label>
                                                    <input name = "exp_title" type = "text" class = "form-control exp_title" id = ""  
                                                    onChange={(e)=>{
                                                        acc.exp_title=e.target.value;
                                                        setach([]);
                                                    }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Company / Organization</label>
                                                    <input name = "exp_organization" type = "text" class = "form-control exp_organization" id = ""  
                                                    onChange={(e)=>{
                                                        acc.exp_organization=e.target.value;
                                                        setach([]);
                                                     } }/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Location</label>
                                                    <input name = "exp_location" type = "text" class = "form-control exp_location" id = "" 
                                                     onChange={(e)=>{
                                                        acc.exp_location=e.target.value;
                                                        setach([]);
                                                     } }
                                                     />
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Start Year</label>
                                                    <input name = "exp_start_date" type = "number" class = "form-control exp_start_date" id = "" 
                                                      onChange={(e)=>{
                                                        acc.exp_start_date=e.target.value;
                                                        setach([]);
                                                     } } />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">End Year</label>
                                                    <input name = "exp_end_date" type = "number" class = "form-control exp_end_date" id = ""
                                                    onChange={(e)=>{
                                                        acc.exp_end_date=e.target.value;
                                                        setach([]);
                                                     } }/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "exp_description" type = "text" class = "form-control exp_description" id = ""  
                                                     onChange={(e)=>{
                                                        acc.exp_description=e.target.value;
                                                        setach([]);
                                                     } }/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn resume-btn" onClick={(e) => {deleteAccordion2(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn resume-btn" onClick={addAccordion2}>+</button>
                            </div>
                            )}
                        </div>

                        <div class="cv-form-blk"  >
                            <div class = "cv-form-row-title">
                                <h3>Educations</h3>
                            </div>
                            {Items3.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-c">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">School</label>
                                                    <input name = "edu_school" type = "text" class = "form-control edu_school" id = "" 
                                                    onChange={(e)=>{
                                                        acc.edu_school=e.target.value;
                                                        setach(['sca']);
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Degree</label>
                                                    <input name = "edu_degree" type = "text" class = "form-control edu_degree" id = "" 
                                                     onChange={(e)=>{
                                                        acc.edu_degree=e.target.value;
                                                        setach(['']);
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">City</label>
                                                    <input name = "edu_city" type = "text" class = "form-control edu_city" id = ""
                                                     onChange={(e)=>{
                                                        acc.edu_city=e.target.value;
                                                        setach([]);
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Start Year</label>
                                                    <input name = "edu_start_date" type = "number" class = "form-control edu_start_date" id = ""
                                                      onChange={(e)=>{
                                                       acc.edu_start_date=e.target.value;
                                                        setach([]);
                                                     } }
                                                     />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">End Year</label>
                                                    <input name = "edu_graduation_date" type = "number" class = "form-control edu_graduation_date" id = "" 
                                                     onChange={(e)=>{
                                                        acc.edu_graduation_date=e.target.value;
                                                        setach([]);
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "edu_description" type = "text" class = "form-control edu_description" id = "" 
                                                    onChange={(e)=>{
                                                        acc.edu_description=e.target.value;
                                                        setach([]);
                                                        
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn resume-btn" onClick={(e) => {deleteAccordion3(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn resume-btn" onClick={addAccordion3}>+</button>
                            </div>
                            )}
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>projects</h3>
                            </div>
                            {Items4.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-d">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Project Name</label>
                                                    <input name = "proj_title" type = "text" class = "form-control proj_title" id = "" 
                                                    onChange={(e)=>{
                                                        acc.project_title=e.target.value;
                                                        setach([]);
                                                     } }
                                                    />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Project link</label>
                                                    <input name = "proj_link" type = "text" class = "form-control proj_link" id = "" 
                                                    onChange={(e)=>{
                                                        acc.project_link=e.target.value;
                                                        setach([]);
                                                     } }/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "proj_description" type = "text" class = "form-control proj_description" id = "" 
                                                       onChange={(e)=>{
                                                        acc.proj_description=e.target.value;
                                                        setach([]);
                                                     } }/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>
                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn resume-btn" onClick={(e) => {deleteAccordion4(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn resume-btn" onClick={addAccordion4}>+</button>
                            </div>
                             )}
                        </div>
                       
                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>skills</h3>
                            </div>
                            {Items5.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-e">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-skills">
                                            <div class = "form-elem">
                                                <label for = "" class = "form-label">Skill</label>
                                                <input name = "skill" type = "text" class = "form-control" id = ""  
                                                onChange={ (e)=>{
                                                    acc.skill=e.target.value
                                                    setach([]);
                                                }}/>
                                                <span class="form-text"></span>
                                            </div>
                                            
                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn resume-btn" onClick={(e) => {deleteAccordion5(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn resume-btn" onClick={addAccordion5}>+</button>
                            </div>
                              )}
                        </div>
                      
                    </form>
                </div>
            </div>
        </section>
        <div ref={componentRef} >
        <section id = "preview-sc"  class = "print_area">
            <div class = "container resume-container">
                <div class = "preview-cnt">
                    <div class = "preview-cnt-l text-white">
                        <div class = "preview-blk">
                            <div class = "preview-image">
                                <img className='resume-img' src ={values['image'] ||"https://as1.ftcdn.net/v2/jpg/02/43/12/34/1000_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.jpg"} alt = "" id = "image_dsp"/> 
                            </div>
                            <div class = "preview-item preview-item-name">
                                <span class = "preview-item-val" id = "fullname_dsp">{values['firstname']} {values['middlename']} {values['lastname']}</span>
                            </div>
                            <div class = "preview-item">
                                <span class = "preview-item-val" id = "designation_dsp">{values['designation']}</span>
                            </div>
                        </div>

                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                                <h3 >about</h3>
                            </div>
                            <div  class = "preview-item ">
                                <div class = "preview-item">
                                    <pre class = "preview-item-val " id = "email_dsp">
                                    <FontAwesomeIcon  icon={faAddressBook} /> {values['phoneno']}</pre>
                                </div>
                                <div class = "preview-item">
                                    <pre class = "preview-item-val " id = "email_dsp">
                                    <FontAwesomeIcon icon={faEnvelope} /> {values['email']}</pre>
                                </div>
                                <div class = "preview-item">
                                    <pre class = "preview-item-val" id = "address_dsp">
                                    <FontAwesomeIcon icon={faLocationDot} /> {values['address']}</pre>
                                </div>
                                
                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                                <br />
                                <h3>Summary</h3>
                            </div>
                          
                            <div class = "skills-items preview-blk-list" id = "skills_dsp">
                                  {values['summary']}
                                 </div>

                           
                        </div>
                               
                            </div>
                        </div>

                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                                <h3>skills</h3>
                            </div>
                            {Items5.map((acc)=>
                            <div class = "skills-items preview-blk-list" id = "skills_dsp">
                                  • {acc.skill}
                                 </div>
                            )}
                           
                        </div>
                    </div>

                    <div class = "preview-cnt-r">
                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                            <p className="v">ACHIEVEMENTS</p>
                            </div>
                            {Items.map((acc)=>
                                    <div class = "achievements-items preview-blk-list pb-4" id = "achievements_dsp">
                                     <p class="ach-tit">{acc.achieve_title}</p> 
                                      <p class="disc"> • {acc.achieve_description}</p>
                                    
                                    </div>
                            )}
                            
                        </div>

                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                            <p className="v">EDUCATIONS</p>
        
                            </div>
                            
                            {Items3.map((acc)=>
                                 <div id = "educations_dsp">
                                 <p class="date">{acc.edu_start_date} - {acc.edu_graduation_date} [{acc.edu_city}]</p>
                                 <p class="ach-tit"> {acc.edu_description}</p>
                                   <p class="disc" >{acc.edu_school}</p>

                                
                                 </div>
                            )}
                           
                        </div>

                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                            <p className="v">EXPERIENCES</p>
                               
                            </div>
                            {Items2.map((acc)=>
                            <div class = "experiences-items preview-blk-list pb-4" id = "experiences_dsp">
                                   <p class="date" >{acc.exp_start_date} - {acc.exp_end_date} [{acc.exp_location}]</p>
                                <p class="ach-tit">{acc.exp_title} at {acc.exp_organization}</p>
                                <p class="disc">{acc.exp_description}</p>
                             
                             
                            </div>
                            )}
                        </div>

                        <div class = "preview-blk">
                            <div class = "preview-blk-title">
                            <p className="v">PROJECTS</p>
                            </div>
                            {Items4.map((acc)=>
                            <div class = "projects-items preview-blk-lis" id = "projects_dsp">
                                 <p class="ach-tit">{acc.project_title}</p>
                                     <p class="disc">{acc.proj_description}</p>  
                                    <a class="font-light text-xl resume-link" href={acc.project_link}>Visit</a>  
                                   
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </div>
        <section class = "print-btn-sc">
            <div class = "container resume-container">
                <button type = "button" class = "btn btn-primary resume-btn" onClick={printCV}>Print CV</button>
            </div>
        </section>
        </div>
        
       
        </Container>
    </>

  )
}



