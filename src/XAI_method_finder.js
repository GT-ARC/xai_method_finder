import React, { useState, useEffect } from "react";
import ModelData from "./methods.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// icons of buttons
// (roles, goals, data types, problem types, model types)
import { faSquareMinus as unknown,
         faPeopleGroup as stakeholder, faCircleUser as user, faCode as developer, faCrown as owner, faCircleCheck as validator,
         faPeopleRoof as trust, faGavel as legitimate, faClipboardList as evaluate, faArrowTrendUp as improve, faSchool as learn,
         faImage as images, faFileLines as text, faTableList as tabular,
         faChartLine as regression, faTag as classification, faBrain as generative,
         faClone as cnn, faLayerGroup as mlp
         } from '@fortawesome/free-solid-svg-icons'

const MethodFinder = (props) => {

  const iconMappings = {
    unknown,
    stakeholder,
    user,
    developer,
    owner,
    validator,
    trust,
    legitimate,
    evaluate,
    improve,
    learn,
    images,
    text,
    tabular,
    regression,
    classification,
    generative,
    cnn,
    mlp
  };

  function getButtonIcon(buttonTag) {
    return iconMappings[buttonTag] || null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextButton = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handleBackButton = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const { title, description, elements } = props.data[currentIndex];

  const [imageExists, setImageExists] = useState(false);
  const [chociesExists, setChociesExists] = useState(false);
  const [sliderExists, setSliderExists] = useState(false);
  const [questionTableExists, setQuestionTableExists] = useState(false);

  const [selectedQuestions, setSelectedQuestions] = useState({
    global: false,
    local: false,
    counterfactual: false,
  });

  const [targetGroup, setTargetGroup] = useState([]);
  const [levelOfExpertise, setLevelOfExpertise] = useState(1);
  const [explanatoryGoals, setExplanatoryGoals] = useState([]);
  const [dataType, setDataType] = useState([]);
  const [problemType, setProblemType] = useState([]);
  const [modelType, setModelType] = useState([]);

  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [currentTooltip, setCurrentTooltip] = useState(0);
  const [isTextboxVisible, setIsTextboxVisible] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);

  // for step 3, target group - role
  // for step 5, target group - explanatory goal
  // for step 6, data type
  // for step 7, problem type
  // for step 8, model type
  const handleButtonChange = (id, buttonIndex) => {
    // nullTagIndex refers to index of the "unknown" button index.

    if (selectedButtons.includes("" + buttonIndex + " " + currentIndex)) {

      setSelectedButtons(selectedButtons.filter((index) => index !== "" + buttonIndex + " " + currentIndex));
    } else {
      if (id === "unknown") {
        if (!isAnyButtonSelected)
          setSelectedButtons([...selectedButtons, "" + buttonIndex + " " + currentIndex]);
      }
      else {
        if (!isUnknownOptionSelected) {  // "unknown" is not selected

          if (currentIndex === 2) { // target group
            if (id !== "developer" && !targetGroup.includes("developer")) { // if id is different from "developer" and target group does not include "developer"
              setSelectedButtons([...selectedButtons, "" + buttonIndex + " " + currentIndex]);
            }
            else if (id === "developer" && targetGroup.length === 0) { // if id is "developer" and target group is empty
              setSelectedButtons([...selectedButtons, "" + buttonIndex + " " + currentIndex]);
            }
          }
          else {
            setSelectedButtons([...selectedButtons, "" + buttonIndex + " " + currentIndex]);
          }
        }

      }
    }


    if (currentIndex === 2) {
      if (targetGroup.includes(id)) {   // remove previous selection
        setTargetGroup(targetGroup.filter(item => item !== id));
      } else {                          // add new selection
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setTargetGroup([...targetGroup, id]);
          }
        }
        else {
          if (!targetGroup.includes("unknown")) {
            if (id !== "developer" && !targetGroup.includes("developer")) { // if id is different from "developer" and target group does not include "developer"
              setTargetGroup([...targetGroup, id]);
            }
            else if (id === "developer" && targetGroup.length === 0) {  // if id is "developer" and target group is empty
              setTargetGroup([...targetGroup, id]);
            }
          }
        }
      }
    }
    if (currentIndex === 4) {
      if (explanatoryGoals.includes(id)) {
        setExplanatoryGoals(explanatoryGoals.filter(item => item !== id));
      } else {
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setExplanatoryGoals([...explanatoryGoals, id]);
          }
        }
        else {
          if (!explanatoryGoals.includes("unknown"))
            setExplanatoryGoals([...explanatoryGoals, id]);
        }
      }
    }
    if (currentIndex === 5) {
      if (dataType.includes(id)) {
        setDataType(dataType.filter(item => item !== id));
      } else {
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setDataType([...dataType, id]);
          }
        }
        else {
          if (!dataType.includes("unknown"))
            setDataType([...dataType, id]);
        }
      }
    }
    if (currentIndex === 6) {
      if (problemType.includes(id)) {
        setProblemType(problemType.filter(item => item !== id));
      } else {
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setProblemType([...problemType, id]);
          }
        }
        else {
          if (!problemType.includes("unknown"))
            setProblemType([...problemType, id]);
        }
      }
    }
    if (currentIndex === 7) {
      if (modelType.includes(id)) {
        setModelType(modelType.filter(item => item !== id));
      } else {
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setModelType([...modelType, id]);
          }
        }
        else {
          if (!modelType.includes("unknown"))
            setModelType([...modelType, id]);
        }
      }
    }

  };

  // for step 4, target group - specialist knowledge
  const handleSliderChange = (event) => {
    setLevelOfExpertise(parseInt(event.target.value, 10));
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
    setSelectedQuestions({
      ...selectedQuestions,
      [id]: checked,
    });
  };

  useEffect(() => {
    const hasImage = elements.some((item) => item.type === "image");
    setImageExists(hasImage);
  }, [elements]);

  useEffect(() => {
    const hasChoice = elements.some((item) => item.type === "select");
    setChociesExists(hasChoice);
  }, [elements]);

  useEffect(() => {
    const hasSlider = elements.some((item) => item.type === "slider");
    setSliderExists(hasSlider);
  }, [elements]);

  useEffect(() => {
    const hasQuestionTable = elements.some((item) => item.type === "question");
    setQuestionTableExists(hasQuestionTable);
  }, [elements]);

  const handleMouseEnter = (event, currentIndex) => {
    setCurrentTooltip(currentIndex);
    if (!isTextboxVisible)
      setIsTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const [validMethods, setValidMethods] = useState(ModelData.map(method => method));

  useEffect(() => {
    const determineMethod = () => {
      const newValidMethods = ModelData.filter(method => checkMethod(method)).map(method => method);
      setValidMethods(newValidMethods);
    };

    const checkMethod = (method) => {
      let isGoalsValid = true;
      let isTasksValid = true;
      let isModelsValid = true;
      let isDataValid = true;

      // goals
      if (!explanatoryGoals.includes("unknown")) {
        for (let i = 0; i < explanatoryGoals.length; i++) {
          isGoalsValid = method.features.some(goal => goal.type === "goal" && goal.tag === explanatoryGoals[i]);
          if (!isGoalsValid) break;
        }
      }
      
      // problems - tasks
      for (let i = 0; i < problemType.length; i++) {
        isTasksValid = method.features.some(task => task.type === "task" && task.tag === problemType[i]);
        if (!isTasksValid) break;
      }

      // data 
      for (let i = 0; i < dataType.length; i++) {
        if (method.features.some(data_type => data_type.type === "data_type" && data_type.tag === "any") &&
            dataType.some(tag => tag !== "unknown")) 
        { isDataValid = true; }
        else {  
          isDataValid = method.features.some(data_type => data_type.type === "data_type" && data_type.tag === dataType[i]);
          if (!isDataValid) break;
        }
      }

      // model 
      // Agnostic was assumed to include also CNN and MLP.
      for (let i = 0; i < modelType.length; i++) {
        isModelsValid = method.features.some(model_type => model_type.type === "model_type" && 
                                            (modelType[i] !== "unknown" && (model_type.tag === modelType[i] || model_type.tag === "agnostic")));
        if (!isModelsValid) break;
      }

      let isGlobal = true, isLocal = true, isCounterfactual = true;

      // explanation scope
      if (selectedQuestions['global']) {
        isGlobal = method.features.some(explanation_scope => explanation_scope.type === "explanation_scope" && explanation_scope.tag === "global");
      }
      if (selectedQuestions['local']) {
        isLocal = method.features.some(explanation_scope => explanation_scope.type === "explanation_scope" && explanation_scope.tag === "local");
      }
      if (selectedQuestions['counterfactual']) {
        isCounterfactual = method.features.some(explanation_scope => explanation_scope.type === "explanation_scope" && explanation_scope.tag === "counterfactual");
      }

        return isGoalsValid && isTasksValid && isModelsValid && isDataValid && (isGlobal && isLocal && isCounterfactual);
    };

    determineMethod();

  }, [dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions]);

  const [isUnknownOptionSelected, setIsUnknownOptionSelected] = useState(false);
  const [isAnyButtonSelected, setIsAnyButtonSelected] = useState(false);  // except "unknown"

  useEffect(() => {

    if ((currentIndex === 2 && targetGroup.includes("unknown")) || (currentIndex === 4 && explanatoryGoals.includes("unknown")) ||
        (currentIndex === 5 && dataType.includes("unknown")) || (currentIndex === 6 && problemType.includes("unknown")) || (currentIndex === 7 && modelType.includes("unknown")))
    {
      setIsUnknownOptionSelected(true);
      setIsTextboxVisible(true);
      setIsTooltipVisible(false);
    }
    else {
      setIsUnknownOptionSelected(false);
      setIsTextboxVisible(false);
      setInput('');
    }

  }, [currentIndex, dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions, targetGroup]);

  useEffect(() => {

      if ((currentIndex === 2 && !targetGroup.includes("unknown") && targetGroup.length > 0) || (currentIndex === 4 && !explanatoryGoals.includes("unknown") && explanatoryGoals.length > 0) ||
          (currentIndex === 5 && !dataType.includes("unknown") && dataType.length > 0) || (currentIndex === 6 && !problemType.includes("unknown") && problemType.length > 0) ||
          (currentIndex === 7 && !modelType.includes("unknown") && modelType.length > 0))
      {
        setIsAnyButtonSelected(true);
      }
      else {
        setIsAnyButtonSelected(false);
      }

  }, [currentIndex, dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions, targetGroup]);

  const [textInput, setTextInput] = useState('');
  const [dataTypeInput, setDataTypeInput] = useState('');
  const [problemTypeInput, setProblemTypeInput] = useState('');
  const [modelTypeInput, setModelTypeInput] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = () => {
    if (textInput.trim() !== '')  setInput();
    setTextInput('');
  };

  const setInput = () => {
    if (currentIndex === 5) setDataTypeInput(textInput.trim());
    if (currentIndex === 6) setProblemTypeInput(textInput.trim());
    if (currentIndex === 7) setModelTypeInput(textInput.trim());
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter')  handleSubmit();
  };

  const getRecommendations = () => {

    let expertiseLevel = levelOfExpertise < 3 ? 0 : 1;

    const filteredElements = elements.filter((element) => element.target_group.some((item) => targetGroup.includes(item.tag)));
    const selectedElement = filteredElements.find((element) => element.definition.some((definition) => definition.expertise === expertiseLevel));

    return selectedElement && selectedElement.definition.find((definition) => definition.expertise === expertiseLevel);

  }

  return (
    <div>
      <h1 className="page_title">{title}</h1>

      <div className={(currentIndex === 12 || currentIndex === 13 )? 'output_container' : 'general_container'}>
        <div className={(chociesExists || sliderExists )? 'description_with_buttons' : 'title_and_description'}>
          <p dangerouslySetInnerHTML={{ __html: description }} class="description"/>
          {questionTableExists && elements.map(
          (item, index) =>
            item.type === "image" && (
              <img
                id={item.id}
                src={process.env.PUBLIC_URL + item.target}
                style={imageExists ? { display: "block" } : { display: "none" }}
              />
            )
          )}
        </div>

      <div class="container">

        {!questionTableExists && elements.map(
          (item, index) =>
            item.type === "image" && (
              <img
                id={item.id}
                src={process.env.PUBLIC_URL + item.target}
                style={imageExists ? { display: "block" } : { display: "none" }}
              />
            )
        )}

        <div style={chociesExists ? { display: "block" } : { display: "none" }} class="buttons_method_finder">
          {elements.map(
            (item1, index) =>
            item1.type === "select" && (
                <>
                  <p class="text">
                    <b>{item1.choice_question}</b>
                  </p>
                  <div className="icons">
                    {item1.options.map((item2) => (
                        <button
                          className={selectedButtons.includes("" + item2.index + " " + currentIndex) ? 'selected' : 'button'}
                          onClick={() => handleButtonChange(item2.tag, item2.index)}
                          onMouseEnter={(e) => handleMouseEnter(e, item2.index)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <div className="button_content" onMouseEnter={(e) => handleMouseEnter(e, item2.index)} onMouseLeave={handleMouseLeave}>
                            <FontAwesomeIcon className="icon_container" icon={getButtonIcon(item2.tag)} style={{color: "#E58253"}}/>
                            <div className="button_title">{item2.title}</div>
                          </div>
                        </button>
                    ))}
                  </div>
                  {isTooltipVisible && (currentTooltip >= 0 && currentTooltip <= item1.options.length-1) && (
                    <p className="text" dangerouslySetInnerHTML={{ __html: item1.options[currentTooltip].description }} />
                  )}
                  {isTextboxVisible && (currentIndex === 5 || currentIndex === 6 || currentIndex === 7) && (
                    <div className="textbox_unknown"
                         style={isTooltipVisible && currentTooltip !== item1.options.length-1 ? { display: "none" } : { display: "block" }}>
                      <p className="text" 
                         dangerouslySetInnerHTML={{ __html: item1.options[item1.options.length-1].description }}/>
                      <input type="text" value={textInput} placeholder=" Text eingeben..." onChange={handleInputChange} onKeyPress={handleKeyPress}/>
                      <button onClick={handleSubmit}>Einreichen</button>
                    </div>
                  )}

                </>
              )
          )}
        </div>

        <div style={sliderExists ? { display: "block" } : { display: "none" }} className="slider_method_finder">
          {elements.map(
            (item, index) =>
              item.type === "slider" && (
                <>
                  <p className="text">
                    <b>{item.choice_question}</b>
                  </p>
                  <div className="slider_container">
                    <input
                      type="range"
                      className="slider"
                      min="1"
                      max="5"
                      value={levelOfExpertise}
                      onChange={handleSliderChange}
                    />
                  </div>
                  <p className="text">
                    <b>{levelOfExpertise}</b>
                  </p>
                  <div className="slider_labels">
                    <br></br>1 - KEIN FACHWISSEN<br></br>5 - EXPERTE
                  </div>
                </>
              )
          )}
        </div>
        
        <div className="question-table" style={questionTableExists ? { display: "block" } : { display: "none" }}>
          <div className="question_table">
          {elements.map(
            (item, index) =>
              item.type === "question" && 
              (<>
                <div class="table-header col col-1">
                  Sind Sie an dieser Frage interessiert?
                </div>
                <li class="table-row">
                    <div class="checkbox-wrapper">
                      <div class="block">
                        <input
                          id={item.explanation_scope}
                          type="checkbox"
                          checked={selectedQuestions[item.explanation_scope]}
                          onChange={handleCheckboxChange}
                        />
                        <label for={item.explanation_scope}></label>
                      </div>
                    </div>
                </li>
              </>)
          )}
          </div>
        </div>

            {currentIndex === 12 && validMethods.length > 0 && !validMethods.includes("unknown") && (
            <div className="method_slider_container">
              <div className="method_container">
                {validMethods.map((method) => (
                  <div key={method} className="method_object">
                    <h3 className="method_title">{method.title}</h3>
                      <div className="method_info">
                        <div>
                          <p>Weitere Info:</p>
                          <img className="qr_image" src={process.env.PUBLIC_URL + method.qr_code} alt="qrCode"/>
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
            )}

            {currentIndex === 13 && targetGroup.length > 0 && !targetGroup.includes("unknown") && (
              <>                     
              <div className="recommendation_container"> 
                {getRecommendations().explanations.map((item) => (
                  <div className="recommendation_object">
                    <h3 class="method_title"><u>{item.title}</u></h3>
                    <p>{item.text}</p>
                  </div>
                ))}
              </div>
              </>
            )}
      </div>

      </div>

      <div
        class="next_button"
        onClick={handleNextButton}
        style={currentIndex === props.data.length-1 ? { display: "none" } : { display: "block" }}
      >
        <button class="page_switch_button next_page_button">
          <span>Weiter</span>
        </button>
      </div>
      <div
        class="back_button"
        onClick={handleBackButton}
        style={currentIndex === 0 ? { display: "none" } : { display: "block" }}
      >
        <button class="page_switch_button previous_page_button">
          <span>Zurück</span>
        </button>
      </div>
    </div>
  );
};

export default MethodFinder;