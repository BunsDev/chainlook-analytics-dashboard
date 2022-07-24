import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <div className="header wrapper">
        <h1 className="logo">
          <Link to="/">
            ChainLook
          </Link>
        </h1>

        <div className="menu">
          <Link to="/widget/new">
            <div className="menu-item">
              New Widget
            </div>
          </Link>
          <Link to="/dashboard/new">
            <div className="menu-item">
              New Dashboard
            </div>
          </Link>
        </div>

      </div>

      <div className="main wrapper">
        <hr />
        <Outlet />
      </div>

      <div className="footer wrapper">
        <div className="mb-1">
          Copyright &copy;2022 ChainLook.
          Deployed on IPFS using <a target="_blank" rel="noreferrer" href="https://fleek.co/">Fleek</a>
        </div>
        <div>
          Disclaimer: ChainLook don&lsquo;t guarantee accuracy of the data. Project still in alpha stage and schema might change.
        </div>
      </div>
    </>
  );
}
