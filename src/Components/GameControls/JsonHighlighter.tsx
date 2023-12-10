// import React, { useState } from 'react';
// import AceEditor from 'react-ace';
// import 'ace-builds/src-noconflict/mode-json';
// import 'ace-builds/src-noconflict/theme-github';
// import ReactJson from 'react-json-view';

// const JsonHighlighter = () => {
//   const [json, setJson] = useState('{}');

//   const onChange = (newJson) => {
//     setJson(newJson);
//   };

//   return (
//     <div>
//       <AceEditor
//         mode='json'
//         theme='github'
//         onChange={onChange}
//         name='jsonEditor'
//         editorProps={{ $blockScrolling: true }}
//         value={json}
//         setOptions={{
//           useWorker: false, // Disables syntax checking
//         }}
//       />
//       <div style={{ marginTop: '20px' }}>
//         <ReactJson src={JSON.parse(json)} theme='rjv-default' collapsed={false} />
//       </div>
//     </div>
//   );
// };

// export default JsonHighlighter;
