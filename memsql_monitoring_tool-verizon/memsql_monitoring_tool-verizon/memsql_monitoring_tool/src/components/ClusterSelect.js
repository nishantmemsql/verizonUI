import { connect } from "react-redux";
import { setCluster, setClustersInfo } from "../redux/actions";
import { getCluster, getClusterInfo } from "../redux/selectors";
import Picky from "react-picky";
import { initHostColors, initNodeColors } from "../redux/actions/colorActions";
import * as React from "react";
import { Grid, Card } from "tabler-react";
import { Component } from "react";
import axios from "axios";

const mapStateToProps = state => {
  const cluster = null //getCluster(state) ? getCluster(state) : "";
  const cluster_info = getClusterInfo(state) ? getClusterInfo(state) : [];
  return { cluster, cluster_info };
};

class ClusterSelect extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const storedCluster = null //localStorage.getItem("cluster");
    console.log("cluster: ", this.props.cluster)
    if (!this.props.cluster) {
      axios
        .post("http://127.0.0.1:8000/api/", {
          table_id: "cluster_info",
          type: "static",
        })
        .then(res => {
          //this.props.initHostColors()
          //this.props.initNodeColors()
          console.log("result: ", res.data)
          /*if (Object.keys(res.data.data).length === 0) {
            this.props.setClustersInfo(
              {
                dummycluster: {
                  host: ["10.5.21.203", "ktymsqlmonitor2", "ktymsqlmonitor3"],
                  port: [3306, 3307],
                },
              },
              storedCluster
            );
          } else {
          */
          this.props.setClustersInfo(res.data.data, storedCluster);
          if (storedCluster && res.data.data[storedCluster]) {
            const hosts = res.data.data[storedCluster].host;
            const ports = res.data.data[storedCluster].port;
            let hostPorts = [];
            hosts.map(h => {
              ports.map(p => {
                hostPorts.push(h + ":" + p);
              });
            });
            this.props.initNodeColors(hostPorts);
            this.props.initHostColors(hosts);
          }
          //}
        })
        .catch(error => {
          console.log(error)
          this.props.setClustersInfo(
            {
              errordummycluster: {
                host: [],
                port: [],
              },
            },
            storedCluster
          );
          if (storedCluster) {
            const nodes = [];
            nodes.sort();
            this.props.initNodeColors(nodes);
            this.props.initHostColors(nodes.map(el => el.split(":")[0]));
          }
        });
    }
  }

  setAndSaveCluster = cluster => {
    localStorage.setItem("cluster", cluster);
    this.props.setCluster(cluster);

    /*if (this.props.cluster_info[cluster]) {
      const hosts = this.props.cluster_info[cluster].host;
      const ports = this.props.cluster_info[cluster].port;
      let hostPorts = [];
      hosts.map(h => {
        ports.map(p => {
          hostPorts.push(h + ":" + p);
        });
      });
      this.props.initNodeColors(hostPorts);
      this.props.initHostColors(hosts);
    }
    */
  };

  render() {
    return (
      <div style={{height: "48px"}}>
        <Picky
          value={this.props.cluster === "" ? undefined : this.props.cluster}
          options={Object.keys(this.props.cluster_info)}
          onChange={this.setAndSaveCluster}
          open={false}
          keepOpen={false}
          valueKey="id"
          labelKey="name"
          placeholder="Choose cluster"
          multiple={false}
          includeSelectAll={true}
          includeFilter={true}
          dropdownHeight={600}
          />
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  { setCluster, getCluster, setClustersInfo, initNodeColors, initHostColors }
)(ClusterSelect);
