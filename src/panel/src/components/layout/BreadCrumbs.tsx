import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

interface BreadCrumb {
  url: string;
  label: string;
}

function BreadCrumbs() {
  const routeParams = useParams();

  function getBreadCrumbs() {
    const url = new URL(window.location.href);

    const breadCrumbs = [] as BreadCrumb[];

    const paths = url.pathname.split('/');

    for (const paramName in routeParams) {
      const paramValue = routeParams[paramName as keyof {}] as string;
    }

    paths.forEach((path, index) => {
      if (path === '') {
        return;
      }

      const urlPathName = paths.slice(0, index + 1).join('/');

      breadCrumbs.push({
        label: path,
        url: `${urlPathName}`,
      });
    });

    return breadCrumbs;
  }

  const breadcrumbs = useBreadcrumbs();

  return (
    <div>
      <Breadcrumb>
        {breadcrumbs.map((item, index) => {
          const { match, breadcrumb, key } = item;
          const active = index === breadcrumbs.length - 1;

          if (active) {
            return (
              <BreadcrumbItem key={key} active={true}>
                {breadcrumb}
              </BreadcrumbItem>
            );
          }

          return (
            <BreadcrumbItem key={key}>
              <Link to={match.url}>{breadcrumb}</Link>
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </div>
  );
}

export default BreadCrumbs;
