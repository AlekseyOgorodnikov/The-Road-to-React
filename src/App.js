import './App.css';
import { React, useState } from 'react';

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
  const [searchTerm, setSearchTerm] = useState('R');

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

const Search = (props) => {
  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input
        id="search"
        type="text"
        value={props.search}
        onChange={props.onSearch}
      />

      <p>
        Search for <strong>{props.search}</strong>
      </p>
    </div>
  );
};

const List = (props) =>
  props.list.map((item) => (
    <div key={item.objectID}>
      <h2>
        <a href={item.url}>{item.title}</a>
      </h2>
      <h3>{item.author}</h3>
      <span>Comments: {item.num_comments}</span>
      <br />
      <span>Points: {item.points}</span>
    </div>
  ));

export default App;
