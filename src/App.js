import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Link,
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
  useParams
} from 'react-router-dom';

/*

Consume the following GET endpoint:
https://reqres.in/api/unknown?per_page=12
It will return a JSON object. The data property of that object is an array of colors. 

Using React:

- Fetch that endpoint.
- Render cards in the screen with each color. Each card should at least have the name of the color. The cards (or part of the card's background) should have a background color representing itself (you can use the HEX value). Have fun with it, get as creative as you want. 
- Make it so that using only CSS, hovering on each card will make them zoom without shifting or moving any adjacent cards.
- Finally, implement it so that clicking on any card will open a lightbox modal in the center of the page, displaying any more details you want about that color. Clicking outside of the lightbox should close it.
- If at any point during the exercise you want to break the spec above to get really creative and implement something you really like, please do so. 

The solution has to use React and only functional components and hooks, no classes.

- To submit, simply fork this codepen, implement your solution and send it to us via LinkedIn or via email to antonio@usesilo.com.

*/
const url = 'https://reqres.in/api/unknown?per_page=12';

const App = () => {
  return (
    <>
      <Router>
        <Switch>
          <Route
            exact
            path={'/'}
            render={() => {
              return <Redirect to="/colors" />;
            }}
          />
          <Route exact path="/colors">
            <Home />
          </Route>
          <Route exact path="/colors/:id" component={Modal}></Route>
        </Switch>
      </Router>
    </>
  );
};
export default App;

const Home = () => {
  const [colors, setColors] = useState([]);
  useEffect(() => {
    const loadColors = async () => {
      try {
        await fetch(url)
          .then(res => res.json())
          .then(data => setColors(data.data));
      } catch (error) {
        return error;
      }
    };
    loadColors();
  }, []);
  return (
    <div className="cards">
      {colors.map(color => (
        <Color color={color} />
      ))}
    </div>
  );
};

const Color = props => {
  return (
    <div>
      <Link to={`/colors/${props.color?.id}`}>
        <div key={props.color?.id} className={props.color?.name}>
          {props.color?.name}
        </div>
      </Link>
    </div>
  );
};

function Modal() {
  const ref = useRef();
  const [isModalOpen, setModalOpen] = useState(true);
  useOnClickOutside(ref, () => setModalOpen(false));
  const [colorDetail, setColorDetail] = useState(null);
  let { id } = useParams();
  useEffect(() => {
    const loadColor = async () => {
      try {
        await fetch(`${url}&id=${id}`)
          .then(res => res.json())
          .then(data => setColorDetail(data.data));
      } catch (error) {
        return error;
      }
    };
    loadColor();
  });

  return (
    <div>
      {isModalOpen ? (
        <div ref={ref} className="modal">
          <h1>{colorDetail?.name}</h1>
          <p>{colorDetail?.year}</p>
        </div>
      ) : (
        <Redirect to="/colors" />
      )}
    </div>
  );
}

function useOnClickOutside(ref, handler) {
  useEffect(() => {
    const listener = event => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
