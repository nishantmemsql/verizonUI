// @flow

import * as React from "react";

import {
  Page,
  Grid,
  Card,
} from "tabler-react";


import SiteWrapper from "../SiteWrapper";

import CustomTable from "../components/CustomTable/CustomTable";
import ClusterSelect from "../components/ClusterSelect";

function Home() {
  return (
    <SiteWrapper>
      <Page.Content>
        <ClusterSelect/>
        <Grid.Row>
          <Grid.Col width={12}>
            <Card>
              <CustomTable table_id={'logs'} type={'dynamic'} use_cluster={true} style={{ float: "left", width: "80%", minWidth: "80%" }}
              />
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default Home;
