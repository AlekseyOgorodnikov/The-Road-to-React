import './App.css';

function getTitle(title) {
  return title;
}

const list = [
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

function App() {
  return (
    <div className="App">
      <h1>Hello {getTitle('React')}</h1>

      <label htmlFor="search">Search: </label>
      <input id="search" type="text" />
      <br />
      {list.map((item) => {
        return (
          <div key={item.objectID}>
            <h3>
              <a href={item.url}>{item.title}</a>
            </h3>
            <h2>{item.author}</h2>
            <span>Comments: {item.num_comments}</span>
            <br />
            <span>Points: {item.points}</span>
          </div>
        );
      })}
    </div>
  );
}

export default App;
