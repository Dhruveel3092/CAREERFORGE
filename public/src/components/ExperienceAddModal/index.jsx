import React ,{ useState } from "react";
import { Modal, Button, DatePicker, Select, Checkbox } from "antd";
import "./index.css";
import { toast } from "react-toastify";
import { IoWarning } from "react-icons/io5";
import moment from 'moment';

const ExperienceAddModal = ({
  experinceAddModal,
  setExperienceAddModal,
  experinceData,
  setExperienceData,
  addExperience,
}) => {

  const [hasWarning, setHasWarning] = useState(0);
  const [endDateDisable,setEndDateDisable] = useState(false);
  const { Option } = Select;

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExperienceData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    if (value.length > getMaxLength(name)) {
      setHasWarning(hasWarning+1);
    } else {
      setHasWarning(hasWarning-1);
    }

  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(hasWarning>0)
      toast.error("Please resolve the warning to add experience", toastOptions);
    else if(
        experinceData.company.length==0 || 
        experinceData.role.length==0 || 
        experinceData.startDate==null || 
        (experinceData.endDate==null && experinceData.currently_working==false) || 
        experinceData.industry.length==0
    )
      toast.error("Please fillup required field", toastOptions);
    else
      addExperience();
    console.log(experinceData);
  };

  const handleStartDateChange = (date) => {
    const currentDate = moment();
    if (date && date.isAfter(currentDate)) {
        toast.error("Start date cannot be after the current date", toastOptions);
    }else if (experinceData.endDate && date && date.isAfter(experinceData.endDate)) {
      toast.error("Start date cannot be greater than end date", toastOptions);
    } else {
      handleChange({ target: { name: "startDate", value: date } });
    }
  };

  const handleEndDateChange = (date) => {
    const currentDate = moment();
    if (date && date.isAfter(currentDate)) {
        toast.error("End date cannot be after the current date", toastOptions);
    }else if (experinceData.startDate && date && date.isBefore(experinceData.startDate)) {
      toast.error("End date cannot be earlier than start date", toastOptions);
    } else {
      handleChange({ target: { name: "endDate", value: date } });
    }
  };

  const getMaxLength = (fieldName) => {
    switch (fieldName) {
      case "company":
        return 100;
      case "role":
        return 100;
      case "industry":
        return 100;
      case "location":
        return 100;
      case "description":
        return 2000;
      default:
        return Infinity;
    }
  };

  return (
    <div>
      <Modal
        title="Add Experience"
        centered
        open={experinceAddModal}
        onCancel={() => {
          setExperienceAddModal(false);
          setExperienceData({
            company: "",
            role: "",
            currently_working: false,
            startDate: null,
            endDate: null,
            industry: "",
            employment_type: "",
            description: "",
            location: "",
            location_type: "",
          });
        }}
        footer={[
          <Button 
            key="submit" 
            type="primary" 
            onClick={handleSubmit}
          >
            Save
          </Button>
        ]}
      >
        <div className="required-instruction">* Indicates required fields</div>
        <form className="education-form">
          <input
            className={`input ${experinceData.company.length>100 ? "input-error" : "" }`}
            type="text"
            name="company"
            placeholder="Company*"
            value={experinceData.company}
            onChange={handleChange}
          />
          {experinceData.company.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}

          <input
            className={`input ${experinceData.role.length>100 ? "input-error" : "" }`}
            type="text"
            name="role"
            placeholder="Role*"
            value={experinceData.role}
            onChange={handleChange}
          />
          {experinceData.role.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <input
            className={`input ${experinceData.industry.length>100 ? "input-error" : "" }`}
            type="text"
            name="industry"
            placeholder="Industry*"
            value={experinceData.industry}
            onChange={handleChange}
          />
          {experinceData.industry.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <Checkbox
            className="check-box"
            name="currently_working"
            checked={experinceData.currently_working}
            onChange={(e) => {
                handleChange({ target: { name: "currently_working", value:e.target.checked } })
                setEndDateDisable(e.target.checked)
                }
            }
            >
            I am currently working in this role
          </Checkbox>


          <div className="date-inputs">
            <DatePicker
              placeholder="Start Date*"
              value={experinceData.startDate}
              onChange={handleStartDateChange}
            />
            <DatePicker
              placeholder="End Date*"
              value={experinceData.endDate}
              onChange={handleEndDateChange}
              disabled={endDateDisable}
            />
          </div>

          <Select
            className="options"
            placeholder="Employment Type"
            name="employment_type"
            value={experinceData.employment_type || null}
            onChange={(value) => handleChange({ target: { name: "employment_type", value } })}
          >
            <Option value="Full-time">Full-time</Option>
            <Option value="Part-time">Part-time</Option>
            <Option value="Self-employed">Self-employed</Option>
            <Option value="Freelance">Freelance</Option>
            <Option value="Internship">Internship</Option>
            <Option value="Trainee">Trainee</Option>
          </Select>
           
          <input
            className={`input ${experinceData.location.length>100 ? "input-error" : "" }`}
            type="text"
            name="location"
            placeholder="Location"
            value={experinceData.location}
            onChange={handleChange}
          />
          {experinceData.location.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}

          <Select
            className="options"
            placeholder="Location Type"
            name="location_type"
            value={experinceData.location_type || null}
            onChange={(value) => handleChange({ target: { name: "location_type", value } })}
          >
            <Option value="On-site">On-site</Option>
            <Option value="Hybrid">Hybrid</Option>
            <Option value="Remote">Remote</Option>
          </Select>

          <textarea
            className={`input ${experinceData.description.length>2000 ? "input-error" : "" }`}
            name="description"
            placeholder="Description"
            value={experinceData.description}
            onChange={handleChange}
          />
          <div className="char-count">{`${experinceData.description.length}/2000`}</div>
          {experinceData.description.length>2000 && <div className="warning"><IoWarning/>Exceeded maximum character length of 2000</div>}
        </form>
      </Modal>
    </div>
  );
};

export default ExperienceAddModal;
