import React, { startTransition, useEffect, useRef, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import sunImg from './assets/images/icon-sun.svg';
import moonImg from './assets/images/icon-moon.svg';
import crossImg from './assets/images/icon-cross.svg';
import checkImg from './assets/images/icon-check.svg';
import styles from './bright.module.css';
function App() {
  const [filter,setFilter] = useState("All");
  const [todoData,setTodoData] = useState([]);
  const inputRef = useRef(null);
  const [theme,setTheme] = useState('dark');

  const loadTodoData = () => {
    const savedData = JSON.parse(localStorage.getItem("todoData")) || [];
    setTodoData(savedData);
  };

  const saveTodoData = () => {
    localStorage.setItem("todoData", JSON.stringify(todoData));
  };  

  useEffect(() => {
    window.addEventListener("load", loadTodoData);
    window.addEventListener("beforeunload", saveTodoData);

    return () => {
      window.removeEventListener("load", loadTodoData);
      window.removeEventListener("beforeunload", saveTodoData);
    };
  }, [todoData]);


  const handleForm = (event) => {
    event.preventDefault();
    const inputValue = inputRef.current.value ;
    if(inputValue.trim() === '') {
      toast.error('enter your task !')
    }else {
      if(todoData.some((task) => task.text === inputValue)) {
        toast.error('already added the task')
      }else {
        let oldData = [{text: inputValue , checked : false},...todoData];
        setTodoData(oldData);
        inputRef.current.value = '';
        toast.success('task is added');
      }
    }
  };




  function handleCheck(index) {
    let newData = [...todoData];
    newData[index].checked = !newData[index].checked;
    setTodoData(newData);
  }

  function deleteTask(index)  {
    let newData = todoData.filter( (_, i) =>  i != index);
    setTodoData(newData);
  }

  function clearCompleted() {
    let newData = todoData.filter( (ele,i) => !ele.checked);
    if( newData.length != todoData.length ){
      setTodoData(newData);
      toast.success("completed tasks are cleared")
    }else {
      toast.error("no completed tasks")
    }
    
  }

  const getFilterTodo = () => {
    switch (filter) {
      case "Active" : 
                    return todoData.filter((task) => !task.checked);
      case "Completed" : 
                    return todoData.filter (( task) => task.checked);
      default :
                    return todoData;

    }
  }

  useEffect( () => {
    if( theme == "bright" ) {
      document.body.style.backgroundColor = '#ececec ';
    }else {
      document.body.style.backgroundColor = "hsl(235, 21%, 11%)";
    }
    
  },[theme]);



  return (
    <>
      <div className="toastcontainer" style={{width : "100%",height:"100px",position: "fixed",top:"0",left:"0"}}>
        <ToastContainer className={'toast-container'} style={{overflowY:"hidden",maxHeight : "75px"}}/>
      </div>
      <div className="todo-wrapper">
        <div className="header">
          <h1>TODO</h1>
          <button onClick={()=>setTheme(theme === 'dark' ? 'bright' : 'dark')} className="toggle-theme">
            <img src={`${theme == 'dark' ? sunImg : moonImg}`} alt="" />
          </button>
          
        </div>
        <form className={`input-group ${theme == "bright" ? styles.Bright : '' }`}  >
          <button onClick={handleForm} type="submit" id="add-todo-btn"></button>
          <input className={`${theme == "bright" ? styles.inputcolor : ''}`}  type="text" ref={inputRef} placeholder="Create a new todo...." />
        </form>

        <div className={`todos-container ${theme == "bright" ? styles.Bright : ''}`}>
          {
            getFilterTodo().length == 0 ? <div className="no-items">
                                            <span className={`${theme == "bright" ? styles.inputcolor : ''}`}>{
                                                  filter == "All" ? "No tasks added" : ( filter == "Active" ?  "No Active tasks" : "No completed tasks" )

                                                  }</span>
                                          </div>  : null
          }
          <ul>
            {getFilterTodo().map((task , index) => {
              return (
                <li key={index} className={` ${theme == "bright" ? 'bright-theme' : ''}`} >
                  <button
                    className={`check-btn ${ task.checked ? 'checked' : ''}`}
                    onClick={()=>handleCheck(index)}
                    >
                    { task.checked ? <img className="check-icon" src={checkImg} alt=""  /> : null}
                  </button>
                  <p 
                    className={`${ task.checked ? 'disable-text' : ''}`}
                    onClick={()=>handleCheck(index)}
                    >
                    {task.text}
                  </p> 
                  <button onClick={() => deleteTask(index)} className="cross-icon-holder">
                    <img  className="cross-icon" src={crossImg} alt="" />
                  </button >
                </li>
              )
            })}
            
          </ul>

        </div>
        {
          
        <div className={`task-bar ${theme == "bright" ? styles.Bright : ''} `}>
          <p>{todoData.length}-items</p> 
          <div className={`navigator ${theme == "bright" ? 'nav-bright' : ''}`}>
            <button onClick={() => setFilter("All") } className={`  ${theme == "bright" ? styles.buttonhover : ""} ${filter == "All" ? 'active' : ''} navigator-btn`}>All</button>
            <button onClick={()=>setFilter("Active")} className={` ${theme == "bright" ? styles.buttonhover : ""} ${filter == "Active" ? 'active' : ''} navigator-btn`}>Active</button>
            <button onClick={()=>setFilter("Completed")} className={` ${theme == "bright" ? styles.buttonhover : ""} ${filter == "Completed" ? 'active' : ''} navigator-btn`}>Completed</button>
          </div>
          <div className={`default ${theme == "bright" ? styles.Bright : '' }`}></div>


        <div className="clearSection">
              <button className={`${theme == "bright" ? styles.buttonhover : ""}`} onClick={clearCompleted}>Clear marked</button>
          </div>


        </div>  }




      </div>

      <div className="footer">
        <span>Drag and Drop to recorder list</span>
      </div>
    </>
  )
}

export default App
