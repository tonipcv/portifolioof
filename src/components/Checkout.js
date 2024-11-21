import { useState, useEffect } from 'react';

function Checkout() {
  const [state, setState] = useState();
  
  useEffect(() => {
    // Put your conditional logic inside useEffect instead
    if (state) {
      // Do something
    }
  }, [state]);
  
  return (
    <div>
      {/* Add your checkout UI here */}
      <h1>Checkout</h1>
    </div>
  );
}

export default Checkout; 