import React ,{ useState } from "react";
import { Modal, Button, DatePicker, Select, Checkbox } from "antd";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import { IoWarning } from "react-icons/io5";
import moment from 'moment';

const ExperienceUpdateModal = ({
  experience,
  experienceUpdateModal,
  setExperienceUpdateModal,
  deleteExperienceModal,
  setDeleteExperienceModal,
  updatedExperienceData,
  setUpdatedExperienceData,
  updateExperience
}) => {

  const [hasWarning, setHasWarning] = useState(0);
  const [endDateDisable,setEndDateDisable] = useState(updatedExperienceData?.currently_working);
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
    setUpdatedExperienceData((prevData) => ({
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
        updatedExperienceData?.company.length==0 || 
        updatedExperienceData?.role.length==0 || 
        updatedExperienceData?.startDate==null || 
        (updatedExperienceData?.endDate==null && updatedExperienceData?.currently_working==false) || 
        updatedExperienceData?.industry.length==0
    )
      toast.error("Please fillup required field", toastOptions);
    else
      updateExperience();
    console.log(updatedExperienceData);
  };

  const handleStartDateChange = (date) => {
    const currentDate = moment();
    if (date && date.isAfter(currentDate)) {
        toast.error("Start date cannot be after the current date", toastOptions);
    }else if (updatedExperienceData?.endDate && date && date.isAfter(updatedExperienceData?.endDate)) {
      toast.error("Start date cannot be greater than end date", toastOptions);
    } else {
      handleChange({ target: { name: "startDate", value: date } });
    }
  };

  const handleEndDateChange = (date) => {
    const currentDate = moment();
    if (date && date.isAfter(currentDate)) {
        toast.error("End date cannot be after the current date", toastOptions);
    }else if (updatedExperienceData?.startDate && date && date.isBefore(updatedExperienceData?.startDate)) {
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
        title="Edit Experience"
        centered
        open={experienceUpdateModal}
        onCancel={() => {
          setExperienceUpdateModal(false);
          setUpdatedExperienceData(experience);
          setEndDateDisable(experience.currently_working);
        }}
        footer={[
          <Button
            key="delete"
            danger 
            onClick={ () => setDeleteExperienceModal(true) } 
          >
            Delete Experience
          </Button>,
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
            className={`input ${updatedExperienceData?.company.length>100 ? "input-error" : "" }`}
            type="text"
            name="company"
            placeholder="Company*"
            value={updatedExperienceData?.company}
            onChange={handleChange}
          />
          {updatedExperienceData?.company.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}

          <input
            className={`input ${updatedExperienceData?.role.length>100 ? "input-error" : "" }`}
            type="text"
            name="role"
            placeholder="Role*"
            value={updatedExperienceData?.role}
            onChange={handleChange}
          />
          {updatedExperienceData?.role.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <input
            className={`input ${updatedExperienceData?.industry.length>100 ? "input-error" : "" }`}
            type="text"
            name="industry"
            placeholder="Industry*"
            value={updatedExperienceData?.industry}
            onChange={handleChange}
          />
          {updatedExperienceData?.industry.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <Checkbox
            className="check-box"
            name="currently_working"
            checked={updatedExperienceData?.currently_working}
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
              value={updatedExperienceData?.startDate ? moment(updatedExperienceData?.startDate) : null}
              onChange={handleStartDateChange}
            />
            <DatePicker
              placeholder="End Date*"
              value={updatedExperienceData?.endDate ? moment(updatedExperienceData?.endDate) : null}
              onChange={handleEndDateChange}
              disabled={endDateDisable}
            />
          </div>
          <Select
            className="options"
            placeholder="Employment Type"
            name="employment_type"
            value={updatedExperienceData?.employment_type || null}
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
            className={`input ${updatedExperienceData?.location.length>100 ? "input-error" : "" }`}
            type="text"
            name="location"
            placeholder="Location"
            value={updatedExperienceData?.location}
            onChange={handleChange}
          />
          {updatedExperienceData?.location.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}

          <Select
            className="options"
            placeholder="Location Type"
            name="location_type"
            value={updatedExperienceData?.location_type || null}
            onChange={(value) => handleChange({ target: { name: "location_type", value } })}
          >
            <Option value="On-site">On-site</Option>
            <Option value="Hybrid">Hybrid</Option>
            <Option value="Remote">Remote</Option>
          </Select>

          <textarea
            className={`input ${updatedExperienceData?.description.length>2000 ? "input-error" : "" }`}
            name="description"
            placeholder="Description"
            value={updatedExperienceData?.description}
            onChange={handleChange}
          />
          <div className="char-count">{`${updatedExperienceData?.description.length}/2000`}</div>
          {updatedExperienceData?.description.length>2000 && <div className="warning"><IoWarning/>Exceeded maximum character length of 2000</div>}
        </form>

      </Modal>
      <ToastContainer/>
    </div>
  );
};

export default ExperienceUpdateModal;
