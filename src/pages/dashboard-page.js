/* eslint-disable react/no-array-index-key */
import React from 'react';
import { Link, useParams } from 'react-router-dom';
import Dashboard from '../components/dashboard';
import { getDashboard } from '../data-service';
import usePromise from '../hooks/use-promise';

function DashboardPage() {
  const { dashboardId } = useParams();

  const [dashboard, { isFetching, error }] = usePromise(() => getDashboard(dashboardId), {
    dependencies: [dashboardId],
    conditions: [dashboardId],
  });

  React.useEffect(() => {
    if (dashboard) {
      document.title = `${dashboard.title} - ChainLook`;
    }
  }, [dashboard]);

  if (isFetching) {
    return (<div className="page dashboard-page">Loading</div>);
  }

  if (error) {
    if (error.message.includes('404')) {
      return (
        <div className="page dashboard-page">
          No dashboard found with this CID. If this is a newly created dashbaord it would take some time be available on IPFS.
          <br />
          Please reload this page after few seconds.
        </div>
      );
    }

    return (<div className="page dashboard-page">{error.message}</div>);
  }

  return (
    <div className="page dashboard-page">

      <div className="dashboard-actions">
        <h2 className="dashboard-title">
          {dashboard?.title}
        </h2>

        <div className="flex-row">
          <a className="link mr-2 pt-1" href={`https://ipfs.io/ipfs/${dashboardId}`} target="_blank" rel="noreferrer" title="View source">
            <i className="icon-code" />
          </a>

          <Link className="link icon-button pt-1" to={`/dashboard/new?fromId=${dashboardId}`} title="Copy this dashbord locally and edit">
            <i className="icon-clone" />
          </Link>
        </div>
      </div>

      <Dashboard config={dashboard} />

    </div>
  );
}

export default DashboardPage;
