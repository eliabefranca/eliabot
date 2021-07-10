import { BrowserRouter, Switch, Route } from 'react-router-dom';
import History from '../pages/History';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/history">
          <History />
        </Route>
        <Route>
          <History />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
