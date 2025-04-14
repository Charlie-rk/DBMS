import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

// Create a component to print. Using forwardRef is useful if you need to pass the ref
// to a functional component that doesn’t automatically handle the ref.
const ComponentToPrint = React.forwardRef((props, ref) => (
  <div ref={ref} style={{ padding: "20px", border: "1px solid black" }}>
    <h1>Print Me!</h1>
    <p>This content will be printed.</p>
  </div>
));

function PrintTest() {
  // Create a ref for the component that will be printed.
  const contentRef = useRef(null);

  // Create the print function by calling the hook with our contentRef.
  const handlePrint = useReactToPrint({
    // Either pass the ref object directly or use a callback that returns the current ref.
    content: () => contentRef.current,
    // Optionally, you can pass additional options such as pageStyle, documentTitle, etc.
    pageStyle: "@page { size: auto; margin: 20mm; }",
  });

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <button
        onClick={handlePrint}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Print Content
      </button>
      {/* The component to print is attached to the ref */}
      <ComponentToPrint ref={contentRef} />
    </div>
  );
}

export default PrintTest;
