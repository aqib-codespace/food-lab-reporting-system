import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { ReportData } from "@/types/report";

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("ar-EG", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export const generateReportPDF = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF("p", "mm", "a4");

  const container = document.createElement("div");
  container.style.width = "210mm";
  container.style.padding = "15mm";
  container.style.backgroundColor = "#fff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.position = "absolute";
  container.style.left = "-99999px";

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; margin:0; padding:0; }
    </style>
    
    <!-- Header -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:9px">
      <tr>
        <td style="width:30%; text-align:right; padding:4px">
          <div style="font-weight:bold">المرجع رقم: ${
            data.refNumber || "789962"
          }</div>
        </td>
        <td style="width:40%; text-align:center; padding:4px">
          <div style="font-weight:bold; font-size:11px">رقم التقرير في النظام</div>
          <div style="font-size:8px">In System</div>
        </td>
        <td style="width:30%; text-align:left; padding:4px">
          <div style="font-weight:bold">التاريخ: ${formatDate(data.date)}</div>
        </td>
      </tr>
    </table>
    
    <hr style="border:none; border-top:1px solid #000; margin:8px 0" />
    
    <!-- Introduction Section -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:المقدمة</div>
      <div style="font-size:9px; text-align:right; line-height:1.6">
        <div>تاريخ الإنتاج: ${formatDate(data.producedDate) || "غير محدد"}</div>
        <div>تاريخ انتهاء الصلاحية: ${
          formatDate(data.expiredDate) || "غير محدد"
        }</div>
        <div style="margin-top:4px">تم استلام كل شيء وكان في حالة جيدة.</div>
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- External Appearance -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:المظهر الخارجي</div>
      <div style="font-size:9px; text-align:right">
        تم استلام ${
          data.externalContainers && data.externalContainers.length > 0
            ? data.externalContainers
                .filter((c: any) => c.type && c.quantity)
                .map((c: any) => `(${c.quantity}) ${c.type}`)
                .join(" + ")
            : "حاويات"
        }
        ${data.senderShop ? ` في ${data.senderShop}` : ""}
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- Storage -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:التخزين</div>
      <div style="font-size:9px; text-align:right">
        تم وضع العينات في ${data.samples?.[0]?.storageLocation || "التخزين"}
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- Contents -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:ما كان بالداخل</div>
      <div style="font-size:9px; text-align:right">
        تم فتح العينات وتحتوي على أطعمة ومشروبات.
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #000; margin:8px 0" />
    
    <!-- Samples Table -->
    <div style="font-weight:bold; font-size:10px; margin:10px 0 6px 0; text-align:right">:جدول العينات</div>
    <table style="width:100%; border-collapse:collapse; font-size:8px">
      <thead>
        <tr style="background:#333; color:#fff">
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">الحاوية الخارجية</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">رقم العينة</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">شكل العينة</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">الوزن</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">المستخدم</th>
        </tr>
      </thead>
      <tbody>
        ${
          data.samples && data.samples.length > 0
            ? data.samples
                .map(
                  (sample: any, idx: number) => `
          <tr style="background:${idx % 2 === 0 ? "#fff" : "#f5f5f5"}">
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${
                sample.internalContainers &&
                sample.internalContainers.length > 0
                  ? sample.internalContainers
                      .map((c: any) => `(${c.quantity}) ${c.type}`)
                      .join(" ")
                  : "(1) حاوية"
              }
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">${
              sample.sampleNumber || "S1"
            }</td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${sample.sampleName || "طعام"}
              ${
                sample.systemCaseNumber
                  ? `<div style="font-size:7px; color:#666">${sample.systemCaseNumber}</div>`
                  : ""
              }
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${sample.netWeight || 0} ${
                    sample.weightUnit === "kg" ? "كجم" : "جرام"
                  }
              <div style="font-size:7px; color:#666">(${
                sample.pureOrTotal === "pure"
                  ? "الوزن الصافي"
                  : "الوزن الإجمالي"
              })</div>
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">${
              sample.weightUsed || 0
            } جرام</td>
          </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc; padding:8px; text-align:center">لا توجد عينات</td></tr>'
        }
      </tbody>
    </table>
    
    <!-- Signature -->
    <div style="margin-top:20px; border:1px solid #000; padding:12px">
      <div style="text-align:right; font-size:10px; font-weight:bold; margin-bottom:8px">:التوقيع</div>
      ${
        data.employee?.signature
          ? `
        <div style="text-align:right">
          <img src="${
            data.employee.signature
          }" style="height:50px; border:1px solid #ccc; padding:3px; background:#fff" />
          <div style="margin-top:8px; font-size:8px; line-height:1.6">
            <div>الاسم: ${data.employee.name || ""}</div>
            <div>المنصب: ${data.employee.roles?.name || "Expert"}</div>
            <div>التاريخ: ${formatDate(data.date)}</div>
          </div>
        </div>
      `
          : `<div style="border-bottom:1px solid #000; width:150px; height:40px"></div>`
      }
    </div>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Check if content fits on one page (297mm height)
  if (imgHeight <= 297) {
    // Single page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    // Split across two pages
    const pageHeight = 297;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -pageHeight, imgWidth, imgHeight);
  }

  const fileName = `تقرير_${data.refNumber || "report"}_${formatDate(
    data.date
  ).replace(/\//g, "-")}.pdf`;
  pdf.save(fileName);
};

/**
 * Generate PDF as Blob for upload
 */
export const generateReportPDFBlob = async (
  data: ReportData
): Promise<Blob> => {
  const pdf = new jsPDF("p", "mm", "a4");

  const container = document.createElement("div");
  container.style.width = "210mm";
  container.style.padding = "15mm";
  container.style.backgroundColor = "#fff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.position = "absolute";
  container.style.left = "-99999px";

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; margin:0; padding:0; }
    </style>
    
    <!-- Header -->
    <table style="width:100%; border-collapse:collapse; margin-bottom:8px; font-size:9px">
      <tr>
        <td style="width:30%; text-align:right; padding:4px">
          <div style="font-weight:bold">المرجع رقم: ${
            data.refNumber || "789962"
          }</div>
        </td>
        <td style="width:40%; text-align:center; padding:4px">
          <div style="font-weight:bold; font-size:11px">رقم التقرير في النظام</div>
          <div style="font-size:8px">In System</div>
        </td>
        <td style="width:30%; text-align:left; padding:4px">
          <div style="font-weight:bold">التاريخ: ${formatDate(data.date)}</div>
        </td>
      </tr>
    </table>
    
    <hr style="border:none; border-top:1px solid #000; margin:8px 0" />
    
    <!-- Introduction Section -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:المقدمة</div>
      <div style="font-size:9px; text-align:right; line-height:1.6">
        <div>تاريخ الإنتاج: ${formatDate(data.producedDate) || "غير محدد"}</div>
        <div>تاريخ انتهاء الصلاحية: ${
          formatDate(data.expiredDate) || "غير محدد"
        }</div>
        <div style="margin-top:4px">تم استلام كل شيء وكان في حالة جيدة.</div>
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- External Appearance -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:المظهر الخارجي</div>
      <div style="font-size:9px; text-align:right">
        تم استلام ${
          data.externalContainers && data.externalContainers.length > 0
            ? data.externalContainers
                .filter((c: any) => c.type && c.quantity)
                .map((c: any) => `(${c.quantity}) ${c.type}`)
                .join(" + ")
            : "حاويات"
        }
        ${data.senderShop ? ` في ${data.senderShop}` : ""}
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- Storage -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:التخزين</div>
      <div style="font-size:9px; text-align:right">
        تم وضع العينات في ${data.samples?.[0]?.storageLocation || "التخزين"}
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #ccc; margin:8px 0" />
    
    <!-- Contents -->
    <div style="margin-bottom:12px">
      <div style="font-weight:bold; font-size:10px; margin-bottom:6px; text-align:right">:ما كان بالداخل</div>
      <div style="font-size:9px; text-align:right">
        تم فتح العينات وتحتوي على أطعمة ومشروبات.
      </div>
    </div>
    
    <hr style="border:none; border-top:1px solid #000; margin:8px 0" />
    
    <!-- Samples Table -->
    <div style="font-weight:bold; font-size:10px; margin:10px 0 6px 0; text-align:right">:جدول العينات</div>
    <table style="width:100%; border-collapse:collapse; font-size:8px">
      <thead>
        <tr style="background:#333; color:#fff">
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">الحاوية الخارجية</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">رقم العينة</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">شكل العينة</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">الوزن</th>
          <th style="border:1px solid #666; padding:6px; text-align:center; font-weight:bold">المستخدم</th>
        </tr>
      </thead>
      <tbody>
        ${
          data.samples && data.samples.length > 0
            ? data.samples
                .map(
                  (sample: any, idx: number) => `
          <tr style="background:${idx % 2 === 0 ? "#fff" : "#f5f5f5"}">
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${
                sample.internalContainers &&
                sample.internalContainers.length > 0
                  ? sample.internalContainers
                      .map((c: any) => `(${c.quantity}) ${c.type}`)
                      .join(" ")
                  : "(1) حاوية"
              }
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">${
              sample.sampleNumber || "S1"
            }</td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${sample.sampleName || "طعام"}
              ${
                sample.systemCaseNumber
                  ? `<div style="font-size:7px; color:#666">${sample.systemCaseNumber}</div>`
                  : ""
              }
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">
              ${sample.netWeight || 0} ${
                    sample.weightUnit === "kg" ? "كجم" : "جرام"
                  }
              <div style="font-size:7px; color:#666">(${
                sample.pureOrTotal === "pure"
                  ? "الوزن الصافي"
                  : "الوزن الإجمالي"
              })</div>
            </td>
            <td style="border:1px solid #ccc; padding:5px; text-align:center">${
              sample.weightUsed || 0
            } جرام</td>
          </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="border:1px solid #ccc; padding:8px; text-align:center">لا توجد عينات</td></tr>'
        }
      </tbody>
    </table>
    
    <!-- Signature -->
    <div style="margin-top:20px; border:1px solid #000; padding:12px">
      <div style="text-align:right; font-size:10px; font-weight:bold; margin-bottom:8px">:التوقيع</div>
      ${
        data.employee?.signature
          ? `
        <div style="text-align:right">
          <img src="${
            data.employee.signature
          }" style="height:50px; border:1px solid #ccc; padding:3px; background:#fff" />
          <div style="margin-top:8px; font-size:8px; line-height:1.6">
            <div>الاسم: ${data.employee.name || ""}</div>
            <div>المنصب: ${data.employee.roles?.name || "Expert"}</div>
            <div>التاريخ: ${formatDate(data.date)}</div>
          </div>
        </div>
      `
          : `<div style="border-bottom:1px solid #000; width:150px; height:40px"></div>`
      }
    </div>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 3,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  // Check if content fits on one page (297mm height)
  if (imgHeight <= 297) {
    // Single page
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    // Split across two pages
    const pageHeight = 297;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -pageHeight, imgWidth, imgHeight);
  }

  return pdf.output("blob");
};
