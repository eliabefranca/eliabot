import { BrowserRouter, Switch, Route } from 'react-router-dom';
import User from '../pages/User';
import Users from '../pages/Users';
import Groups from '../pages/Groups';
import Group from '../pages/Group';

function Router() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/groups">
          <Groups />
        </Route>
        <Route path="/group/:id">
          <Group />
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/user/:id">
          <User />
        </Route>
        <Route path="/">
          <Users />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default Router;
