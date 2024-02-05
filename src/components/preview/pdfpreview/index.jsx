import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import styles from "./pdfpreview.module.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const Nav = ({
  pageNumber,
  numPages,
  onPreviousClick = () => {},
  onNextClick = () => {},
  ...props
}) => {
  return (
    <nav className={styles.navBar}>
      <div className={styles.navContainer}>
        <div>
          <div>
            <div
              onClick={pageNumber > 1 ? onPreviousClick : undefined}
              disabled={pageNumber <= 1}
            >
              <svg
                height="16"
                width="16"
                style={{ opacity: pageNumber <= 1 ? "0.3" : "1" }}
              >
                <use xlinkHref="sprite.svg#chevron_left_icon" />
              </svg>
            </div>
          </div>

          <div>
            <div className={styles.pageInfo}>
              <span>{pageNumber}</span>
              <span> of {numPages}</span>
            </div>
          </div>

          <div>
            <div
              onClick={pageNumber < numPages ? onNextClick : undefined}
              disabled={pageNumber >= numPages}
            >
              <svg
                height="16"
                width="16"
                style={{ opacity: pageNumber >= numPages ? "0.3" : "1" }}
              >
                <use xlinkHref="sprite.svg#chevron_right_icon" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const PDFPreview = ({
  pdfUrl,
  customStyles = "",
  scale = 0.6,
  onLoad = () => {},
}) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(0);

  function onDocumentLoadSuccess({ numPages: nextNumPages }) {
    setNumPages(nextNumPages);
    onLoad();
  }

  function onPageLoadSuccess() {
    setPageWidth(window.innerWidth);
    setLoading(false);
  }

  //   const options = {
  //     cMapUrl: "cmaps/",
  //     cMapPacked: true,
  //     standardFontDataUrl: "standard_fonts/",
  //   };

  function goToNextPage() {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  }

  function goToPreviousPage() {
    setPageNumber((prevPageNumber) => prevPageNumber - 1);
  }

  // useEffect(() => {
  //     const handleResize = () => {
  //         setPageWidth(window.innerWidth);
  //     };

  //     window.addEventListener('resize', handleResize);

  //     // Initial width
  //     handleResize();

  //     return () => {
  //         window.removeEventListener('resize', handleResize);
  //     };
  // }, []);

  return (
    <div className={styles.container}>
      <div className={styles.pdfContainer}>
        <Nav
          pageNumber={pageNumber}
          numPages={numPages}
          onPreviousClick={goToPreviousPage}
          onNextClick={goToNextPage}
        />
        <div className={styles.pdfDocumentContainer} hidden={loading}>
          <div className={customStyles}>
            <Document
              file={pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              renderMode="canvas"
              className=""
            >
              <Page
                className=""
                key={pageNumber}
                pageNumber={pageNumber}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                onLoadSuccess={onPageLoadSuccess}
                onRenderError={() => setLoading(false)}
                width={Math.max(pageWidth * scale, 390)}
              />
            </Document>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFPreview;
