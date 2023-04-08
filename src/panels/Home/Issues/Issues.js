import { memo, useEffect } from "react";
import {
  Banner,
  HorizontalCell,
  HorizontalScroll,
  Spinner,
} from "@vkontakte/vkui";

import { useSubscribe } from "../../../hooks";
import { githubController } from "../../../entity/Github";
import { GithubIcon } from "../../../icons";

import classes from "./Issues.module.css";

function Issues() {
  useSubscribe(
    githubController.issues$,
    githubController.issuesError$,
    githubController.issuesLoading$
  );

  useEffect(() => githubController.getIssues(), []);

  if (githubController.issuesLoading$.getValue()) {
    return (
      <div className={classes.spinnerContainer}>
        <Spinner size="large" className={classes.spinner} />
      </div>
    );
  }

  return (
    <HorizontalScroll>
      <div style={{ display: "flex" }}>
        {githubController.issues$.getValue().map(({ html_url, title }) => (
          <HorizontalCell
            target="_blank"
            key={html_url}
            href={html_url}
            disabled
            size="l"
          >
            <Banner
              asideMode="expand"
              className={classes.bottomItem}
              before={<GithubIcon />}
              header="Open Source"
              subheader={<span>{title}</span>}
            />
          </HorizontalCell>
        ))}
      </div>
    </HorizontalScroll>
  );
}

export default memo(Issues);