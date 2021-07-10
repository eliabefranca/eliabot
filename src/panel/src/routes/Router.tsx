import { BrowserRouter, Switch, Route } from 'react-router-dom';
import History from '../pages/History';
import User from '../pages/User';
import Users from '../pages/Users';
import Groups from '../pages/Groups';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact={true} path="/history">
          <History />
        </Route>
        <Route path="/groups">
          <Groups />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/user/:id">
          <User />
        </Route>
        <Route path="/">
          <History />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
