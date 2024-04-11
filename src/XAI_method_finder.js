import React, { useState, useEffect } from "react";
import ModelData from "./methods.json";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Ready-made icons used in the application
import { faSquareMinus as unknown,
         faPeopleGroup as stakeholder, faCircleUser as user, faCode as developer, faCrown as owner, faCircleCheck as validator,
         faPeopleRoof as trust, faGavel as legitimate, faClipboardList as evaluate, faArrowTrendUp as improve, faSchool as learn,
         faImage as images, faFileLines as text, faTableList as tabular,
         faChartLine as regression, faTag as classification, faBrain as generative,
         faClone as cnn, faLayerGroup as mlp, faCodeBranch as llm,
         faXmark as closeButton, faForward as llmTransitionButton
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
    mlp,
    llm
  };

  function getButtonIcon(buttonTag) {
    return iconMappings[buttonTag] || null;
  }

  const [currentIndex, setCurrentIndex] = useState(0);

  // When the "Weiter" button is pressed, it updates the currentIndex value.
  const handleNextButton = () => {
    setCurrentIndex(currentIndex + 1);
  };

  // When the "Zuruck" button is pressed, it updates the currentIndex value.
  const handleBackButton = () => {
    setCurrentIndex(currentIndex - 1);
  };

  const handleTargetGroupButton = () => {
    setCurrentIndex(props.data.findIndex(item =>item.tag==="role"));
  };

  const { tag, title, description, elements } = props.data[currentIndex];

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

  const [isMethodExplanationVisible, setIsMethodExplanationVisible] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState();

  useEffect(() => {
    if (tag !== "xaiMethods")
      setIsMethodExplanationVisible(false);
  }, [tag]);

  const handleButtonChange = (id, buttonIndex) => {

    // Queries whether the button selected by clicking on it in the interface has been selected before.
    const elementExists = selectedButtons.some(item => (
      item[0] === tag && item[1] === buttonIndex
    ));

    const newOption = [tag, buttonIndex];

    if (elementExists) { // remove from list
      const updatedOptions = selectedButtons.filter(item => (
        item[0] !== tag || item[1] !== buttonIndex
      ));
      setSelectedButtons(updatedOptions);
    }
    else {  // add to list
      // If "unknown" is selected, other options are not allowed.
      // Similarly, if anything other than "unknown" is selected, the selection of "unknown" is not allowed.
      if (id === "unknown") {
        if (!isAnyButtonSelected)
          setSelectedButtons(prevOptions => [...prevOptions, newOption]);
      }
      else {
        if (!isUnknownOptionSelected) {  // "unknown" is not selected

          if (tag === "role") { // target group
            if (id !== "developer" && !targetGroup.includes("developer")) { // if id is different from "developer" and target group does not include "developer"
              setSelectedButtons(prevOptions => [...prevOptions, newOption]);
            }
            else if (id === "developer" && targetGroup.length === 0) { // if id is "developer" and target group is empty
              setSelectedButtons(prevOptions => [...prevOptions, newOption]);
            }
          }
          else if (tag === "modelType") {
            if (id === "llm" && modelType.length === 0) {
              setSelectedButtons(prevOptions => [...prevOptions, newOption]);
              setIsTooltipVisible(false); // When the LLM option is selected, a new button will appear, for that the tooltip has been made invisible.
            }
            else if (id !== "llm" && !modelType.includes("llm")) {
              setSelectedButtons(prevOptions => [...prevOptions, newOption]);
            }
          }
          else {
            setSelectedButtons(prevOptions => [...prevOptions, newOption]);
          }
        }
      }
    }

    if (tag === "role") {
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
    if (tag === "goal") {
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
    if (tag === "dataType") {
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
    if (tag === "problemType") {
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
    if (tag === "modelType") {
      if (modelType.includes(id)) {
        setModelType(modelType.filter(item => item !== id));
      }
      else {
        if (id === "unknown") {
          if (!isAnyButtonSelected) {
            setModelType([...modelType, id]);
          }
        }
        else {
          if (!modelType.includes("unknown")) {
            if (id === "llm" && !isAnyButtonSelected) {
              setModelType([...modelType, id]);
            }
            else if (id !== "llm" && !modelType.includes("llm")) {
              setModelType([...modelType, id]);
            }
          }
        }
      }
    }

  };

  // target group - specialist knowledge
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

    // When "LLM" is selected as Model Type, another button will be visible and Tooltip display is not allowed to avoid conflicts with it.
    // When the LLM option was chosen, it was planned to be directed to an application consisting of different stages. (Not functional yet)
    if (!(tag === "modelType" && isLLMSelected) && !isTextboxVisible) {
      setIsTooltipVisible(true);
    }
  };

  const handleMouseLeave = () => {
    setIsTooltipVisible(false);
  };

  const [validMethods, setValidMethods] = useState(ModelData.map(method => method));

  // Methods that are suitable for the selections made by the user in the interface are filtered.
  useEffect(() => {
    const determineMethod = () => {
      const newValidMethods = ModelData.filter(method => checkMethod(method)).map(method => method);
      setValidMethods(newValidMethods);
    };

    const checkMethod = (method) => {
      let isGoalsValid = true;
      let isProblemsValid = true;
      let isModelsValid = true;
      let isDataValid = true;

      // For now, selecting the "unknown" button is assumed to have no effect.
      // goals
      if (!explanatoryGoals.includes("unknown")) {
        for (let i = 0; i < explanatoryGoals.length; i++) {
          isGoalsValid = method.features.some(goal => goal.type === "goal" && goal.tag === explanatoryGoals[i]);
          if (!isGoalsValid) break;
        }
      }
      
      // problems
      if (!problemType.includes("unknown")) {
        for (let i = 0; i < problemType.length; i++) {
          isProblemsValid = method.features.some(problem => problem.type === "problemType" && problem.tag === problemType[i]);
          if (!isProblemsValid) break;
        }
      }

      // data
      if (!dataType.includes("unknown")) {
        for (let i = 0; i < dataType.length; i++) {
          if (method.features.some(data_type => data_type.type === "dataType" && data_type.tag === "any") &&
              dataType.some(tag => tag !== "unknown")) 
          { isDataValid = true; }
          else {  
            isDataValid = method.features.some(data_type => data_type.type === "dataType" && data_type.tag === dataType[i]);
            if (!isDataValid) break;
          }
        }
      }

      // model 
      // Agnostic was assumed to include CNN and MLP.
      if (!modelType.includes("unknown")) {
        for (let i = 0; i < modelType.length; i++) {
          if (modelType[i] === "cnn" || modelType[i] === "mlp") {
            isModelsValid = method.features.some(model_type => model_type.type === "modelType" && 
                                                (modelType[i] !== "unknown" && (model_type.tag === modelType[i] || model_type.tag === "agnostic")));
          }
          else {
            isModelsValid = method.features.some(model_type => model_type.type === "modelType" && 
                                                (modelType[i] !== "unknown" && model_type.tag === modelType[i]));
          }

          if (!isModelsValid) break;
        }
      }

      let isGlobal = true, isLocal = true, isCounterfactual = true;

      // explanation scope
      if (selectedQuestions['global']) {
        isGlobal = method.features.some(explanation_scope => explanation_scope.type === "explanationScope" && explanation_scope.tag === "global");
      }
      if (selectedQuestions['local']) {
        isLocal = method.features.some(explanation_scope => explanation_scope.type === "explanationScope" && explanation_scope.tag === "local");
      }
      if (selectedQuestions['counterfactual']) {
        isCounterfactual = method.features.some(explanation_scope => explanation_scope.type === "explanationScope" && explanation_scope.tag === "counterfactual");
      }

        return isGoalsValid && isProblemsValid && isModelsValid && isDataValid && (isGlobal && isLocal && isCounterfactual);
    };

    determineMethod();

  }, [dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions]);

  const [isUnknownOptionSelected, setIsUnknownOptionSelected] = useState(false);
  const [isAnyButtonSelected, setIsAnyButtonSelected] = useState(false);  // except "unknown"

  useEffect(() => {
    setTextInput('');
    if ((tag === "role" && targetGroup.includes("unknown")) || (tag === "goal" && explanatoryGoals.includes("unknown")) ||
        (tag === "dataType" && dataType.includes("unknown")) || (tag === "problemType" && problemType.includes("unknown")) ||
        (tag === "modelType" && modelType.includes("unknown")))
    {
      setIsUnknownOptionSelected(true);
      setIsTextboxVisible(true);
      setIsTooltipVisible(false);
    }
    else {
      setIsUnknownOptionSelected(false);
      setIsTextboxVisible(false);
    }
  }, [tag, dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions, targetGroup]);

  useEffect(() => {
      if ((tag === "role" && !targetGroup.includes("unknown") && targetGroup.length > 0) || (tag === "goal" && !explanatoryGoals.includes("unknown") && explanatoryGoals.length > 0) ||
          (tag === "dataType" && !dataType.includes("unknown") && dataType.length > 0) || (tag === "problemType" && !problemType.includes("unknown") && problemType.length > 0) ||
          (tag === "modelType" && !modelType.includes("unknown") && modelType.length > 0))
      {
        setIsAnyButtonSelected(true);
      }
      else {
        setIsAnyButtonSelected(false);
      }
  }, [tag, dataType, elements, explanatoryGoals, modelType, problemType, selectedQuestions, targetGroup]);

  const [isLLMSelected, setIsLLMSelected] = useState(false);

  useEffect(() => {
    if (modelType.includes("llm")) {
      setIsLLMSelected(true);
    }
    else {
      setIsLLMSelected(false);
    }

  }, [modelType]);

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
    if (tag === "dataType") setDataTypeInput(textInput.trim());
    if (tag === "problemType") setProblemTypeInput(textInput.trim());
    if (tag === "modelType") setModelTypeInput(textInput.trim());
  };

  // Recommendations are filtered depending on the expertise level set through slider.
  const getRecommendations = () => {
    let expertiseLevel = levelOfExpertise < 3 ? 0 : 1;
    
    const filteredElements = elements.filter((element) => element.target_group.some((item) => targetGroup.includes(item.tag)));
    const selectedElement = filteredElements.find((element) => element.definition.some((definition) => definition.expertise === expertiseLevel));

    return selectedElement && selectedElement.definition.find((definition) => definition.expertise === expertiseLevel);
  }

  const [isFooterHovered, setIsFooterHovered] = useState(false);
  const [isFinalMethodPageHovered, setIsFinalMethodPageHovered] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState(null);

  const handleMethodInfoTab = (event) => {
    window.open(hoveredMethod.qr_url, '_blank');
  };

  // Coordinate is used to set the position of the window that will appear when you hover the mouse over the method names in the interface.
  const [mousePositionXForFooter, setMousePositionXForFooter] = useState(0);

  useEffect(() => {
    const handleMouseMoveX = (event) => {
      setMousePositionXForFooter(event.pageX);
    };

    window.addEventListener('mousemove', handleMouseMoveX);

    return () => {
      window.removeEventListener('mousemove', handleMouseMoveX);
    };
  }, []);

  return (
    <div>

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

      <h1 className="page_title">{title}</h1>

      <div className={(tag === "xaiMethods" || tag === "targetSpecific" )? 'output_container' : 'general_container'}>
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
                          className={selectedButtons.some(item => (item[0] === tag && item[1] === item2.index)) ? 'selected' : 'button'}
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
                  {isLLMSelected && (tag === "modelType") && (!isTooltipVisible) && (
                    // If LLM is selected as model type, it will be continued from the tabs created separately for LLM. 
                    // This button switches to that tab.
                    <div className="llm_button_container">
                      <button className="selected"><FontAwesomeIcon className="icon_container" icon={llmTransitionButton} style={{color: "#E58253"}}/></button>
                    </div>
                  )}
                  {isTextboxVisible && (tag === "dataType" || tag === "problemType" || tag === "modelType") && (
                    <div className="textbox_unknown"
                         style={isTooltipVisible && currentTooltip !== item1.options.length-1 ? { display: "none" } : { display: "block" }}>
                      <p className="text" 
                         dangerouslySetInnerHTML={{ __html: item1.options[item1.options.length-1].description }}/>
                      <div className="input_container">
                        <textarea className={textInput.trim() !== '' ? "textbox textbox_focused" : "textbox"} value={textInput} placeholder=" Text eingeben..." onChange={handleInputChange}/>
                        <button onClick={handleSubmit}>Einreichen</button>
                      </div>
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

            {tag === "xaiMethods" && validMethods.length > 0 && (
              <>
              {!isMethodExplanationVisible && (
              <div className="method_slider_container">
                <div className="method_container">
                  {validMethods.map((method) => (
                    <div key={method} className="method_object">
                      <h3 className="method_title"
                          onMouseEnter={() => {setIsFinalMethodPageHovered(true); setHoveredMethod(method);}}
                          onMouseLeave={() => setIsFinalMethodPageHovered(false)}> {method.title} </h3>
                        <div className="method_info">
                            <p>Weitere Info:</p>
                            <img className="qr_image" src={process.env.PUBLIC_URL + method.qr_code} alt="qrCode"/>
                            <button
                              type="button" className="qr_button"
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedMethod(method);
                                setIsMethodExplanationVisible(!isMethodExplanationVisible);
                                //window.open(method.qr_url, '_blank');
                              }}>Klick!
                            </button>
                        </div>
                    </div>
                  ))}
                </div>
              </div>
              )}
            
                {isMethodExplanationVisible && (
                  <div className="method_explanation_container">
                    <div className="close_button_container">
                    <button
                        type="button" className="qr_close_button"
                        onClick={(e) => {
                          e.preventDefault();
                          setIsMethodExplanationVisible(false);
                        }}><FontAwesomeIcon id="close_button" icon={closeButton} />
                    </button>
                    </div>
                    <div className="method_info_container">
                      <h3 className="method_title">{selectedMethod.title}</h3>
                      <iframe className="method_info_frame" src={selectedMethod.qr_url} title="Method Explanation"/>
                    </div>
                  </div>
                )}
                </>
            )}
            {tag === "xaiMethods" && validMethods.length === 0 && (
              <>
              <p className="description" style={{marginTop: '2%'}}><b>Es wurde keine XAI-Methode gefunden, die den von Ihnen ausgewählten Kriterien entspricht.</b></p>
              </>
            )}

            {tag === "targetSpecific" && targetGroup.length > 0 && !targetGroup.includes("unknown") && (
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
            {tag === "targetSpecific" && (targetGroup.length === 0 || targetGroup.includes("unknown")) && (
              <>
              <p className="description" style={{textAlign: 'center', marginTop: '2%'}}><b>Sie haben keine gültige Rolle ausgewählt.<br></br><br></br>Bitte treffen Sie Ihre Wahl:</b></p>
              <button className="button_target_tab" onClick={handleTargetGroupButton}>Zielgruppe - Rolle</button>
              </>
            )}

      </div> 
      </div>

      {tag !== "homepage" && tag !== "startingTips" && tag !== "role" && tag !== "expertise" && tag !== "xaiMethods" && tag !== "targetSpecific" && (
          <div className="footer_method_slider_container">
            <div className="footer_method_container">
              {ModelData.map((method) => {
                const isValid = validMethods.some(validMethod => validMethod === method);
                const className = isValid ? "valid" : "invalid";
                  return (
                  <div>
                    <div key={method} className={`method_object ${className}`}
                         onMouseEnter={() => {setIsFooterHovered(true);
                                              setHoveredMethod(method);}
                                      }
                         onClick={handleMethodInfoTab}
                         onMouseLeave={() => setIsFooterHovered(false)}>
                      <h3 className="method_title">{method.title}</h3>
                    </div>

                  </div>
                  );
              })}
            </div>
          </div>
      )}

      {(isFooterHovered || isFinalMethodPageHovered) && (
        // When you hover the mouse over the method names in the footer and on the final page, information about the method is displayed.
        // Here, some adjustments are made to how the information will be displayed.

        <div className="footer_method_details" style={{position: "absolute", left: `${mousePositionXForFooter+10}px`, marginTop: "-17.5%"}}>
          <h3 className="method_title_pop_up">{hoveredMethod.title}</h3>
            {hoveredMethod.features.reduce((accumulator, feature, index, array) => {
              let correspondingCategory, categoryTitle, correspondingElement, elementTitle;
                if (feature.type === "explanationScope") {
                  categoryTitle = "Explanation Scope";
                  if (feature.tag === "global") {elementTitle = "Global"}
                  else if (feature.tag === "local") {elementTitle = "Local"}
                  else if (feature.tag === "counterfactual") {elementTitle = "Counterfactual"}
                  correspondingCategory = true;
                  correspondingElement = true;
                }
                else {
                  correspondingCategory = props.data.find(element => element.tag === feature.type);
                  if (correspondingCategory) {
                    categoryTitle = correspondingCategory.title;
                    if (feature.type === "modelType" && feature.tag === "agnostic") {
                      elementTitle = "Agnostic";
                      correspondingElement = true;
                    }
                    else {
                      correspondingElement = correspondingCategory.elements.find(e => e.type === "select").options.find(t => t.tag === feature.tag);
                        if (correspondingElement) {
                          elementTitle = correspondingElement.title;
                        }
                    }
                  }
                }

                if (correspondingCategory && correspondingElement) {

                  if (index === 0 || array[index - 1].type !== feature.type) {
                    accumulator.push(<p key={index}><strong>{categoryTitle}:</strong> {elementTitle}</p>);
                  }
                  else {
                    accumulator[accumulator.length - 1] = (
                      <p key={index}>{accumulator[accumulator.length - 1].props.children}, {elementTitle}</p>
                    );
                  }
                }
                  return accumulator;
            }, [])}
        </div>
      )}

    </div>
  );
};

export default MethodFinder;