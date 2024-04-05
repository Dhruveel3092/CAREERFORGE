import React ,{ useState } from "react";
import { Modal, Button, DatePicker } from "antd";
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import { IoWarning } from "react-icons/io5";
import moment from 'moment';

const EducationAddModal = ({
  educationAddModal,
  setEducationAddModal,
  formData,
  setFormData,
  addEducation,
}) => {

  const [hasWarning, setHasWarning] = useState(0);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
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
      toast.error("Please resolve the warning to add education", toastOptions);
    else if(formData.school.length==0)
      toast.error("School is a required field", toastOptions);
    else
      addEducation();
    console.log(formData);
  };

  const handleStartDateChange = (date) => {
    const currentDate = moment();
    if (date && date.isAfter(currentDate)) {
        toast.error("Start date cannot be after the current date", toastOptions);
    }else if (formData.endDate && date && date.isAfter(formData.endDate)) {
      toast.error("Start date cannot be greater than end date", toastOptions);
    } else {
      handleChange({ target: { name: "startDate", value: date } });
    }
  };

  const handleEndDateChange = (date) => {
    if (formData.startDate && date && date.isBefore(formData.startDate)) {
      toast.error("End date cannot be earlier than start date", toastOptions);
    } else {
      handleChange({ target: { name: "endDate", value: date } });
    }
  };

  const getMaxLength = (fieldName) => {
    switch (fieldName) {
      case "school":
        return 150;
      case "degree":
        return 100;
      case "fieldOfStudy":
        return 100;
      case "grade":
        return 80;
      case "activitiesAndSocieties":
        return 500;
      case "description":
        return 1000;
      default:
        return Infinity;
    }
  };

  return (
    <div>
      <Modal
        title="Add Education"
        centered
        open={educationAddModal}
        onCancel={() => {
          setEducationAddModal(false);
          setFormData({
            school: "",
            degree: "",
            fieldOfStudy: "",
            startDate: null,
            endDate: null,
            grade: "",
            activitiesAndSocieties: "",
            description: "",
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
        <form className="education-form">
          <input
            className={`input ${formData.school.length>150 ? "input-error" : "" }`}
            type="text"
            name="school"
            placeholder="School"
            value={formData.school}
            onChange={handleChange}
          />
          {formData.school.length>150 && <div className="warning"><IoWarning/>Exceeded maximum character length of 150</div>}

          <input
            className={`input ${formData.degree.length>100 ? "input-error" : "" }`}
            type="text"
            name="degree"
            placeholder="Degree"
            value={formData.degree}
            onChange={handleChange}
          />
          {formData.degree.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <input
            className={`input ${formData.fieldOfStudy.length>100 ? "input-error" : "" }`}
            type="text"
            name="fieldOfStudy"
            placeholder="Field of Study"
            value={formData.fieldOfStudy}
            onChange={handleChange}
          />
          {formData.fieldOfStudy.length>100 && <div className="warning"><IoWarning/>Exceeded maximum character length of 100</div>}
          
          <div className="date-inputs">
            <DatePicker
              placeholder="Start Date"
              value={formData.startDate}
              onChange={handleStartDateChange}
            />
            <DatePicker
              placeholder="End Date"
              value={formData.endDate}
              onChange={handleEndDateChange}
            />
          </div>
          
          <input
            className={`input ${formData.grade.length>80 ? "input-error" : "" }`}
            type="text"
            name="grade"
            placeholder="Grade"
            value={formData.grade}
            onChange={handleChange}
          />
          {formData.grade.length>80 && <div className="warning"><IoWarning/>Exceeded maximum character length of 80</div>}
          
          <textarea
            className={`input ${formData.activitiesAndSocieties.length>500 ? "input-error" : "" }`}
            name="activitiesAndSocieties"
            placeholder="Activities and Societies"
            value={formData.activitiesAndSocieties}
            onChange={handleChange}
          />
          <div className="char-count">{`${formData.activitiesAndSocieties.length}/500`}</div>
          {formData.activitiesAndSocieties.length>500 && <div className="warning"><IoWarning/>Exceeded maximum character length of 500</div>}
          
          <textarea
            className={`input ${formData.description.length>1000 ? "input-error" : "" }`}
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <div className="char-count">{`${formData.description.length}/1000`}</div>
          {formData.description.length>1000 && <div className="warning"><IoWarning/>Exceeded maximum character length of 1000</div>}
        </form>
        {/* <ToastContainer /> */}
      </Modal>
    </div>
  );
};

export default EducationAddModal;
