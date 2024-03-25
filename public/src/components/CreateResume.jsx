import React,{useEffect,useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Resume.css';
import styled from "styled-components";
import Topbar from "../components/Topbar/index";
import { Container } from '@mui/system';


export default function CreateResume() {

    const [currentUser, setCurrentUser] = useState(undefined);
    const [values, setValues] = useState({ firstname: "", middlename: "" ,lastname:"",designation:"",address:"",email:"",phoneno:"",summary:"",
    edu_school:"",edu_degree:"",edu_city:"",edu_start_date:"",edu_graduation_date:"",edu_description:"",proj_title:"",proj_link:"",proj_description:"",skill:""});
    const[ach,setach]=useState(0);
    const [accordionItems, setAccordionItems] = React.useState([
        { id: 1, achieve_title:"",achieve_description:""},
      ]);
      const [accordionItems2, setAccordionItems2] = React.useState([
        { id: 1, exp_title:"",exp_organization:"",exp_location:"",exp_start_date:"",exp_end_date:"",exp_description:"" },
      ]);

      const addAccordion = () => {
        const newAccordion = { id: Date.now(), content: '', isOpen: false };
        setAccordionItems([...accordionItems, newAccordion]);
      };
    
     const deleteAccordion = (id) => {
      const updatedAccordions = accordionItems.filter((item) => item.id !== id);
      setAccordionItems(updatedAccordions);
    };

    const navigate=useNavigate();
    useEffect(() => {
        const fetchData = async () => {
          if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
            navigate("/login");
          } else {
            setCurrentUser(
              await JSON.parse(
                localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
              )
            );
          }
    
        };
    
        
        fetchData();
      }, []);

        const handleChange=(event)=>{
                setValues({ ...values, [event.target.name]: event.target.value });
        }
      

  return (

    <>
   <Topbar currentUser={currentUser}/>
<Container>
    <div class="body">
        <section id = "about-sc" class = "">
            <div class = "container">
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
                                        <input name = "firstname" type = "text" class = "form-control firstname" id = "" onkeyup="generateCV()" placeholder="e.g. John" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Middle Name <span class = "opt-text">(optional)</span></label>
                                        <input name = "middlename" type = "text" class = "form-control middlename" id = "" onkeyup="generateCV()" placeholder="e.g. Herbert" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Last Name</label>
                                        <input name = "lastname" type = "text" class = "form-control lastname" id = "" onkeyup="generateCV()" placeholder="e.g. Doe" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>

                                <div class="cols-3">
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Your Image</label>
                                        <input name = "image" type = "file" class = "form-control image" id = "" accept = "image/*" onchange="previewImage()" onChange={(e)=>handleChange(e)}/>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Designation</label>
                                        <input name = "designation" type = "text" class = "form-control designation" id = "" onkeyup="generateCV()" placeholder="e.g. Sr.Accountants" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Address</label>
                                        <input name = "address" type = "text" class = "form-control address" id = "" onkeyup="generateCV()" placeholder="e.g. Lake Street-23" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>

                                <div class = "cols-3">
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Email</label>
                                        <input name = "email" type = "text" class = "form-control email" id = "" onkeyup="generateCV()" placeholder="e.g. johndoe@gmail.com" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Phone No:</label>
                                        <input name = "phoneno" type = "text" class = "form-control phoneno" id = "" onkeyup="generateCV()" placeholder="e.g. 456-768-798, 567.654.002" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                    <div class = "form-elem">
                                        <label for = "" class = "form-label">Summary</label>
                                        <input name = "summary" type = "text" class = "form-control summary" id = "" onkeyup="generateCV()" placeholder="e.g. Doe" onChange={(e)=>handleChange(e)}/>
                                        <span class="form-text"></span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>achievements</h3>
                            </div>
                            {accordionItems.map((acc)=>
                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-a">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-achievement">
                                            <div class = "cols-2">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Title</label>
                                                    <input name = "achieve_title" type = "text" class = "form-control achieve_title" id = "" onkeyup="generateCV()" placeholder="e.g. johndoe@gmail.com" 
                                                    onChange={(e)=>{
                                                        acc.achieve_title=e.target.value;
                                                     
                                                    }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "achieve_description" type = "text" class = "form-control achieve_description" id = "" onkeyup="generateCV()" placeholder="e.g. johndoe@gmail.com"
                                                     onChange={(e)=>{
                                                        acc.achieve_description=e.target.value;
                                                     }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>
                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn"   onClick={(e) => {  deleteAccordion(acc.id);}}>-</button>
                                        </div>
                                    </div>
                                </div>
                               
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn" onClick={addAccordion}>+</button>

                            </div>
                                )}
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>experience</h3>
                            </div>

                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-b">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Title</label>
                                                    <input name = "exp_title" type = "text" class = "form-control exp_title" id = "" onkeyup="generateCV()" 
                                                    onChange={(e)=>{

                                                    }}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Company / Organization</label>
                                                    <input name = "exp_organization" type = "text" class = "form-control exp_organization" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Location</label>
                                                    <input name = "exp_location" type = "text" class = "form-control exp_location" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Start Date</label>
                                                    <input name = "exp_start_date" type = "date" class = "form-control exp_start_date" id = "" onkeyup="generateCV()"onChange={(e)=>handleChange(e)} />
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">End Date</label>
                                                    <input name = "exp_end_date" type = "date" class = "form-control exp_end_date" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "exp_description" type = "text" class = "form-control exp_description" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn">-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn">+</button>
                            </div>
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>education</h3>
                            </div>

                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-c">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">School</label>
                                                    <input name = "edu_school" type = "text" class = "form-control edu_school" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Degree</label>
                                                    <input name = "edu_degree" type = "text" class = "form-control edu_degree" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">City</label>
                                                    <input name = "edu_city" type = "text" class = "form-control edu_city" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Start Date</label>
                                                    <input name = "edu_start_date" type = "date" class = "form-control edu_start_date" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">End Date</label>
                                                    <input name = "edu_graduation_date" type = "date" class = "form-control edu_graduation_date" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "edu_description" type = "text" class = "form-control edu_description" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>

                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn">-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn">+</button>
                            </div>
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>projects</h3>
                            </div>

                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-d">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-experience">
                                            <div class = "cols-3">
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Project Name</label>
                                                    <input name = "proj_title" type = "text" class = "form-control proj_title" id = "" onkeyup="generateCV()"onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Project link</label>
                                                    <input name = "proj_link" type = "text" class = "form-control proj_link" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                                <div class = "form-elem">
                                                    <label for = "" class = "form-label">Description</label>
                                                    <input name = "proj_description" type = "text" class = "form-control proj_description" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                    <span class="form-text"></span>
                                                </div>
                                            </div>
                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn">-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn">+</button>
                            </div>
                        </div>

                        <div class="cv-form-blk">
                            <div class = "cv-form-row-title">
                                <h3>skills</h3>
                            </div>

                            <div class = "row-separator repeater">
                                <div class = "repeater" data-repeater-list = "group-e">
                                    <div data-repeater-item>
                                        <div class = "cv-form-row cv-form-row-skills">
                                            <div class = "form-elem">
                                                <label for = "" class = "form-label">Skill</label>
                                                <input name = "skill" type = "text" class = "form-control skill" id = "" onkeyup="generateCV()" onChange={(e)=>handleChange(e)}/>
                                                <span class="form-text"></span>
                                            </div>
                                            
                                            <button data-repeater-delete type = "button" class = "repeater-remove-btn">-</button>
                                        </div>
                                    </div>
                                </div>
                                <button type = "button" data-repeater-create value = "Add" class = "repeater-add-btn">+</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </section>

       
        </div>
        </Container>
    </>

  )
}



