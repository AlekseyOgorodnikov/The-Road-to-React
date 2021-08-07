import './App.css';
import { React, useState, useEffect } from 'react';

const App = () => {
  const stories = [
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
    const [value, setValue] = useState(
      localStorage.getItem(key) || initialState
    );

    useEffect(() => {
      localStorage.setItem(key, value);
    }, [value, key]);

    return [value, setValue];
  };

  const [searchTerm, setSearchTerm] = usePersistentState('search', 'Re');

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="App">
      <h1>My Hacker Stories</h1>

      <Search onSearch={handleSearch} search={searchTerm} />
      <br />
      <hr />
      <List list={searchedStories} />
    </div>
  );
};

const Search = ({ search, onSearch }) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" value={search} onChange={onSearch} />

      <p>
        Search for <strong>{search}</strong>
      </p>
    </div>
  );
};

const List = ({ list }) =>
  list.map((item) => <Item key={item.objectID} {...item} />);

const Item = ({ title, url, author, num_comments, points }) => (
  <div>
    <h2>
      <a href={url}>{title}</a>
    </h2>
    <h3>{author}</h3>
    <span>Comments: {num_comments}</span>
    <br />
    <span>Points: {points}</span>
  </div>
);

export default App;
