// src/lib/templates/document-wrapper.ts
import { sharedStyles } from './shared-css';

export interface DocumentOptions {
  title: string;
  content: string;
}

export function wrapDocument(options: DocumentOptions): string {
  const logoSrc = "https://i.ibb.co.com/YTJnQYMM/Logo-removebg-preview.png";
  const pinSrc = "https://i.ibb.co.com/7tBG6k8w/Location-Pin.png";
  const addressHtml = "Eureka Kanon Villa, House-84, Level-3, Road-10/1, Block-D,<br/>Niketon, Gulshan-1, Dhaka-1212, Bangladesh.";

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${options.title}</title>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;600;700;800&family=Oswald:wght@400;500;600;700&family=Poppins:wght@400;700&display=swap" rel="stylesheet">
      <style>
        ${sharedStyles}
      </style>
    </head>
    <body>
      <div class="page">
        <div class="pg-header">
          <img class="pg-logo" src="${logoSrc}" alt="Company Logo" />
          <hr class="pg-rule-thick" />
        </div>
        
        <div class="pg-body">
          <div class="doc-title">${options.title}</div>
          ${options.content}
        </div>
        
        <div class="pg-foot-wrap">
          <hr class="pg-rule-thin" />
          <div class="pg-footer">
            <img class="pg-pin" src="${pinSrc}" alt="Location" />
            <span class="pg-foot-label">OFFICE ADDRESS:</span>
            <span class="pg-foot-addr">${addressHtml}</span>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
}