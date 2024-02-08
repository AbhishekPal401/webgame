import React, { useState, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import styles from './richtexteditor.module.css';
const RichTextEditor = ({
  customContaierClass = {},
  customEditorStyles,
  onChange = () => {},
  ...props
}) => {
  // const [editorHtml, setEditorHtml] = useState('');

  // const modules = {
  //   toolbar: [
  //     [{ 'header': '1'}, {'header': '2'}, {'font': []}],
  //     [{size: []}],
  //     ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  //     [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
  //     ['clean'],
  //     [{'align': []}],
  //     [{'color': []}],
  //   ],
  // };

  // const formats = [
  //   'header', 'font', 'size',
  //   'bold', 'italic', 'underline', 'strike', 'blockquote',
  //   'list', 'bullet', 'indent',
  //   'align',
  //   'color',
  // ];


  // const modules = useMemo(
  //   () => ({
  //     toolbar: {
  //       container: [
  //         [{ header: [1, 2, 3, 4, 5, 6, false] }],
  //         [{ color: [] }],
  //         ["bold", "italic", "strike", "underline", "blockquote"],
  //         // [{ align: [] }],
  //         ["align", { align: "center" }, { align: "right" }, { align: "justify" }],
  //         // [{ align: ["right", "center", "justify"] }],
  //         [
  //           { list: "ordered" },
  //           { list: "bullet" },
  //           { indent: "-1" },
  //           { indent: "+1" },
  //         ],
  //         ["link", "image"],
  //         ["clean"],
  //       ],
  //       handlers: {
  //         image: imageHandler,
  //       },
  //     },
  //     clipboard: {
  //       matchVisual: true,
  //     },
  //   }),
  //   [imageHandler]
  // );

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ color: [] },"bold", "italic", "strike", "underline"],
        // [{ align: [] }],
        ["align", { align: "center" }, { align: "right" }, { align: "justify" }],
        // [{ align: ["right", "center", "justify"] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        // ["link"],
        // ["clean"],
      ],
    },
    clipboard: {
      matchVisual: true,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "align",
    "list",
    "bullet",
    "indent",
    // "blockquote",
    // "link",
    // "clean",
  ];


  // const handleChange = (html) => {
  //   setEditorHtml(html);
  // };

  return (
    <div className={`${styles.container} ${customContaierClass}`}>
      <ReactQuill
        theme="snow"
        className={`${styles.editor} ${customEditorStyles}`}
        // value={editorHtml}
        modules={modules}
        formats={formats}
        // onChange={(editorHtml) => handleChange(editorHtml)}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default RichTextEditor;
