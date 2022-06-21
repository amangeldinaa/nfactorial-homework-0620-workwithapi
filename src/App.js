import {useEffect, useState} from "react";
import "./App.css";
import axios from "axios";
// import { TodoistApi } from '@doist/todoist-api-typescript'

// response.setHeader("Access-Control-Allow-Origin", "*");
// response.setHeader("Access-Control-Allow-Credentials", "true");
// response.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
// response.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

const BACKEND_URL = "https://api.todoist.com/rest/v1/tasks";

// const api = new TodoistApi('0123456789abcdef0123456789')

// api.getProjects()
//     .then((projects) => console.log(projects))
//     .catch((error) => console.log(error))

/*
* Plan:
*   1. Define backend url
*   2. Get items and show them +
*   3. Toggle item done +
*   4. Handle item add +
*   5. Delete +
*   6. Filter
*
* */

function App() {
  const [itemToAdd, setItemToAdd] = useState("");
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleChangeItem = (event) => {
    setItemToAdd(event.target.value);
  };

  const handleAddItem = () => {
    axios.post(`https://api.todoist.com/rest/v1/tasks`,
    {    
        content: itemToAdd,
        done: false    
    },{
        headers: {
          Authorization: 'Bearer 4e7bd8183a5c312e96d0bd782844a27c9c4b3147'
        }
    }).then((response) => {
        setItems([ ...items, response.data])
    })
    setItemToAdd("");
    console.log(items);
  };


  const toggleItemDone = ({ id, done }) => {
      axios.post(`https://api.todoist.com/rest/v1/tasks/${id}/close`, {
        done: !done
      },{ 
        headers: {
          Authorization: 'Bearer 4e7bd8183a5c312e96d0bd782844a27c9c4b3147'
        }
      }).then((response) => {
        console.log(response)
          setItems(items.map((item) => {
              if (item.id === id) {
                  return {
                      ...item,
                      done: !done
                  }
              }
              return item
          }))

      })
  };

  // N => map => N
    // N => filter => 0...N
  const handleItemDelete = (id) => {
      axios.delete(`${BACKEND_URL}/todos/${id}`).then((response) => {
          const deletedItem = response.data;
          console.log('Было:',items)
          const newItems = items.filter((item) => {
              return deletedItem.id !== item.id
          })
          console.log('Осталось:',newItems)
          setItems(newItems)
      })
  };

  // const showCompletedItem = ()

  useEffect(() => {
      console.log(searchValue)
      axios.get(`https://api.todoist.com/rest/v1/tasks`, {
        headers: {
          Authorization: 'Bearer 4e7bd8183a5c312e96d0bd782844a27c9c4b3147'
        }
      }).then((response) => {
          setItems(response.data);
      })
  }, [searchValue])



  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
      </div>

      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
        />
      </div>

      {/* List-group */}
      <ul className="list-group todo-list">
        {items.length > 0 ? (
          items.map((item) => (
            <li key={item.id} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""}`}>
                <span
                  className="todo-list-item-label"
                  onClick={() => toggleItemDone(item)}
                >
                  {item.content}
                </span>

                <button
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>

                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                  onClick={() => handleItemDelete(item.id)}
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))
        ) : (
          <div>No todos🤤</div>
        )}
      </ul>

      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>

      {/* Show completed */}
      {/* <div>
      <button className="btn btn-outline-secondary" onClick={showCompletedItem}>
          Show completed
        </button>
      </div> */}
    </div>
  );
}

export default App;
