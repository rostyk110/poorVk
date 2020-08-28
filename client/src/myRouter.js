import React from 'react'
import {Route, Switch} from "react-router-dom";
import Profile from "./components/Profile/Profile";
import Dashboard from "./components/Dashboard/Dashboard";
import {withSuspense} from "./components/hoc/withSuspense/withSuspense";


// lazy loading
const Dialogs = React.lazy(() => import("./components/Dialogs/Dialogs"))
const Music = React.lazy(() => import("./components/Music/Music"))
const Settings = React.lazy(() => import("./components/Settings/Settings"))
const News = React.lazy(() => import("./components/News/News"))
const Users = React.lazy(() => import("./components/Users/Users"))

const MyRouter = () => {
  return (
    <div>
      <Switch>
        <Route path="/profile/:id?" render={() => <Profile/>}/>
        <Route path="/dialogs/:id?" render={withSuspense(Dialogs)}/>
        <Route path="/music" render={withSuspense(Music)}/>
        <Route path="/news" render={withSuspense(News)}/>
        <Route path="/users" render={withSuspense(Users)}/>
        <Route path="/settings" render={withSuspense(Settings)}/>
        <Route path="/" render={() => <Dashboard/>}/>
      </Switch>
    </div>
  )
}

export default MyRouter
