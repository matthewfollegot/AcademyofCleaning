import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import CreateProfile from "./Components/CreateProfile";
import HomePage from './Components/HomePage';
import ProfilePage from "./Components/ProfilePage";
import SearchCandidates from './Components/SearchCandidates';

// rendering app
function App() {
  return (
    <Router>
      <div className="App">
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/profiles/create">
          <CreateProfile />
        </Route>
        <Route exact path="/profiles/:id" component={ProfilePage}/>
        <Route exact path="/search">
            <SearchCandidates />
        </Route>
      </Switch>
      </div>
    </Router>
  );
}


export default App;
