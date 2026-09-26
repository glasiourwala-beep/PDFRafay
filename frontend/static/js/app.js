/**
 * PDFRafay — High-Performance Client-Side Application Core
 * Version 2.1.0 — Supercharged SPA Engine with Auto-Scroll & Global FAQ Handling
 */
(function () {
  "use strict";

  // Utility Selectors
  const $ = (selector, context) => (context || document).querySelector(selector);
  const $$ = (selector, context) => Array.from((context || document).querySelectorAll(selector));

  // Application State
  let currentTool = null;
  let selectedFiles = [];
  let currentXhr = null;
  let activeFilter = "all";
  let searchQuery = "";
  let currentDownloadUrl = null;

  // File Size Helpers
  function formatSize(bytes) {
    if (bytes === 0 || !bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Auto-scroll to workspace card top (fixes mobile loader view)
  function scrollToWorkspaceTop() {
    const card = $(".workspace-card") || $("#view-workspace");
    if (card) {
      const headerOffset = 80;
      const elementPosition = card.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: "smooth"
      });
    }
  }

  // Friendly Error Resolver
  function getFriendlyError(errorMsg) {
    const msg = String(errorMsg || "").toLowerCase();
    if (msg.includes("password")) return "Incorrect password provided. Please verify and try again.";
    if (msg.includes("memory") || msg.includes("killed") || msg.includes("ran out")) {
      return "The file is too complex or large for free tier memory limits. Please try a smaller file.";
    }
    if (msg.includes("timed out") || msg.includes("timeout")) {
      return "The operation timed out. Please check your internet connection or try again.";
    }
    if (msg.includes("type") || msg.includes("format") || msg.includes("invalid")) {
      return "Unsupported file format. Please upload a valid document for this tool.";
    }
    if (msg.includes("network") || msg.includes("fetch")) {
      return "Network connection lost. Please check your internet and retry.";
    }
    return errorMsg || "An unexpected error occurred while processing your document. Please try again.";
  }

  // SVG Icons Generator
  function getIconSvg(name, size = 24) {
    const s = size;
    const icons = {
      doc: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      slides: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
      compress: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>`,
      merge: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8"/><path d="M4 18V4a2 2 0 0 1 2-2h10"/><polyline points="8 12 12 12 12 16"/></svg>`,
      split: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/><line x1="8.12" y1="8.12" x2="12" y2="12"/></svg>`,
      extract: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>`,
      delete: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
      image: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
      gallery: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`,
      rotate: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.5 2v6h-6"/><path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>`,
      organize: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
      watermark: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
      lock: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
      unlock: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
      pdf: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
      chevronDown: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
      check: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
      arrowUp: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>`,
      arrowDown: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>`,
      trash: `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`
    };
    return icons[name] || icons.pdf;
  }

  // Router Meta Updater
  function updateDocumentMeta(title, description, canonicalUrl) {
    document.title = title;
    
    let descMeta = $('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.name = "description";
      document.head.appendChild(descMeta);
    }
    descMeta.content = description;

    let ogTitle = $('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    let ogDesc = $('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;

    let canonical = $('link[rel="canonical"]');
    if (canonical && canonicalUrl) canonical.href = canonicalUrl;
  }

  // Top Progress Bar
  let progressInterval = null;
  function startRouteProgress() {
    const bar = $("#route-progress");
    if (!bar) return;
    if (progressInterval) clearInterval(progressInterval);
    bar.classList.remove("is-done");
    bar.classList.add("is-active");
    bar.style.width = "0%";
    let width = 15;
    bar.style.width = width + "%";
    progressInterval = setInterval(() => {
      if (width >= 85) return;
      width += Math.random() * 8 + 2;
      bar.style.width = width + "%";
    }, 150);
  }

  function endRouteProgress() {
    const bar = $("#route-progress");
    if (!bar) return;
    if (progressInterval) clearInterval(progressInterval);
    bar.style.width = "100%";
    setTimeout(() => {
      bar.classList.add("is-done");
      setTimeout(() => {
        bar.classList.remove("is-active");
        bar.style.width = "0%";
      }, 300);
    }, 200);
  }

  // Page Sub-routes
  const STATIC_PAGES = {
    "about": {
      title: "About PDFRafay — Free Online PDF Tools",
      desc: "Learn about PDFRafay: powerful online PDF conversion, compression, merging, splitting, and security tools built for speed and security."
    },
    "contact": {
      title: "Contact PDFRafay Support & Feedback",
      desc: "Get in touch with the PDFRafay developer team for questions, feedback, or custom requests."
    },
    "privacy-policy": {
      title: "Privacy Policy | PDFRafay",
      desc: "PDFRafay Privacy Policy: transparent file handling, automatic server purges, and security measures."
    },
    "cookie-policy": {
      title: "Cookie Policy | PDFRafay",
      desc: "Learn how PDFRafay handles essential cookies and user privacy settings."
    },
    "terms": {
      title: "Terms of Service | PDFRafay",
      desc: "PDFRafay Terms of Service for online document conversion tools."
    }
  };

  // Route Navigator
  function navigateTo(path, pushState = true) {
    startRouteProgress();
    if (pushState) {
      history.pushState({}, "", path);
    }
    renderRoute();
    endRouteProgress();
  }

  function getPathSegment() {
    const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    if (pathname === "/" || pathname === "/index.html") return "";
    return pathname.replace(/^\//, "").split("?")[0].split("#")[0];
  }

  function renderRoute() {
    const segment = getPathSegment();

    // Reset view states
    $("#view-home")?.classList.add("hidden");
    $("#view-workspace")?.classList.add("hidden");
    $("#view-page")?.classList.add("hidden");
    $$(".spa-page").forEach(p => p.classList.add("hidden"));

    // Tool Route
    const tool = PDFRafay.getTool(segment);
    if (tool) {
      currentTool = tool;
      renderWorkspace(tool);
      return;
    }

    // Static Page Route
    const cleanSeg = segment.replace(".html", "");
    if (STATIC_PAGES[cleanSeg]) {
      const pageInfo = STATIC_PAGES[cleanSeg];
      $("#view-page")?.classList.remove("hidden");
      $(`#page-${cleanSeg === 'privacy-policy' ? 'privacy' : (cleanSeg === 'cookie-policy' ? 'cookie' : cleanSeg)}`)?.classList.remove("hidden");
      updateDocumentMeta(pageInfo.title, pageInfo.desc, `${PDFRafay.SITE_ORIGIN}/${cleanSeg}`);
      window.scrollTo(0, 0);
      return;
    }

    // Default Home Route
    currentTool = null;
    $("#view-home")?.classList.remove("hidden");
    updateDocumentMeta(
      "Free PDF Tools Online — Convert, Compress & Merge | PDFRafay",
      "Free online PDF tools by PDFRafay. Convert Word to PDF, compress PDFs, merge, split, protect, rotate and watermark files fast—no install required.",
      `${PDFRafay.SITE_ORIGIN}/`
    );
    renderToolsGrid();
    window.scrollTo(0, 0);
  }

  // Home Page Tool Search & Grid Filter
  function renderToolsGrid() {
    const grid = $("#tools-grid");
    if (!grid) return;

    let filtered = PDFRafay.TOOLS;
    if (activeFilter !== "all") {
      filtered = filtered.filter(t => t.category === activeFilter);
    }

    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.short.toLowerCase().includes(query) ||
        t.desc.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div class="no-results">No PDF tools match "${escapeHtml(searchQuery)}". Try searching for "compress", "word", or "merge".</div>`;
      return;
    }

    grid.innerHTML = filtered.map(tool => `
      <article class="tool-card" tabindex="0" data-tool-id="${tool.id}" role="link" aria-label="${escapeHtml(tool.name)}">
        <div class="tool-card-icon">${getIconSvg(tool.icon, 28)}</div>
        <h3>${escapeHtml(tool.name)}</h3>
        <p>${escapeHtml(tool.short)}</p>
        <div class="tool-card-action">
          <span>Use Tool</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </article>
    `).join("");

    // Tool Card Clicks
    grid.querySelectorAll(".tool-card").forEach(card => {
      const toolId = card.getAttribute("data-tool-id");
      card.addEventListener("click", () => navigateTo(`/${toolId}`));
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigateTo(`/${toolId}`);
        }
      });
    });
  }

  // Workspace Renderer
  function renderWorkspace(tool) {
    $("#view-workspace")?.classList.remove("hidden");
    
    // SEO Meta update
    updateDocumentMeta(
      tool.seoTitle,
      tool.seoDesc,
      `${PDFRafay.SITE_ORIGIN}/${tool.id}`
    );

    // Header & Breadcrumb
    $("#breadcrumb-tool-name").textContent = tool.name;
    $("#tool-header-icon").innerHTML = getIconSvg(tool.icon, 36);
    $("#tool-header-title").textContent = tool.name;
    $("#tool-header-desc").textContent = tool.desc;

    // Reset Workspace State
    selectedFiles = [];
    resetStages();
    renderDropzoneHint(tool);
    renderOptionsPanel(tool);
    renderHowToSteps(tool);
    renderToolFaqs(tool);

    window.scrollTo(0, 0);
  }

  function renderDropzoneHint(tool) {
    const hint = $("#drop-hint");
    if (!hint) return;
    const fileTypes = tool.accept.split(",").join(", ");
    hint.textContent = `Supported formats: ${fileTypes} · Max limit: 100 MB`;
    $("#file-input").accept = tool.accept;
    $("#file-input").multiple = tool.multiple;
  }

  // Options Panel Builder
  function renderOptionsPanel(tool) {
    const panel = $("#options-panel");
    if (!panel) return;

    if (!tool.options || tool.options.length === 0) {
      panel.classList.add("hidden");
      panel.innerHTML = "";
      return;
    }

    panel.classList.remove("hidden");
    panel.innerHTML = tool.options.map(opt => {
      if (opt.type === "radio") {
        return `
          <div class="form-group">
            <label class="form-label">${escapeHtml(opt.label)}</label>
            <div class="radio-cards-grid">
              ${opt.choices.map(choice => `
                <label class="radio-card ${choice.value === opt.default ? 'selected' : ''}">
                  <input type="radio" name="${opt.name}" value="${choice.value}" ${choice.value === opt.default ? 'checked' : ''} />
                  <div class="radio-card-title">${escapeHtml(choice.label)}</div>
                  <div class="radio-card-hint">${escapeHtml(choice.hint || '')}</div>
                </label>
              `).join('')}
            </div>
          </div>
        `;
      }

      if (opt.type === "select") {
        return `
          <div class="form-group">
            <label class="form-label" for="opt-${opt.name}">${escapeHtml(opt.label)}</label>
            <select id="opt-${opt.name}" name="${opt.name}" class="form-control">
              ${opt.choices.map(c => {
                const val = typeof c === 'object' ? c.value : c;
                const lbl = typeof c === 'object' ? c.label : c;
                const isSelected = val === opt.default ? 'selected' : '';
                return `<option value="${escapeHtml(val)}" ${isSelected}>${escapeHtml(lbl)}</option>`;
              }).join('')}
            </select>
          </div>
        `;
      }

      if (opt.type === "text" || opt.type === "password" || opt.type === "number") {
        return `
          <div class="form-group">
            <label class="form-label" for="opt-${opt.name}">
              <span>${escapeHtml(opt.label)}</span>
              ${opt.hint ? `<span class="form-hint">${escapeHtml(opt.hint)}</span>` : ''}
            </label>
            <input 
              type="${opt.type}" 
              id="opt-${opt.name}" 
              name="${opt.name}" 
              class="form-control" 
              placeholder="${escapeHtml(opt.placeholder || '')}"
              value="${escapeHtml(opt.default || '')}"
              ${opt.min !== undefined ? `min="${opt.min}"` : ''}
              ${opt.max !== undefined ? `max="${opt.max}"` : ''}
              ${opt.step !== undefined ? `step="${opt.step}"` : ''}
              ${opt.required ? 'required' : ''}
            />
          </div>
        `;
      }

      return "";
    }).join("");

    // Radio Card Selector Behavior
    panel.querySelectorAll('.radio-card input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const grid = radio.closest('.radio-cards-grid');
        grid.querySelectorAll('.radio-card').forEach(c => c.classList.remove('selected'));
        radio.closest('.radio-card').classList.add('selected');
      });
    });
  }

  // How-To Steps Generator
  function renderHowToSteps(tool) {
    const container = $("#tool-howto-container");
    if (!container) return;

    if (!tool.howTo || tool.howTo.length === 0) {
      container.classList.add("hidden");
      return;
    }

    container.classList.remove("hidden");
    container.innerHTML = `
      <h2>How to ${escapeHtml(tool.name)} Online</h2>
      <div class="steps-list">
        ${tool.howTo.map((step, idx) => `
          <div class="step-card">
            <div class="step-number">${idx + 1}</div>
            <h4>Step ${idx + 1}</h4>
            <p>${escapeHtml(step)}</p>
          </div>
        `).join('')}
      </div>
    `;
  }

  // Tool FAQs Generator
  function renderToolFaqs(tool) {
    const container = $("#tool-faq-container");
    if (!container) return;

    if (!tool.faqs || tool.faqs.length === 0) {
      container.classList.add("hidden");
      return;
    }

    container.classList.remove("hidden");
    container.innerHTML = `
      <h2>Frequently Asked Questions about ${escapeHtml(tool.name)}</h2>
      <div class="faq-accordion">
        ${tool.faqs.map(faq => `
          <div class="faq-item">
            <button type="button" class="faq-question">
              <span>${escapeHtml(faq.q)}</span>
              ${getIconSvg('chevronDown', 20)}
            </button>
            <div class="faq-answer hidden">
              <p>${escapeHtml(faq.a)}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // File Selection & Drag & Drop Handling
  function addFiles(files) {
    if (!currentTool) return;

    const newFiles = Array.from(files);
    if (!currentTool.multiple) {
      selectedFiles = [newFiles[0]];
    } else {
      selectedFiles = selectedFiles.concat(newFiles);
    }

    renderFileList();
  }

  function renderFileList() {
    const container = $("#file-queue");
    const actions = $("#workspace-actions");
    if (!container || !actions) return;

    if (selectedFiles.length === 0) {
      container.innerHTML = "";
      actions.classList.add("hidden");
      return;
    }

    actions.classList.remove("hidden");
    container.innerHTML = selectedFiles.map((file, idx) => `
      <div class="file-item" data-index="${idx}">
        <div class="file-item-info">
          <div class="file-item-icon">${getIconSvg('pdf', 22)}</div>
          <div class="file-item-details">
            <span class="file-item-name">${escapeHtml(file.name)}</span>
            <span class="file-item-size">${formatSize(file.size)}</span>
          </div>
        </div>
        <div class="file-item-actions">
          ${currentTool && currentTool.multiple && selectedFiles.length > 1 ? `
            <button type="button" class="file-action-btn move-up" title="Move Up" ${idx === 0 ? 'disabled' : ''}>
              ${getIconSvg('arrowUp', 16)}
            </button>
            <button type="button" class="file-action-btn move-down" title="Move Down" ${idx === selectedFiles.length - 1 ? 'disabled' : ''}>
              ${getIconSvg('arrowDown', 16)}
            </button>
          ` : ''}
          <button type="button" class="file-action-btn danger remove-file" title="Remove File">
            ${getIconSvg('trash', 16)}
          </button>
        </div>
      </div>
    `).join("");

    // Queue Item Actions
    container.querySelectorAll('.remove-file').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.closest('.file-item').getAttribute('data-index'), 10);
        selectedFiles.splice(idx, 1);
        renderFileList();
      });
    });

    container.querySelectorAll('.move-up').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.closest('.file-item').getAttribute('data-index'), 10);
        if (idx > 0) {
          const temp = selectedFiles[idx];
          selectedFiles[idx] = selectedFiles[idx - 1];
          selectedFiles[idx - 1] = temp;
          renderFileList();
        }
      });
    });

    container.querySelectorAll('.move-down').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.closest('.file-item').getAttribute('data-index'), 10);
        if (idx < selectedFiles.length - 1) {
          const temp = selectedFiles[idx];
          selectedFiles[idx] = selectedFiles[idx + 1];
          selectedFiles[idx + 1] = temp;
          renderFileList();
        }
      });
    });
  }

  // Stages Reset
  function resetStages() {
    $("#stage-idle")?.classList.remove("hidden");
    $("#stage-upload")?.classList.add("hidden");
    $("#stage-processing")?.classList.add("hidden");
    $("#stage-success")?.classList.add("hidden");
    $("#stage-error")?.classList.add("hidden");

    if (currentDownloadUrl) {
      URL.revokeObjectURL(currentDownloadUrl);
      currentDownloadUrl = null;
    }
  }

  // Server Process Submission
  function processToolRequest() {
    if (!currentTool || selectedFiles.length === 0) return;

    // Build FormData
    const formData = new FormData();
    if (currentTool.multiple) {
      selectedFiles.forEach(f => formData.append("files", f));
    } else {
      formData.append("file", selectedFiles[0]);
    }

    // Collect options form parameters
    const optionsPanel = $("#options-panel");
    if (optionsPanel && !optionsPanel.classList.contains("hidden")) {
      const inputs = optionsPanel.querySelectorAll("input, select");
      for (const input of inputs) {
        if (input.type === "radio" && !input.checked) continue;
        if (input.required && !input.value.trim()) {
          alert(`Please fill in the required field: ${input.name}`);
          input.focus();
          return;
        }
        formData.append(input.name, input.value);
      }
    }

    // Switch to Upload Stage
    $("#stage-idle")?.classList.add("hidden");
    $("#stage-upload")?.classList.remove("hidden");

    // Scroll smoothly to top of workspace card so progress bar & spinner are front & center on mobile!
    scrollToWorkspaceTop();

    // XHR for upload tracking
    currentXhr = new XMLHttpRequest();
    const startTime = Date.now();

    currentXhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        const elapsed = (Date.now() - startTime) / 1000;
        const speedBps = elapsed > 0 ? e.loaded / elapsed : 0;
        const remainingBytes = e.total - e.loaded;
        const etaSeconds = speedBps > 0 ? Math.ceil(remainingBytes / speedBps) : 0;

        $("#upload-fill").style.width = pct + "%";
        $("#upload-pct").textContent = pct + "%";
        $("#upload-bytes").textContent = `${formatSize(e.loaded)} / ${formatSize(e.total)}`;
        $("#upload-speed").textContent = speedBps > 0 ? `${formatSize(speedBps)}/s` : "Calculating...";
        $("#upload-eta").textContent = etaSeconds > 0 ? `${etaSeconds}s remaining` : "Almost done";
      }
    };

    currentXhr.onload = function () {
      if (currentXhr.status >= 200 && currentXhr.status < 300) {
        // Upload finished -> Processing Stage
        $("#stage-upload")?.classList.add("hidden");
        $("#stage-processing")?.classList.remove("hidden");
        $("#process-msg").textContent = currentTool.processHint || "Processing your file...";
        scrollToWorkspaceTop();

        // Process response blob
        const blob = currentXhr.response;
        const contentDisp = currentXhr.getResponseHeader("Content-Disposition");
        let filename = `${currentTool.id}_output.pdf`;
        if (contentDisp && contentDisp.includes("filename=")) {
          const match = contentDisp.match(/filename="?([^"]+)"?/);
          if (match && match[1]) filename = match[1];
        }

        // Stats headers if available (Compress PDF)
        const origSize = currentXhr.getResponseHeader("X-Original-Size");
        const compSize = currentXhr.getResponseHeader("X-Compressed-Size");
        const reduction = currentXhr.getResponseHeader("X-Reduction-Percent");

        setTimeout(() => {
          showSuccess(blob, filename, { origSize, compSize, reduction });
        }, 600);

      } else {
        let errorMsg = "Server error occurred.";
        try {
          const res = JSON.parse(currentXhr.responseText);
          errorMsg = res.detail || res.message || errorMsg;
        } catch (_) {}
        showError(getFriendlyError(errorMsg));
      }
    };

    currentXhr.onerror = function () {
      showError(getFriendlyError("Network error during file processing."));
    };

    currentXhr.open("POST", `/api/${currentTool.id}`);
    currentXhr.responseType = "blob";
    currentXhr.send(formData);
  }

  function showSuccess(blob, filename, stats) {
    $("#stage-processing")?.classList.add("hidden");
    $("#stage-success")?.classList.remove("hidden");
    scrollToWorkspaceTop();

    currentDownloadUrl = URL.createObjectURL(blob);
    const downloadBtn = $("#download-btn");
    if (downloadBtn) {
      downloadBtn.href = currentDownloadUrl;
      downloadBtn.download = filename;
    }

    const summary = $("#success-summary");
    if (summary) {
      if (stats.origSize && stats.compSize) {
        const orig = formatSize(parseInt(stats.origSize, 10));
        const comp = formatSize(parseInt(stats.compSize, 10));
        const pct = stats.reduction || "0";
        summary.innerHTML = `
          <div class="success-stats-badge">
            ${getIconSvg('check', 20)}
            <span>Compressed from ${orig} to ${comp} (${pct}% smaller!)</span>
          </div>
        `;
      } else {
        summary.innerHTML = `
          <div class="success-stats-badge">
            ${getIconSvg('check', 20)}
            <span>Document processed successfully · Ready for download</span>
          </div>
        `;
      }
    }
  }

  function showError(msg) {
    $("#stage-upload")?.classList.add("hidden");
    $("#stage-processing")?.classList.add("hidden");
    $("#stage-error")?.classList.remove("hidden");
    scrollToWorkspaceTop();

    const errorEl = $("#error-msg");
    if (errorEl) errorEl.textContent = msg;
  }

  // Event Listeners Initialization
  function initEvents() {
    // Global delegation for navigation links & FAQ accordions
    document.addEventListener("click", (e) => {
      // 1. FAQ Accordion Toggle
      const faqBtn = e.target.closest(".faq-question");
      if (faqBtn) {
        e.preventDefault();
        const item = faqBtn.closest(".faq-item");
        if (item) {
          const answer = item.querySelector(".faq-answer");
          const isOpen = item.classList.contains("open");
          item.classList.toggle("open", !isOpen);
          if (answer) {
            answer.classList.toggle("hidden", isOpen);
          }
        }
        return;
      }

      // 2. Navigation Link Clicks
      const link = e.target.closest("a");
      if (link && link.href && link.origin === window.location.origin) {
        const path = link.getAttribute("href");
        if (path && (path.startsWith("/") || path.startsWith("#"))) {
          if (path.startsWith("#")) {
            const el = $(path);
            if (el) {
              e.preventDefault();
              el.scrollIntoView({ behavior: "smooth" });
            }
            return;
          }
          e.preventDefault();
          navigateTo(path);
        }
      }
    });

    // Popstate history back/forward
    window.addEventListener("popstate", () => renderRoute());

    // Search bar input
    $("#tool-search")?.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      const clearBtn = $("#search-clear");
      if (clearBtn) {
        clearBtn.classList.toggle("hidden", !searchQuery);
      }
      renderToolsGrid();
    });

    $("#search-clear")?.addEventListener("click", () => {
      searchQuery = "";
      const input = $("#tool-search");
      if (input) input.value = "";
      $("#search-clear")?.classList.add("hidden");
      renderToolsGrid();
    });

    // Category filter chips
    $$(".chip-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        $$(".chip-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        activeFilter = btn.getAttribute("data-filter") || "all";
        renderToolsGrid();
      });
    });

    // Drag and Drop Zone
    const dropzone = $("#dropzone");
    const fileInput = $("#file-input");

    if (dropzone && fileInput) {
      dropzone.addEventListener("click", () => fileInput.click());
      dropzone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          fileInput.click();
        }
      });

      ["dragenter", "dragover"].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add("dragover");
        });
      });

      ["dragleave", "drop"].forEach(evt => {
        dropzone.addEventListener(evt, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove("dragover");
        });
      });

      dropzone.addEventListener("drop", (e) => {
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          addFiles(e.dataTransfer.files);
        }
      });

      fileInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files.length > 0) {
          addFiles(e.target.files);
        }
      });
    }

    // Process & Clear Action Buttons
    $("#process-btn")?.addEventListener("click", processToolRequest);
    $("#clear-btn")?.addEventListener("click", () => {
      selectedFiles = [];
      renderFileList();
    });
    $("#retry-btn")?.addEventListener("click", () => {
      resetStages();
      scrollToWorkspaceTop();
    });
    $("#again-btn")?.addEventListener("click", () => {
      selectedFiles = [];
      resetStages();
      renderFileList();
      scrollToWorkspaceTop();
    });

    // Mobile Navigation Drawer Toggle
    const navToggle = $("#nav-toggle");
    const mainNav = $("#main-nav");
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.contains("open");
        mainNav.classList.toggle("open", !isOpen);
        navToggle.setAttribute("aria-expanded", (!isOpen).toString());
      });
    }
  }

  // Initialize Application on DOM Ready
  document.addEventListener("DOMContentLoaded", () => {
    initEvents();
    renderRoute();
  });

})();
