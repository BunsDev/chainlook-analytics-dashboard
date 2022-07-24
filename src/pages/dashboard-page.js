/* eslint-disable react/no-array-index-key */
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Dashboard from '../components/dashboard';
import { getDashboard, saveDashboardLocally } from '../data-service';
import usePromise from '../hooks/use-promise';

function DashboardPage() {
  const navigate = useNavigate();
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

  const onForkClick = React.useCallback(async () => {
    await saveDashboardLocally(dashboard);
    navigate('/dashboard/new'); // TODO: a hack for now - new widget page will load the most recent local widget
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
          <a className="link view-source mr-2 pt-1" href={`https://ipfs.io/ipfs/${dashboardId}`} target="_blank" rel="noreferrer" title="View source">
            <i className="icon-code" />
          </a>

          <div role="button" tabIndex={0} className="icon-button pt-1" onClick={onForkClick} title="Copy this dashbord locally and edit">
            <i className="icon-clone" />
          </div>
        </div>
      </div>

      <Dashboard config={dashboard} />

    </div>
  );
}

export default DashboardPage;
