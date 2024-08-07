import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "./Components/Header";
import { useNavigate } from "react-router-dom";
import { useAlert } from "react-alert";
import Fuse from "fuse.js";

const AdForm = () => {
  
  // State variables for form data
  const [userEmail, setUserEmail] = useState("");
  const [Link, setLink] = useState("");
  const navigate = useNavigate();
  const [cities, setCities] = useState([
      // List of cities
    "Agra", "Ahmedabad", "Allahabad", "Amritsar", "Aurangabad",
    "Bangalore", "Bhopal", "Chandigarh", "Chennai", "Coimbatore",
    "Delhi", "Faridabad", "Ghaziabad", "Goa", "Gurgaon", "Guwahati",
    "Hyderabad", "Indore", "Jaipur", "Jodhpur", "Kanpur", "Kochi",
    "Kolkata", "Lucknow", "Ludhiana", "Madurai", "Mumbai", "Nagpur",
    "Nashik", "Navi Mumbai", "Noida", "Patna", "Pune", "Rajkot",
    "Surat", "Thane", "Vadodara", "Varanasi", "Visakhapatnam"
  ]);
  const [tempCities, setTempCities] = useState([]); // Temporary cities array for filtering
  
  const [categories, setCategories] = useState([
    // List of categories
    "Arts & Crafts",
    "Automotive Accessories",
    "Automotive Repair & Maintenance",
    "Baby & Maternity",
    "Beauty & Personal Care",
    "Books & Literature",
    "Catering & Food Services",
    "Cleaning & Janitorial Services",
    "Clothing & Apparel",
    "Construction & Building Materials",
    "Construction & Contracting Services",
    "Consulting & Business Services",
    "Education & Learning",
    "Education & Tutoring Services",
    "Electrical & Lighting",
    "Electronic Gadgets",
    "Event Planning & Management",
    "Event Planning & Services",
    "Fashion Design & Styling",
    "Financial Planning & Advisory",
    "Financial Services",
    "Food & Beverages",
    "Furniture & Furnishings",
    "Gardening & Outdoor Living",
    "Health & Wellness Products",
    "Healthcare & Medical Services",
    "Home Decor",
    "Home Renovation & Remodeling",
    "Home Services",
    "Industrial Supplies",
    "IT & Computer Services",
    "Jewelry & Accessories",
    "Kitchen Appliances",
    "Legal Services & Consulting",
    "Legal & Law Services",
    "Marketing & Advertising",
    "Music & Entertainment",
    "Music & Entertainment Services",
    "Office Supplies",
    "Pet Care & Grooming Services",
    "Pet Supplies",
    "Photography & Videography",
    "Real Estate & Property",
    "Sports & Outdoors",
    "Technology & Software",
    "Toys & Games",
    "Travel & Luggage",
    "Travel & Tourism Services",
    "Weddings & Bridal",
  ]);
  const [tempCategories, setTempCategories] = useState([]); // Temporary categories array for filtering
  const alert = useAlert();

  useEffect(() => {
    // Fetch user data on component mount
    setTempCategories(categories);
    setTempCities(cities);

    // Verify user login
    axios.get("/verify-login").then((res) => {
      if (!res.data.valid || res.data.type !== "advertiser") {
        // Redirect unauthorized users to login page
        // navigate to some invalid page
        alert.error("Unauthorized User!");
        console.error("Unauthorized User!");
        navigate("/login", { replace: true })
        // return
      }
      setUserEmail(res.data.email);
    });
  }, []);

  const [adData, setAdData] = useState({
    // Initial state for ad data
    ad_type: "",
    ad_category: "",
    ad_description: "",
    ad_region: "",
    ad_target_age: [],
    target_prints: "",
    qr_link_id: "",
    websiteUrl: "",
  });

  const handleInputChange = (e) => {
    // Handle input change for form fields
    const { name, value } = e.target;
    setAdData({ ...adData, [name]: value });
  };

  function makelink(length) {
    // Function to generate random link
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }


  const handleFileChange = (e) => {
    // Handle file change for ad design
    const file = e.target.files[0];
    setAdData((prevData) => ({ ...prevData, ad_design: file }));
  };

  const [ageGroups, setAgeGroups] = useState({
    // State for age group checkboxes
    0: false,
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  });

  // Function to handle checkbox change
  const handleCheckboxChange = (value) => {
    setAgeGroups(prevState => ({
      ...prevState,
      [value]: !prevState[value]
    }));
  };

  function getIndicesWithTrue(obj) {
    return Object.entries(obj)
      .filter(([index, value]) => value === true)
      .map(([index]) => parseInt(index));
  }

  const handleSubmit = async (e) => {
    // Handle form submission
    e.preventDefault();

    // have to shift the logic to backend, change the logic to randomized, or better incrementing procedure
    // shifted

    // setAdData((prevData) => {
    //   const updatedData = { ...prevData, ad_id: adId };
    //   console.log(updatedData);
    //   return updatedData;
    // });
    // console.log("This --> ", adData)

    // Prepare ad data
    const newAdData = {
      // New ad data state
      ad_type: "",
      ad_category: "",
      ad_description: "",
      ad_region: "",
      ad_target_age: ageGroups,
      target_prints: "",
      qr_link_id: "",
      websiteUrl: "",
    };

    const formData = new FormData();

    adData.ad_target_age = getIndicesWithTrue(ageGroups);
    Object.entries(adData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    console.log(formData)
    console.log(ageGroups)

    // Send ad data to backend
    axios
      .post("/ad-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        if (res.data.success) {
          alert.success("Ad Uploaded!");
          // console.log('Ad data uploaded successfully');
          setAdData(newAdData); // Reset form data
          setLink("");  // Reset link
          document.getElementById("ad-design-input").value = "";  // Reset file input
        }
        else {
          alert.error("Unauthorized request!");
          console.error("Unauthorized request!");
        }
      })
      .catch((err) => console.log("Error uploading ad data: ", err));
  };

  const handleCategorySearch = (array, setFunction, event) => {
    // Function to perform fuzzy search on categories
    const options = {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: ["value"],
    };

    const fuse = new Fuse(array, options);

    // Perform the search
    const query = event.target.value;
    setAdData({ ...adData, [event.target.name]: event.target.value });
    const result = fuse.search(query);

    if (query == "") setFunction(array);
    else setFunction(result.map((entry) => entry.item));
  };

  const [dropdownState, setDropdownState] = useState({
    ad_category: false,
    ad_region: false,
  });
  const dropdownRef = { ad_category: useRef(), ad_region: useRef() };
  const handleDropdown = (id, close) => {
    // Handle dropdown menu visibility
    if (!close) {
      setDropdownState((prevState) => ({ ...prevState, [id]: true }));
      dropdownRef[id].current.style.height = "30vh";
      dropdownRef[id].current.style.padding = "5px";
    } else {
      setDropdownState((prevState) => ({ ...prevState, [id]: false }));
      dropdownRef[id].current.style.height = "0vh";
      dropdownRef[id].current.style.padding = "0px";
    }
  };

  const updateOption = (option, event) => {
    // Update selected option
    setAdData({ ...adData, [option]: event.target.innerText });
    handleDropdown(option, true);
  };

  function handleLink(event) {
    // Handle link generation
    event.preventDefault();

    let link = "/dummy?qr_link_id="
    let linkid = makelink(15)
    linkid = linkid.concat(Math.floor(Date.now() / 10))
    console.log(linkid)
    setAdData({ ...adData, ["qr_link_id"]: linkid })
    link = link.concat(linkid)

    // for checking
    // Send dummy request for checking
    axios.post("/dummy?qr_link_id=mUnQR6uSHfD1etJ")
      .then(data => console.log(data))
      .catch(err => console.log(err))

    console.log(link)
    setLink(link)
  }

  return (
    <>
      <Header type="6" />
      <div className="top-div">
        <div className="ad-inputs">
          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="adupload-form"
          >
            <div className="hdg-div">
              <h2>Ad Form</h2>
            </div>
            <br />
            <label className="adupload-label">
              <strong>Product / Service Type: </strong>
              <input
                className="adupload-input"
                type="text"
                name="ad_type"
                value={adData.ad_type}
                placeholder="Product / Ad Type"
                style={{ color: "black" }}
                onChange={handleInputChange}
              />
            </label>
            <div
              className="adupload-label"
              onFocus={() => handleDropdown("ad_category", false)}
              onBlur={() => handleDropdown("ad_category", true)}
              tabindex="0"
            >
              <strong>Major Category:</strong>
              <input
                className="adupload-input"
                type="text"
                name="ad_category"
                value={adData.ad_category}
                placeholder="Enter the category of your Ad"
                style={{ color: "black" }}
                autoComplete="off"
                onChange={(event) =>
                  handleCategorySearch(categories, setTempCategories, event)
                }
              />
              <div
                ref={dropdownRef["ad_category"]}
                className="dropdown-container"
              >
                {tempCategories.map((category) => (
                  <div
                    className="dropdown-item"
                    onClick={(event) => updateOption("ad_category", event)}
                  >
                    {category}
                  </div>
                ))}
              </div>
            </div>

            <label className="adupload-label">
              <strong>Ad Description:</strong>
              <textarea
                className="adupload-input"
                type="textarea"
                name="ad_description"
                value={adData.ad_description}
                placeholder="Describe your Ad here"
                style={{ color: "black" }}
                onChange={handleInputChange}
              />
            </label>

            {/* make this dropdown */}
            <div className="adupload-label">
              <div>
                <strong>Target Age-group:</strong>
              </div>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={0} onChange={() => handleCheckboxChange(0)} /> &lt; 18
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={1} onChange={() => handleCheckboxChange(1)} /> 18 - 24
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={2} onChange={() => handleCheckboxChange(2)} /> 24 - 30
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={3} onChange={() => handleCheckboxChange(3)} /> 30 - 40
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={4} onChange={() => handleCheckboxChange(4)} /> 40 - 50
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={5} onChange={() => handleCheckboxChange(5)} /> 50 - 65
              </label>
              <label className="age-group-label">
                <input type="checkbox" name="input-age-group" value={6} onChange={() => handleCheckboxChange(6)} /> 65 +
              </label>
            </div>

            {/* make this dropdown */}
            <div
              className="adupload-label"
              onFocus={() => handleDropdown("ad_region", false)}
              onBlur={() => handleDropdown("ad_region", true)}
              tabindex="0"
            >
              <strong>Region: </strong>
              <input
                className="adupload-input"
                type="text"
                name="ad_region"
                value={adData.ad_region}
                placeholder="Region"
                style={{ color: "black" }}
                onChange={(event) =>
                  handleCategorySearch(cities, setTempCities, event)
                }
              />
              <div
                ref={dropdownRef["ad_region"]}
                className="dropdown-container"
              >
                {tempCities.map((city) => (
                  <div
                    className="dropdown-item"
                    onClick={(event) => updateOption("ad_region", event)}
                  >
                    {city}
                  </div>
                ))}
              </div>
            </div>

            <label className="adupload-label">
              <strong>Target prints:</strong>
              <input
                className="adupload-input"
                type="text"
                name="target_prints"
                value={adData.target_prints}
                placeholder="Enter your target prints"
                style={{ color: "black" }}
                onChange={handleInputChange}
              />
            </label>

            <label className="adupload-label">
              <strong>website url:</strong>
              <input
                className="adupload-input"
                type="text"
                name="websiteUrl"
                value={adData.websiteUrl}
                placeholder="Enter your website url"
                style={{ color: "black" }}
                onChange={handleInputChange}
              />
            </label>
            {/* <label className="adupload-label">
              <strong>Ad Design: </strong>
              <br />
              <input
                className="adupload-input-img"
                accept="image/*"
                type="file"
                name="ad_design"
                id="ad-design-input"
                style={{ color: "black" }}
                onChange={handleFileChange}
              />
            </label> */}
            <label>
              <input value={Link}></input>
              <button onClick={(event) => handleLink(event)}>Generate Link</button>
            </label>

            <label htmlFor="picture" className="input-post-image">
              <i className="fa-solid fa-cloud"></i>Upload Design
            </label>
            <input
              type="file"
              id="picture"
              accept="image/*"
              name="ad_design"
              onChange={handleFileChange}
              hidden
            />

            <div className="submit-div">
              <button
                className="submit-btn"
                type="submit"
                style={{ color: "white" }}
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AdForm;
