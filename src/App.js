import './App.css';
import { React, useState, useEffect, useRef, useReducer } from 'react';

const initialStories = [
  {
    title: 'React',
    url: 'http://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

const usePersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'SET_STORIES':
      return action.payload;
    case 'REMOVE_STORY':
      return state.filter(
        (story) => action.payload.objectID !== story.objectID
      );

    default:
      throw new Error();
  }
};

const App = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, []);

  const getAsyncStories = () =>
    new Promise((resolve) =>
      setTimeout(() => resolve({ data: { stories: initialStories } }), 2000)
    );

  const [isLoading, setIsLoading] = useState(false);

  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: 'SET_STORIES',
          payload: result.data.stories,
        });
        setIsLoading(false);
      })
      .catch(() => setIsError(true));
  }, []);

  const [searchTerm, setSearchTerm] = usePersistentState('search', 'Re');

  // render input value
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // remove card
  const handleRemoveStory = (item) => {
    // const newStories = stories.filter(
    //   (story) => item.objectID !== story.objectID
    // );
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>

      <InputWithLable
        id="search"
        type="text"
        isFocused
        value={searchTerm}
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLable>
      <br />
      <hr />

      {isError && <p>Something went wrong...</p>}

      {isLoading ? (
        <>
          <br />
          <p>Loading...</p>
        </>
      ) : (
        <List list={searchedStories} onRemoveItem={handleRemoveStory} />
      )}
    </div>
  );
};

const InputWithLable = ({
  id,
  children,
  type,
  isFocused,
  value,
  onInputChange,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused]);
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
      <p>
        Search for <strong>{value}</strong>
      </p>
    </>
  );
};

const List = ({ list, onRemoveItem }) =>
  list.map((item) => (
    <Item key={item.objectID} item={item} onRemoveItem={onRemoveItem} />
  ));

const Item = ({ item, onRemoveItem }) => {
  return (
    <div>
      <h2>
        <a href={item.url}>{item.title}</a>
      </h2>
      <h3>{item.author}</h3>
      <span>Comments: {item.num_comments}</span>
      <br />
      <span>Points: {item.points}</span>
      <br />
      <button
        type="button"
        onClick={() => {
          onRemoveItem(item);
        }}
      >
        Dissmis
      </button>
    </div>
  );
};

export default App;
