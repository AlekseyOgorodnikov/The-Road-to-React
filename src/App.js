import './App.css';
import {
  React,
  useState,
  useEffect,
  useRef,
  useReducer,
  useCallback,
} from 'react';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const usePersistentState = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);

  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          (story) => action.payload.objectID !== story.objectID
        ),
      };

    default:
      throw new Error();
  }
};

const App = () => {
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false,
  });

  const [searchTerm, setSearchTerm] = usePersistentState('search', 'Re');

  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const handleFetchStories = useCallback(() => {
    dispatchStories({ type: 'STORIES_FETCH_INIT' });

    fetch(url)
      .then((response) => response.json())
      .then((result) => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS',
          payload: result.hits,
        });
      })
      .catch(() => dispatchStories({ type: 'STORIES_FETCH_FAILURE' }));
  }, [url]);

  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  // input value
  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    setUrl(`${API_ENDPOINT}${searchTerm}`);
  };

  // remove card
  const handleRemoveStory = (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item,
    });
  };

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>

      <InputWithLable
        id="search"
        type="text"
        isFocused
        value={searchTerm}
        onInputChange={handleSearchInput}
      >
        <strong>Search: </strong>
      </InputWithLable>
      <button type="button" disabled={!searchTerm} onClick={handleSearchSubmit}>
        Submit
      </button>
      <br />
      <hr />

      {stories.isError && <p>Something went wrong...</p>}

      {stories.isLoading ? (
        <>
          <br />
          <p>Loading...</p>
        </>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
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
