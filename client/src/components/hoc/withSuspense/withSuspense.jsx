import React, {Suspense} from 'react';
import Loader from "../../UI/Loader/Loader";

export function withSuspense(Component) {
  return (props) => {
    return (
      <Suspense fallback={<Loader />}>
        <Component {...props} />
      </Suspense>
    )
  }
}

