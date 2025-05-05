
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import ResultsPage from "./ResultsPage";
import MapPage from "./MapPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/map" component={MapPage} />
      </Switch>
      <Footer />
    </Router>
  );
};

export default App;
    