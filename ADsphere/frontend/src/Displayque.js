import React,{useState,useEffect,useRef} from "react";
import axios from "axios";

const Displayque = ({ display, setdisplay }) => {
    const queRefs = useRef([{ "que": null, "options": [] }])    // useRef for storing references to input elements
    const [data, setdata] = useState([]);   // State variable to store data

    // Fetch question data from the backend on component mount or when display state changes
    useEffect(() => {
        axios.get("/displayque")    // Fetch question data from backend
            .then(res => {
                res.data.forEach(element => {
                    element.edit = true;    // Add 'edit' property to each question object
                });
                setdata(res.data)   // Set the fetched data to the state
            })
            .catch(err => console.log(err));
    }, [display]);  // Log error if fetching data fails

    // Handle editing of a question 
    const handleEdit = (index) => {
        const newdata = [...data]
        newdata[index].edit = false // Set 'edit' property of the selected question to false
        setdata(newdata)    // Update state with the modified data
    }

    // Handle saving changes to a question
    const handleSavechanges = (index) => {
        let newdata = data[index]

        // Update question and options based on user input
        newdata["que"] = queRefs.current[index]?.que?.value
        newdata["mandatory"] = queRefs.current[index].mandatory.checked;
        newdata["categorize"] = queRefs.current[index].categorize.checked;
        let options = []
        let i = 0
        while (queRefs.current[index]?.options[i]) {
            options[i] = queRefs.current[index]?.options[i].value
            i++
        }
        newdata["options"] = options

        // Send updated question data to the backend for saving
        axios.post("/que-save", { "que": newdata })
            .then(res => {
                const newdisplay = !display
                setdisplay(newdisplay)  // Toggle the display state to trigger re-render
            })
            .catch(err => console.log(err)) // Log error if saving data fails
    }

    // Handle change in mandatory checkbox
    const handleMandatorychange = (e, index) => {
        if (data[index].edit === false) {
            const newdata = [...data]
            newdata[index].mandatory = !data[index].mandatory   // Toggle the 'mandatory' property
            setdata(newdata)    // Update state with modified data
        }
    }

    // Handle change in categorize checkbox
    const handleCategorizechange = (e, index) => {
        if (data[index].edit === false) {
            const newdata = [...data]
            newdata[index].categorize = !data[index].categorize     // Toggle the 'categorize' property
            setdata(newdata)    // Update state with modified data
        }
    }

    // Handle changes in question or option inputs
    const handleEditchanges = (e,index,indx) => {
        if(indx === -1)
        {
            const new_val = e.target.value
            const new_data = [...data]
            new_data[index].que = new_val   // Update question
            setdata(new_data)   // Update state with modified data
        }
        else
        {
            const new_val = e.target.value
            const new_data = [...data]
            new_data[index].options[indx] = new_val   // Update option
            setdata(new_data)   // Update state with modified data
        }
    }

    return (
        <div>
            {
                data.map((points, index) => {
                    if (!queRefs.current[index]) {
                        queRefs.current[index] = { que: null, options: [], mandatory: null, categorize: null };
                    }
                    return (
                        <div key={index} className='container-0'>
                            <div className='container-1'>
                                <input className="container-1-que" onChange={(e) => handleEditchanges(e,index, -1)} ref={Element => queRefs.current[index].que = Element} value={points["que"]} disabled={points["edit"]} />
                                <div className='container-2'>
                                    {points["options"].map((option, indx) => {
                                        return (
                                            <input onChange={(e) => handleEditchanges(e,index, indx)}
                                                className="cont-2_options"
                                                ref={Element => (queRefs.current[index].options)[indx] = Element}
                                                disabled={points["edit"]}
                                                key={indx}
                                                value={option}
                                            />
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='container-2_1'>
                                <label htmlFor="mandatory" id="jkh">mandatory: <input ref={Element => queRefs.current[index].mandatory = Element} id="mandatory" type='checkbox' checked={points["mandatory"]} disabled={points.edit} onClick={(e) => handleMandatorychange(e, index)}></input></label>
                                <label htmlFor="categorize" id="jkh">categorize: <input ref={Element => queRefs.current[index].categorize = Element} id="categorize" type='checkbox' checked={points["categorize"]} disabled={points.edit} onClick={(e) => handleCategorizechange(e, index)}></input></label>
                            </div>
                            {console.log(queRefs.current[index].que?.innerText)}
                            <div className='container-3'>
                                <div className="bt1"><button onClick={() => {
                                    axios.post("/remove-entry", { id: points._id })     // Send request to remove question entry
                                        .then(res => {
                                            console.log(res.data)
                                        })
                                        .catch(err => console.log(err))
                                    const newdisplay = !display
                                    setdisplay(newdisplay)  // Toggle display state to trigger re-render
                                }}><i className="fa-solid fa-trash ikl"></i></button></div>
                                <div className='bt2'>{!points.edit ? <button onClick={() => handleSavechanges(index)}><i className="fas fa-save svl"></i></button> : <button onClick={() => handleEdit(index)}><i className='fas fa-pen kml'></i></button>}</div>
                            </div>
                        </div>)
                })
            }
        </div>
    )
}

export default Displayque;