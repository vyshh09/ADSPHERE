import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./settings.css";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";

function PasswordComponent({userEmail, userType}){
  //handles the password change
    const currentPasswordRef = useRef();
    const newPasswordRef = useRef();
    const confirmNewPasswordRef = useRef();
    const alert = useAlert();

    const handlePasswordChange = () => {
        // console.log(userEmail)
        let currentPassword = currentPasswordRef.current.value;
        let newPassword = newPasswordRef.current.value;
        let confirmNewPassword = confirmNewPasswordRef.current.value;

        if (newPassword !== confirmNewPassword){
            alert.error("New Passwords don't match")
            return
        }
        // checks if the current password is correct and also whether the two passwords match

        axios.post("/change-password", {email: userEmail, password: currentPassword, type: userType, newPassword})
            .then(res => {
                alert.show(res.data.message);
                if(res.data.status === 1){
                  
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="settings-password-div">
            <table className="settings-attributes">
                <tr>
                    <td>
                        <input
                            ref={currentPasswordRef}
                            type="password"
                            placeholder="Current Password"
                            ></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input
                            ref={newPasswordRef}
                            type="password"
                            placeholder="New Password"
                            ></input>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input
                            ref={confirmNewPasswordRef}
                            type="password"
                            placeholder="Confirm New Password"
                        ></input>
                    </td>
                </tr>
            </table>            
            <button
                onClick={() => handlePasswordChange()}
                className="save-btn nav-button"
            >
                <i className="fa-solid fa-key button-icon"></i>
                <span className="button-text">Change password</span>
            </button>
        </div>
    )
}

const Settings = () => {
  // set new passowrd
  // profile(all login details with update option(not email))
  const updaterefs = useRef({});
  const edit_options = useState([true, true, true, true]);
  
  // 0 - initial (unopened), 1 - user-profile, 2 - passwords
  const [tabState, setTabState] = useState(0);

  // const [email, setemail] = useState([])
  const [user_data, setUserdata] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    //handles the my account page
    axios
        .get("/get-user-details")  //gets the user details from the database, based on the user logged in
        .then((result) => {
            if (!result.data.status){
              navigate("/login", {replace:true})
              return
            }
            const new_user_data = [];
            new_user_data.email = result.data.info.email;
            new_user_data.repName = result.data.info.repName;
            new_user_data.web = result.data.info.web;
            new_user_data.orgName = result.data.info.orgName;
            new_user_data.type = result.data.info.type;
            // console.log(new_user_data)

            setUserdata(new_user_data);
        })
        .catch((err) => console.log(err));
    }, [])

    const handleUserprofile = () => {
        // console.log(user_data)
        setTabState(1);
    };
  const handleEdit = (val) => { // handles the edits
    // console.log(val)
    // console.log(updaterefs)
    // console.log(updaterefs.current)
    if (updaterefs.current && updaterefs.current[val]) {
      updaterefs.current[val].disabled = false;
    } 
    // else {
    //   console.log("hi sudhan");
    // }
    // console.log(val)
  };
  const handleinputchange = (e, val) => { // handles the input changes in the edit form
    const new_val = e.target.value;
    const new_data = { ...user_data };
    new_data[val] = new_val;
    setUserdata(new_data);
  };
  const handleSavechanges = () => { // handles if the user clicks on save changes
    axios
      .post("/update-info", { user_data })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const user_details = () => {  
    return (
      <div>
        {() => { // form for the editing profile of the user
          if (!updaterefs.current) {
            updaterefs.current = {
              repName: null,
              web: null,
              orgName: null,
              type: null,
            };
            // console.log("hi");
          }
        }}
        {/* {console.log(edit_options)} */}
        <table className="settings-attributes">
          <tr>
            <td className="label-settings">Email:</td>
            <td>
              <input disabled={true} value={user_data.email} />
            </td>
          </tr>
          <tr>
            <td className="label-settings">Representative Name: </td>
            <td>
              <input
                ref={(element) => (updaterefs.current.repName = element)}
                disabled={edit_options[0][0]}
                onChange={(e) => handleinputchange(e, "repName")}
                value={user_data.repName}
              />
              <button
                onClick={() => handleEdit("repName")}
                className="edit-btn"
              >
                <i className="fas fa-pen-to-square"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td className="label-settings">Website URL: </td>
            <td>
              <input
                ref={(element) => (updaterefs.current.web = element)}
                disabled={edit_options[0][1]}
                onChange={(e) => handleinputchange(e, "web")}
                value={user_data.web}
              ></input>
              <button onClick={() => handleEdit("web")} className="edit-btn">
                <i className="fas fa-pen-to-square"></i>
              </button>
            </td>
          </tr>
          <tr>
            <td className="label-settings">Organisation Name: </td>
            <td>
              <input
                ref={(element) => (updaterefs.current.orgName = element)}
                disabled={edit_options[0][2]}
                onChange={(e) => handleinputchange(e, "orgName")}
                value={user_data.orgName}
              ></input>
              <button
                onClick={() => handleEdit("orgName")}
                className="edit-btn"
              >
                <i className="fas fa-pen-to-square"></i>
              </button>
            </td>
          </tr>
        </table>
        <button
          onClick={() => handleSavechanges()}
          className="save-btn nav-button"
        >
          <i className="fa-solid fa-floppy-disk button-icon"></i>
          <span className="button-text">Save Changes</span>
        </button>
      </div>
    );
  };
  
  const handlePassword = () => {
    setTabState(2);
    // return(
    // )
  };
  return (
    <div className="App">
      <Header />
      <div className="settings-main-div">
        <div className="settings-header-div">Settings</div>
        <div className="settings">
          <div
            onClick={() => handleUserprofile()} // this function displayes the user options to navigate to user profile page or forgot password page
            className="profile-settings settings-option"
          >
            <i className="fa-solid fa-user option-icon"></i>
            <span>User profile settings</span>
          </div>
          <div
            onClick={() => handlePassword()}
            className="password-settings settings-option password-option"
          >
            <i className="fa-solid fa-key option-icon"></i>
            <span>Reset password</span>
          </div>
          {tabState == 1 ? 
            user_details()
          : tabState == 2 ? 
            <PasswordComponent userEmail={user_data.email} userType={user_data.type} /> : <></>
            }
        </div>
      </div>
    </div>
  );
};

export default Settings;
