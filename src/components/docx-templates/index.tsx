// import "./styles.css";
// import doc from "../../../public/GUIA-MODELO-EN-BLANCO.docx";
// import createReport from "docx-templates";
// import { useEffect } from "react";
// import * as docx from "docx-preview";

// console.log("window: ", docx);

// export default function App() {
//   useEffect(() => {
//     fetch(doc).then((res) => {
//       const template = res.arrayBuffer();
//       createReport({
//         template,
//         data: {
//           name: "John",
//           surname: "Appleseed"
//         }
//       }).then((buffer) => {
//         docx
//           .renderAsync(buffer, document.getElementById("container"))
//           .then((x) => console.log("docx: finished"));
//         console.log("buffer: ", buffer);
//       });
//     });
//   }, []);
//   return (
//     <div className="App">
//       <h1>Hello CodeSandbox</h1>
//       <h2>Start editing to see some magic happen!</h2>
//       {/* <iframe
//         src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
//           doc
//         )}`}
//         width="100%"
//         height="700px"
//         frameborder="0"
//       >
//         This is an embedded
//         <a target="_blank" href="http://office.com">
//           Microsoft Office
//         </a>{" "}
//         document, powered by{" "}
//         <a target="_blank" href="http://office.com/webapps">
//           Office Online
//         </a>
//         .
//       </iframe> */}
//       <div id="container" style={{ height: "600px", overflowY: "auto" }} />
//     </div>
//   );
// }
