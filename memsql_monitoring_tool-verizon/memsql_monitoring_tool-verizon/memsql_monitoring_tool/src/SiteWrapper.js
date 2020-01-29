// @flow

import * as React from "react";
import { NavLink, withRouter } from "react-router-dom";

import {
  Site,
  Nav,
  Grid,
  List,
  Button,
  RouterContextProvider,
} from "tabler-react";

const navBarItems = [
  {
    value: "Cluster System Metrics",
    to: "/",
    icon: "home",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  /*{
    value: "Logs",
    to: "/logs",
    icon: "file-text",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Tickets",
    to: "/tickets",
    icon: "calendar",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Processlist",
    to: "/processlist",
    icon: "align-justify",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Event",
    to: "/events",
    icon: "zap",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Threads",
    to: "/threads",
    icon: "zap",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Custom SQL",
    to: "/custom",
    icon: "zap",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },*/
  {
    value: "Cluster MemSQL Metrics",
    to: "/cluster-stats",
    icon: "box",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  {
    value: "Active Session History",
    to: "/ash",
    icon: "zap",
    LinkComponent: withRouter(NavLink),
    useExact: true,
  },
  
];

const accountDropdownProps = {
  avatarURL: "./demo/faces/female/25.jpg",
  name: "Dummy User",
  description: "Administrator",
  options: [
    { icon: "user", value: "Profile" },
    { icon: "settings", value: "Settings" },
    { icon: "mail", value: "Inbox", badge: "6" },
    { icon: "send", value: "Message" },
    { isDivider: true },
    { icon: "help-circle", value: "Need help?" },
    { icon: "log-out", value: "Sign out" },
  ],
};

class SiteWrapper extends React.Component {
  /*state = {
    notificationsObjects: [
      {
        unread: true,
        avatarURL: "demo/faces/male/41.jpg",
        message: (
          <React.Fragment>
            <strong>Nathan</strong> pushed new commit: Fix page load performance
            issue.
          </React.Fragment>
        ),
        time: "10 minutes ago",
      },
      {
        unread: true,
        avatarURL: "demo/faces/female/1.jpg",
        message: (
          <React.Fragment>
            <strong>Alice</strong> started new task: Tabler UI design.
          </React.Fragment>
        ),
        time: "1 hour ago",
      },
      {
        unread: false,
        avatarURL: "demo/faces/female/18.jpg",
        message: (
          <React.Fragment>
            <strong>Rose</strong> deployed new version of NodeJS REST Api // V3
          </React.Fragment>
        ),
        time: "2 hours ago",
      },
    ],
  };*/

  render() {
    /*const notificationsObjects = this.state.notificationsObjects || [];
    const unreadCount = this.state.notificationsObjects.reduce(
      (a, v) => a || v.unread,
      false
    );*/
    return (
      <Site.Wrapper
        
        headerProps={{
          href: "/",
          alt: "",
          imageURL: "/static/media/memsql.svg",
          right_logo: "/static/media/logowhite.svg",
          /*notificationsTray: {
            notificationsObjects,
            markAllAsRead: () =>
              this.setState(
                () => ({
                  notificationsObjects: this.state.notificationsObjects.map(
                    v => ({ ...v, unread: false })
                  ),
                }),
                () =>
                  setTimeout(
                    () =>
                      this.setState({
                        notificationsObjects: this.state.notificationsObjects.map(
                          v => ({ ...v, unread: true })
                        ),
                      }),
                    5000
                  )
              ),
            unread: unreadCount,
          },*/
          //accountDropdown: accountDropdownProps,
        }}
        navProps={{ itemsObjects: navBarItems }}
        routerContextComponentType={withRouter(RouterContextProvider)}
        footerProps={{
          links: [],
          note: "",
          /*
            "Premium and Open Source dashboard template with responsive and high quality UI. For Free!",
*/
          copyright: (
            <React.Fragment>
              Copyright by Starschema© 2019
              <a href=".">MemSQL Monitoring</a>
              {/*. Theme by
              <a
                href="https://starschema.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                starschema.com
              </a>{" "}
              All rights reserved.*/}
            </React.Fragment>
          ),
          nav: (
            <React.Fragment>
              <Grid.Col auto={true}>
                {/*<List className="list-inline list-inline-dots mb-0">
                  <List.Item className="list-inline-item">
                    <a href="./docs/index.html">Documentation</a>
                  </List.Item>
                  <List.Item className="list-inline-item">
                    <a href="./faq.html">FAQ</a>
                  </List.Item>
                </List>*/}
              </Grid.Col>
            </React.Fragment>
          ),
        }}
      >
        {this.props.children}
      </Site.Wrapper>
    );
  }
}

export default SiteWrapper;
