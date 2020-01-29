import * as React from "react";
import { Page, Grid, Card } from "tabler-react";
import SiteWrapper from "../SiteWrapper";
import CustomTable from "../components/CustomTable/CustomTable";

function Events() {
  return (
    <SiteWrapper>
      <Page.Content>
        <Grid.Row>
          <Grid.Col width={12}>
            <Card>
              <CustomTable
                table_id={"mv_events"}
                type={"static"}
                style={{ float: "left", width: "80%", minWidth: "80%" }}
              />
            </Card>
          </Grid.Col>
        </Grid.Row>
      </Page.Content>
    </SiteWrapper>
  );
}

export default Events;
