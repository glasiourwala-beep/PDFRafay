/**
 * PDFRafay — Official PDF Tools Registry & SEO Metadata
 * Version 2.0.0 — Supercharged Edition
 */
window.PDFRafay = window.PDFRafay || {};

PDFRafay.MAX_FILE_SIZE_MB = 100;
PDFRafay.MAX_FILE_SIZE = 100 * 1024 * 1024;
PDFRafay.SITE_ORIGIN = "https://pdfrafay.onrender.com";

PDFRafay.TOOLS = [
  {
    id: "word-to-pdf",
    name: "Word to PDF",
    short: "Convert DOC and DOCX to PDF",
    desc: "Convert Microsoft Word documents (.doc, .docx) into pristine PDF files with exact formatting preservation.",
    icon: "doc",
    accept: ".doc,.docx",
    multiple: false,
    category: "convert",
    seoTitle: "Word to PDF Converter Online — Free & Fast | PDFRafay",
    seoDesc: "Convert Word DOC or DOCX documents to PDF online for free with PDFRafay. Fast, accurate conversion preserving fonts, layouts, and formatting.",
    processHint: "Converting Word document to PDF…",
    howTo: [
      "Click 'Choose File' or drag and drop your Word (.doc or .docx) file into the upload zone.",
      "Click 'Convert to PDF' to start processing.",
      "Download your newly created, high-quality PDF document instantly."
    ],
    faqs: [
      {
        q: "Will my Word formatting and layout be preserved?",
        a: "Yes! PDFRafay uses server-side layout rendering to keep your fonts, images, tables, and spacing identical to the original Word file."
      },
      {
        q: "Can I convert DOC and DOCX files?",
        a: "Yes, both legacy .doc (Word 97-2003) and modern .docx formats are fully supported up to 100 MB."
      },
      {
        q: "Is it safe to upload confidential Word documents?",
        a: "All file transfers are encrypted with SSL/TLS. Uploaded files are automatically purged from our servers after processing."
      }
    ]
  },
  {
    id: "pptx-to-pdf",
    name: "PowerPoint to PDF",
    short: "Convert PPT and PPTX to PDF",
    desc: "Turn PowerPoint presentation slides (.ppt, .pptx) into portable PDF documents ready for printing or viewing.",
    icon: "slides",
    accept: ".ppt,.pptx",
    multiple: false,
    category: "convert",
    seoTitle: "PowerPoint to PDF Converter Online — Free Slides to PDF | PDFRafay",
    seoDesc: "Convert PPT and PPTX presentations to PDF online. Preserve slide designs, graphics, and layout for seamless sharing.",
    processHint: "Converting presentation slides to PDF…",
    howTo: [
      "Upload your PowerPoint presentation file (.ppt or .pptx).",
      "Click 'Convert to PDF' to process your presentation.",
      "Download your PDF slides ready for presenting, printing, or sharing."
    ],
    faqs: [
      {
        q: "Does PowerPoint to PDF preserve slide animations?",
        a: "PDF files are static documents, so slide transition animations are converted into static visual slides matching the final state."
      },
      {
        q: "What file size is allowed for PowerPoint uploads?",
        a: "You can upload PowerPoint files up to 100 MB for fast online conversion."
      }
    ]
  },
  {
    id: "compress-pdf",
    name: "Compress PDF",
    short: "Reduce PDF file size online",
    desc: "Shrink large PDF documents while preserving crystal-clear text and image quality. Choose Low, Medium, or High compression.",
    icon: "compress",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Compress PDF Online — Reduce PDF File Size Free | PDFRafay",
    seoDesc: "Compress PDF files online with PDFRafay. Reduce PDF size by up to 80% while keeping document quality high. Free and instant.",
    processHint: "Compressing PDF document stream…",
    howTo: [
      "Select your PDF file and upload it to the workspace.",
      "Choose your preferred compression level: Low (best quality), Medium (recommended), or High (smallest size).",
      "Click 'Compress PDF' and download your optimized, smaller file."
    ],
    options: [
      {
        name: "level",
        type: "radio",
        label: "Compression Level",
        choices: [
          { value: "low", label: "Low Compression", hint: "Light compression · Best quality · ~10–25% smaller size" },
          { value: "medium", label: "Recommended (Medium)", hint: "Optimal balance · Great quality · ~25–50% smaller size" },
          { value: "high", label: "High Compression", hint: "Strongest compression (best for image-heavy PDFs; already-small files may barely shrink)" }
        ],
        default: "medium"
      }
    ],
    faqs: [
      {
        q: "Does PDF compression reduce text quality?",
        a: "No, PDF text streams are compressed losslessly. Images inside the PDF are intelligently optimized based on your chosen compression preset."
      },
      {
        q: "How much file size reduction can I expect?",
        a: "Depending on the content (scanned images vs text), compression typically reduces file size between 20% and 80%."
      }
    ]
  },
  {
    id: "merge-pdf",
    name: "Merge PDF",
    short: "Combine multiple PDFs into one",
    desc: "Combine two or more PDF files into a single structured document. Reorder files before merging with ease.",
    icon: "merge",
    accept: ".pdf",
    multiple: true,
    category: "organize",
    seoTitle: "Merge PDF Online — Combine PDF Files into One Free | PDFRafay",
    seoDesc: "Merge PDF files online in seconds. Combine multiple PDFs into a single document in your preferred page order with PDFRafay.",
    processHint: "Merging PDF files into a single document…",
    howTo: [
      "Select and upload two or more PDF documents.",
      "Drag and reorder your PDF list into the exact sequence you want.",
      "Click 'Merge PDFs' and download your unified PDF document."
    ],
    faqs: [
      {
        q: "Can I reorder PDF files before merging?",
        a: "Yes! Our interactive drag-and-drop workspace lets you move PDF files up or down to set your exact document sequence."
      },
      {
        q: "Is there a limit on how many PDFs I can merge?",
        a: "You can merge multiple PDFs at once as long as the total upload size stays within 100 MB."
      }
    ]
  },
  {
    id: "split-pdf",
    name: "Split PDF",
    short: "Split every page into separate files",
    desc: "Separate every single page of your PDF into standalone PDF files, delivered conveniently in a ZIP archive.",
    icon: "split",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Split PDF Online — Separate PDF Pages into Individual Files | PDFRafay",
    seoDesc: "Split PDF pages into separate documents online. Download all extracted single-page PDFs in a neat ZIP file with PDFRafay.",
    processHint: "Splitting PDF pages into standalone files…",
    howTo: [
      "Upload the multi-page PDF file you wish to split.",
      "Click 'Split PDF' to separate each page automatically.",
      "Download a ZIP file containing every individual PDF page."
    ],
    faqs: [
      {
        q: "What format will I get after splitting?",
        a: "You will download a compressed ZIP folder containing numbered single-page PDF files (e.g. page_1.pdf, page_2.pdf)."
      }
    ]
  },
  {
    id: "extract-pages",
    name: "Extract Pages",
    short: "Extract specific PDF pages",
    desc: "Extract only the pages you need from a PDF document (e.g. 1-3, 5, 8-10) and save them as a new PDF.",
    icon: "extract",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Extract PDF Pages Online — Custom Page Extraction | PDFRafay",
    seoDesc: "Extract specific pages from a PDF online with PDFRafay. Specify ranges or individual page numbers to generate a custom PDF.",
    processHint: "Extracting selected pages from PDF…",
    howTo: [
      "Upload your PDF document.",
      "Enter the page numbers or page ranges you want to keep (e.g. 1-3, 5, 8-10).",
      "Click 'Extract Pages' to create your customized PDF document."
    ],
    options: [
      {
        name: "pages",
        type: "text",
        label: "Pages to Extract",
        placeholder: "e.g. 1-3, 5, 8-10",
        required: true,
        hint: "Specify individual page numbers or ranges separated by commas."
      }
    ],
    faqs: [
      {
        q: "How do I specify page ranges?",
        a: "Use hyphens for ranges (e.g., 1-5) and commas for separate pages (e.g., 1-5, 8, 12)."
      }
    ]
  },
  {
    id: "delete-pages",
    name: "Delete Pages",
    short: "Remove unwanted pages from PDF",
    desc: "Remove blank, unnecessary, or confidential pages from your PDF file and download a clean document.",
    icon: "delete",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Delete PDF Pages Online — Remove Pages Free | PDFRafay",
    seoDesc: "Delete unwanted pages from PDF files online. Enter page numbers to remove and download your updated PDF with PDFRafay.",
    processHint: "Removing selected pages from PDF…",
    howTo: [
      "Upload your PDF document.",
      "Type the page numbers you wish to delete (e.g. 2, 4-6).",
      "Click 'Delete Pages' to generate a clean PDF with those pages removed."
    ],
    options: [
      {
        name: "pages",
        type: "text",
        label: "Pages to Delete",
        placeholder: "e.g. 2, 5, 7-9",
        required: true,
        hint: "Type the numbers of pages you want to remove permanently."
      }
    ],
    faqs: [
      {
        q: "What happens to the remaining pages?",
        a: "All other pages remain untouched and are automatically reindexed sequentially in the downloaded PDF."
      }
    ]
  },
  {
    id: "images-to-pdf",
    name: "Images to PDF",
    short: "Convert JPG, PNG & WebP to PDF",
    desc: "Combine multiple images (JPG, PNG, WebP, BMP) into a clean, beautifully aligned multi-page PDF document.",
    icon: "image",
    accept: ".jpg,.jpeg,.png,.webp,.bmp",
    multiple: true,
    category: "convert",
    seoTitle: "Images to PDF Converter Online — JPG/PNG to PDF | PDFRafay",
    seoDesc: "Convert JPG, PNG, and WebP images into a single PDF online. Customize page size (A4/Letter) and orientation (Portrait/Landscape).",
    processHint: "Converting image files into PDF…",
    howTo: [
      "Select and upload one or multiple image files.",
      "Reorder the images as desired using the up/down controls.",
      "Select your page size (A4 or Letter) and orientation (Portrait or Landscape).",
      "Click 'Convert to PDF' and download your document."
    ],
    options: [
      {
        name: "page_size",
        type: "select",
        label: "Page Size",
        choices: [
          { value: "A4", label: "A4 (Standard ISO)" },
          { value: "Letter", label: "US Letter" }
        ],
        default: "A4"
      },
      {
        name: "orientation",
        type: "select",
        label: "Orientation",
        choices: [
          { value: "portrait", label: "Portrait (Vertical)" },
          { value: "landscape", label: "Landscape (Horizontal)" }
        ],
        default: "portrait"
      }
    ],
    faqs: [
      {
        q: "What image formats can I upload?",
        a: "You can convert JPG, JPEG, PNG, WebP, and BMP images into a unified PDF document."
      }
    ]
  },
  {
    id: "pdf-to-images",
    name: "PDF to Images",
    short: "Export PDF pages as JPG or PNG",
    desc: "Convert every page or selected pages of your PDF document into high-resolution JPG or PNG image files.",
    icon: "gallery",
    accept: ".pdf",
    multiple: false,
    category: "convert",
    seoTitle: "PDF to JPG / PNG Converter Online — High Quality Images | PDFRafay",
    seoDesc: "Export PDF pages to high-resolution JPG or PNG images online. Adjust DPI up to 300 for crisp graphic quality.",
    processHint: "Exporting PDF pages as high-resolution images…",
    howTo: [
      "Upload your PDF document.",
      "Select your output image format (JPG or PNG) and resolution (100 to 300 DPI).",
      "Optionally specify a page range or leave empty for all pages.",
      "Click 'Export Images' to download a ZIP file containing image exports."
    ],
    options: [
      {
        name: "format",
        type: "select",
        label: "Image Format",
        choices: [
          { value: "jpg", label: "JPG (Smaller file size)" },
          { value: "png", label: "PNG (Lossless clarity)" }
        ],
        default: "jpg"
      },
      {
        name: "dpi",
        type: "select",
        label: "Resolution (DPI)",
        choices: [
          { value: "100", label: "100 DPI (Web draft)" },
          { value: "150", label: "150 DPI (Standard quality)" },
          { value: "200", label: "200 DPI (High resolution)" },
          { value: "300", label: "300 DPI (Ultra crisp / Print ready)" }
        ],
        default: "150"
      },
      {
        name: "pages",
        type: "text",
        label: "Specific Pages (Optional)",
        placeholder: "e.g. 1-5 or leave blank for all pages"
      }
    ],
    faqs: [
      {
        q: "Which DPI setting should I choose?",
        a: "150 DPI is ideal for general viewing. Choose 300 DPI for high-end printing and maximum graphic detail."
      }
    ]
  },
  {
    id: "rotate-pdf",
    name: "Rotate PDF",
    short: "Rotate PDF pages 90°, 180° or 270°",
    desc: "Fix upside-down or sideways pages by rotating all pages or selected pages clockwise or counter-clockwise.",
    icon: "rotate",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Rotate PDF Pages Online — Fix PDF Orientation | PDFRafay",
    seoDesc: "Rotate PDF pages online by 90, 180, or 270 degrees. Change page orientation for all or specific pages free with PDFRafay.",
    processHint: "Applying rotation to PDF pages…",
    howTo: [
      "Upload your PDF document.",
      "Select rotation angle (90°, 180°, or 270° clockwise).",
      "Optionally specify target pages, or leave blank to rotate every page.",
      "Click 'Rotate PDF' to download the updated file."
    ],
    options: [
      {
        name: "angle",
        type: "select",
        label: "Rotation Angle",
        choices: [
          { value: "90", label: "90° Clockwise" },
          { value: "180", label: "180° Flip (Upside Down)" },
          { value: "270", label: "270° Clockwise (90° Counter-Clockwise)" }
        ],
        default: "90"
      },
      {
        name: "pages",
        type: "text",
        label: "Target Pages (Optional)",
        placeholder: "e.g. 1, 3-5 or leave blank for all pages"
      }
    ],
    faqs: [
      {
        q: "Can I rotate only specific pages?",
        a: "Yes! Enter page numbers like 2, 4-6 in the target pages field to rotate only those pages while keeping others unchanged."
      }
    ]
  },
  {
    id: "organize-pdf",
    name: "Organize PDF",
    short: "Reorder pages in a PDF document",
    desc: "Rearrange PDF page sequence by entering a custom page order (e.g. 3, 1, 2, 4).",
    icon: "organize",
    accept: ".pdf",
    multiple: false,
    category: "organize",
    seoTitle: "Organize PDF Pages Online — Reorder PDF Pages | PDFRafay",
    seoDesc: "Reorder pages inside a PDF file online. Customize page sequence easily and download the rearranged PDF with PDFRafay.",
    processHint: "Reordering PDF pages into new sequence…",
    howTo: [
      "Upload your PDF file.",
      "Enter your desired page sequence as comma-separated numbers (e.g., 3, 1, 2, 4).",
      "Click 'Organize PDF' to process and download your reordered document."
    ],
    options: [
      {
        name: "page_order",
        type: "text",
        label: "New Page Order (1-based)",
        placeholder: "e.g. 3, 1, 2, 4",
        required: true,
        hint: "Enter page numbers in the new order you want them to appear."
      }
    ],
    faqs: [
      {
        q: "What happens if I miss a page number in the order?",
        a: "Only the page numbers listed in your order will be included in the final output file."
      }
    ]
  },
  {
    id: "watermark-pdf",
    name: "Watermark PDF",
    short: "Stamp text watermark on PDF pages",
    desc: "Add a custom text watermark (e.g. CONFIDENTIAL, DRAFT) with full control over opacity, rotation, and font size.",
    icon: "watermark",
    accept: ".pdf",
    multiple: false,
    category: "secure",
    seoTitle: "Add Watermark to PDF Online — Text Watermark Tool | PDFRafay",
    seoDesc: "Add custom text watermarks to PDF files online. Adjust opacity, font size, and rotation angle for copyright protection.",
    processHint: "Stamping watermark on PDF pages…",
    howTo: [
      "Upload your PDF document.",
      "Type your watermark text (e.g. CONFIDENTIAL or DO NOT COPY).",
      "Customize text opacity, font size, and rotation angle.",
      "Click 'Apply Watermark' and download your protected PDF."
    ],
    options: [
      {
        name: "text",
        type: "text",
        label: "Watermark Text",
        placeholder: "e.g. CONFIDENTIAL",
        default: "CONFIDENTIAL",
        required: true
      },
      {
        name: "opacity",
        type: "number",
        label: "Opacity (0.1 - 1.0)",
        default: "0.35",
        min: 0.1,
        max: 1.0,
        step: 0.05
      },
      {
        name: "rotation",
        type: "number",
        label: "Rotation Angle (°)",
        default: "45"
      },
      {
        name: "font_size",
        type: "number",
        label: "Font Size (pt)",
        default: "48"
      }
    ],
    faqs: [
      {
        q: "Where does the watermark appear on pages?",
        a: "The watermark is stamped semi-transparently across the center of every page in your PDF document."
      }
    ]
  },
  {
    id: "protect-pdf",
    name: "Protect PDF",
    short: "Password encrypt your PDF file",
    desc: "Secure sensitive PDF documents with strong password encryption to block unauthorized viewing.",
    icon: "lock",
    accept: ".pdf",
    multiple: false,
    category: "secure",
    seoTitle: "Password Protect PDF Online — Encrypt PDF Free | PDFRafay",
    seoDesc: "Password protect PDF files online with PDFRafay. Encrypt documents with passwords to prevent unauthorized access.",
    processHint: "Encrypting PDF document with password…",
    howTo: [
      "Upload your PDF document.",
      "Enter a strong password to protect the file.",
      "Click 'Encrypt PDF' to secure your document and download."
    ],
    options: [
      {
        name: "password",
        type: "password",
        label: "Password",
        placeholder: "Enter password",
        required: true
      }
    ],
    faqs: [
      {
        q: "What encryption strength is used?",
        a: "PDFRafay applies standard PDF security encryption requiring the exact password to open and view contents."
      }
    ]
  },
  {
    id: "unlock-pdf",
    name: "Unlock PDF",
    short: "Remove password from protected PDF",
    desc: "Remove password restriction from a PDF file when you possess the authorization password.",
    icon: "unlock",
    accept: ".pdf",
    multiple: false,
    category: "secure",
    seoTitle: "Unlock PDF Online — Remove PDF Password Free | PDFRafay",
    seoDesc: "Remove password restrictions from PDF files online. Unlock password-protected PDFs easily when you know the password.",
    processHint: "Decrypting PDF document…",
    howTo: [
      "Upload the password-protected PDF file.",
      "Type the correct password used to unlock the file.",
      "Click 'Unlock PDF' to generate an unencrypted, open PDF file."
    ],
    options: [
      {
        name: "password",
        type: "password",
        label: "Current Password",
        placeholder: "Enter existing password",
        required: true
      }
    ],
    faqs: [
      {
        q: "Can I unlock a PDF without knowing the password?",
        a: "No. For security and legal compliance, you must provide the valid password to decrypt the PDF."
      }
    ]
  }
];

PDFRafay.CATEGORIES = [
  { id: "all", label: "All Tools", icon: "grid" },
  { id: "convert", label: "Convert", icon: "convert" },
  { id: "organize", label: "Organize", icon: "organize" },
  { id: "secure", label: "Secure", icon: "secure" }
];

PDFRafay.getTool = function (id) {
  if (!id) return null;
  var cleanId = String(id).toLowerCase().replace(/^\//, "").replace(/\.html$/, "");
  return PDFRafay.TOOLS.find(function (t) { return t.id === cleanId; }) || null;
};

// Global fallback alias
window.FILEORA = window.PDFRafay;
