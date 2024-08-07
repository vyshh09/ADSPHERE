import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'; // Importing Axios for HTTP requests
import '@fortawesome/fontawesome-free/css/all.min.css'; // Importing FontAwesome CSS
import './styles.css' // Importing custom styles
import Displayque from './Displayque'; // Importing Displayque component

// Addque component definition
const Addque = () => {
    // State variables for managing form data
    const [que_type, setque_type] = useState('');
    const [que, setque] = useState('');
    const [options, setOptions] = useState([]);
    const [jsonName, setJsonName] = useState("");
    const [mandatory, setMandatory] = useState(false);
    const [categorize, setcategory] = useState(false);
    const [queadd, setQueadd] = useState(false);
    const [display, setdisplay] = useState(false);

    // Handle change in question type
    const handleque_typeChange = (e) => {
        setque_type(e.target.value); // Set question type
        setque(''); // Reset question text
        setOptions([]); // Reset options
        setMandatory(false) // Reset mandatory state
        setcategory(false) // Reset categorize state
    };

    // Handle change in question text
    const handlequeChange = (e) => {
        setque(e.target.value); // Set question text
    };

    // Handle change in option text
    const handleOptionChange = (e, index) => {
        const newOptions = [...options]; // Create a copy of options array
        newOptions[index] = e.target.value; // Update option at specified index
        setOptions(newOptions); // Update options state
    };

    // Add new option to the options array
    const addOption = (index) => {
        setOptions([...options, '']);
    };

    // Remove option from the options array
    const removeOption = (index) => {
        const newOptions = [...options]; // Create a copy of options array
        newOptions.splice(index, 1); // Remove option at specified index
        setOptions(newOptions); // Update options state
    };

    // Handle change in mandatory checkbox
    const handleMandatory = () => {
        const newMandatory = !mandatory; // Toggle mandatory state
        setMandatory(newMandatory); // Update mandatory state
    }

    // Function to handle toggle of categorize state
    const handleCategorize = () => {
        const newcategory = !categorize; // Toggle categorize state
        setcategory(newcategory); // Update categorize state
    }

    // Function to handle change in JSON name
    const handleInputChange = (event) => {
        setJsonName(event.target.value); // Update JSON name state
    }

    // Function to render input fields based on question type
    const renderInputFields = () => {
        switch (que_type) {
            case 'MCQ':
            case 'DROPDOWN':
                return (
                    <div className='renderinputs'>
                        {/* Multiple choice or dropdown question */}
                        <div className='display-mcq-dd'>
                            <div>
                                <input className="input-mcq-dd" style={{ color: "black" }}
                                    placeholder="Enter your question"
                                    value={que}
                                    onChange={handlequeChange}
                                />
                            </div>
                            <div className="options-container">
                                <ul>
                                    {/* Mapping over options */}
                                    {que && options.map((option, index) => {
                                        return(
                                        <li key={index}>
                                            <div className="option-row">
                                                <div className='option_details'>
                                                    <div>
                                                        <input className='option-cont' style={{ color: "black" }}
                                                            type="text"
                                                            placeholder={`Option ${index + 1}`}
                                                            value={option}
                                                            onChange={(e) => handleOptionChange(e, index)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <button onClick={() => removeOption(index)}><i className="fa-solid fa-trash ikl"></i></button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    )})}
                                </ul>
                            </div>
                            <div>{que && <button onClick={() => addOption()}>Add Option</button>}</div>
                            <div className='checkbox-mcq-dd'>
                                {/* Checkboxes for mandatory and categorize */}
                                <label htmlFor="mandatory">mandatory: <input id="mandatory" type='checkbox' onChange={handleMandatory}></input></label>
                                <label htmlFor="categorize" id="jkh">categorize: <input id="categorize" type='checkbox' onChange={handleCategorize} ></input></label>
                                {/* Input field for JSON name */}
                                <label htmlFor='json_name'>JSON name: <input id="json_name" type='text' onChange={handleInputChange} required/></label>
                            </div>
                        </div>
                    </div>
                );
            case 'QA':
                return (
                    <div className='renderinputs'>
                        {/* Question and answer type */}
                        <div className='display-qa'>
                            <div className='input-qa-div'>
                                <input className="input-qa" placeholder="Enter your question" style={{ color: "black" }} value={que} onChange={handlequeChange} />
                            </div>
                            <div className='checkbox-qa'>
                                {/* Checkboxes for mandatory and categorize */}
                                <label htmlFor="mandatory">mandatory: <input id="mandatory" type='checkbox' onChange={() => handleMandatory()} ></input></label>
                                <label htmlFor="categorize" id="jkh">categorize: <input id="categorize" type='checkbox' onChange={() => handleCategorize()} ></input></label>
                                {/* Input field for JSON name */}
                                <label htmlFor='json_name'>JSON name: <input id="json_name" type='text' onChange={handleInputChange} required/></label>
                            </div>
                        </div>
                    </div>);
            default:
                return null;
        }
    };

    // Function to handle submission of question
    const handleSub = async () => {
        try {
            // Send a POST request to server
            const response = await axios.post("/addque", { que_type, que, mandatory, options, categorize, jsonName });
            console.log("post created:", response.data);
        } catch (error) {
            console.error("error creating post:", error);
        }
        // Reset states after submission
        setQueadd(false)
        setque("")
        setMandatory(false)
        setcategory(false)
        setJsonName("");
        const newdisplay = !display
        setdisplay(newdisplay)
        setque_type("")
        setOptions([])
    }

    // Function to handle addition of new question
    const handleQueadd = () => {
        const newqueadd = !queadd // Toggle queadd state
        setQueadd(newqueadd); // Update queadd state
    }

    // Function to render question details section
    const que_details = () => {
        return (
            <div className="que-form">
                {/* Dropdown to select question type */}
                <div>
                    <label>Select que Type:</label>
                    <select style={{ color: "black" }} value={que_type} onChange={handleque_typeChange}>
                        <option style={{ color: "black" }} value="">Select</option>
                        <option style={{ color: "black" }} value="MCQ">Multiple Choice que (MCQ)</option>
                        <option style={{ color: "black" }} value="QA">que & Answer (QA)</option>
                        <option style={{ color: "black" }} value="DROPDOWN">Dropdown</option>
                    </select>
                </div>
                {/* Render input fields based on question type */}
                <div className='render-input'>
                    {que_type && renderInputFields()}
                </div>
                {/* Done button to submit question */}
                {que_type && <button className="done-button" onClick={() => handleSub()}>Done</button>}
            </div>
        )
    }

    // JSX structure for the component
    return (
        <div className='addque_main'>
            <div className="addque">
                {/* Display existing questions */}
                <Displayque display={display} setdisplay={setdisplay} />
                {/* Button to toggle adding new question */}
                <div className="add-que">{!queadd ? <button onClick={handleQueadd}>Add question</button> : que_details()}</div>
            </div>
        </div>
    );
}

export default Addque; // Exporting the Addque component
