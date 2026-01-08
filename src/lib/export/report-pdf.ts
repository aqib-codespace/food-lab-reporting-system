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

const buildSampleContent = (data: ReportData): string => {
  let content = "";
  const externalContainers = data.externalContainers || [];

  externalContainers.forEach((cont, bagIdx) => {
    if (cont.type && cont.quantity) {
      content += `
        <div style="margin-bottom:20px; text-align:right; line-height:1.8">
          <div style="font-weight:bold; margin-bottom:8px">الكيس ${
            bagIdx === 0 ? "الأول" : "الثاني"
          }: عليه رقم الباركود (${data.barcodeNumber || "000001"})، به:</div>
      `;

      const samplesForBag =
        data.samples?.slice(bagIdx * 2, (bagIdx + 1) * 2) || [];
      samplesForBag.forEach((sample, sIdx) => {
        const sampleNum = `ع${bagIdx * 2 + sIdx + 1}`;
        const sampleDesc = sample.sampleName || "سائل";
        const containerDesc =
          sample.internalContainers?.map((c) => c.type).join(" و ") || "علبة";
        const weight = sample.netWeight || 0;
        const weightUnit = sample.weightUnit === "kg" ? "كجم" : "جرام";
        const weightType =
          sample.pureOrTotal === "pure" ? "(صافي)" : "(إجمالي)";
        const weightUsed = sample.weightUsed ? `${sample.weightUsed} جرام` : "";
        const notes = sample.weightNotes || "";

        if (sample.isSwabOnly) {
          content += `<div style="margin:4px 0">${sampleNum}: ${
            notes || "مسحة عالقة بكيس"
          }.</div>`;
        } else {
          content += `<div style="margin:4px 0">${sampleNum}: ${sampleDesc} بعدد (${
            sample.internalContainers?.length || 1
          }) على ${containerDesc}، بوزن: ${weight} ${weightUnit} ${weightType}؛ ${
            weightUsed ? `م: ${weightUsed}. ` : ""
          }${notes ? `م: ${notes}.` : "استهلكت العينة."}</div>`;
        }
      });

      content += `</div>`;
    }
  });

  if (!content) {
    content = `<div style="margin-bottom:20px; text-align:right; line-height:1.8">
      <div style="font-weight:bold; margin-bottom:8px">الكيس الأول: عليه رقم الباركود (${
        data.barcodeNumber || "000001"
      })، به:</div>`;

    (data.samples || []).forEach((sample, idx) => {
      const sampleNum = `ع${idx + 1}`;
      const sampleDesc = sample.sampleName || "سائل";
      const containerDesc =
        sample.internalContainers?.map((c) => c.type).join(" و ") || "علبة";
      const weight = sample.netWeight || 0;
      const weightUnit = sample.weightUnit === "kg" ? "كجم" : "جرام";
      const weightType = sample.pureOrTotal === "pure" ? "(صافي)" : "(إجمالي)";
      const weightUsed = sample.weightUsed ? `${sample.weightUsed} جرام` : "";
      const notes = sample.weightNotes || "";

      if (sample.isSwabOnly) {
        content += `<div style="margin:4px 0">${sampleNum}: ${
          notes || "مسحة عالقة بكيس"
        }.</div>`;
      } else {
        content += `<div style="margin:4px 0">${sampleNum}: ${sampleDesc} بعدد (${
          sample.internalContainers?.length || 1
        }) على ${containerDesc}، بوزن: ${weight} ${weightUnit} ${weightType}؛ ${
          weightUsed ? `م: ${weightUsed}. ` : ""
        }${notes ? `م: ${notes}.` : "استهلكت العينة."}</div>`;
      }
    });

    content += `</div>`;
  }

  return content;
};

export const generateReportPDF = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF("p", "mm", "a4");

  const container = document.createElement("div");
  container.style.width = "210mm";
  container.style.padding = "20mm";
  container.style.backgroundColor = "#fff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.position = "absolute";
  container.style.left = "-99999px";

  const externalContainers = data.externalContainers || [];
  const unexaminedContent = data.unexaminedItems
    ? `
    <div style="margin-top:20px; text-align:right; line-height:1.6">
      <div style="font-weight:bold; margin-bottom:6px">بالإضافة إلى وجود مواد لا يمكن فحصها مثل شريط لاصق.</div>
      <div>${data.unexaminedItems}</div>
    </div>
  `
    : "";

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; margin:0; padding:0; }
      body { font-family: 'Arial', sans-serif; }
    </style>
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; font-size:16px">
      <div style="text-align:left; font-weight:bold">${formatDate(
        data.date
      )}</div>
      <div style="text-align:center; font-weight:bold; font-size:18px">${
        data.employee?.name || "هدى سالم"
      }</div>
      <div style="text-align:right; font-weight:bold">القضية رقم:${
        data.refNumber || "000000"
      }</div>
    </div>
    
    <div style="text-align:right; font-size:14px; line-height:1.8">
      <div style="margin-bottom:25px">
        الطرد عبارة عن عدد (${
          externalContainers.filter((c) => c.type).length || 2
        }) ${
    externalContainers[0]?.type || "كيس بلاستيكي"
  } ابيض اللون من النوع المستخدم في سوق الخضار، بهما:
      </div>
      
      ${buildSampleContent(data)}
      ${unexaminedContent}
    </div>
    
    <div style="margin-top:60px; page-break-inside:avoid">
      <table style="width:100%; border-collapse:collapse; border:1px solid #000">
        <tr>
          <td style="border:1px solid #000; padding:15px; width:50%; text-align:center">
            <div style="font-weight:bold; font-size:16px; margin-bottom:10px">التقدم بالفحص</div>
            <div style="margin:10px 0; font-size:14px">
              ${
                data.employee?.roles?.name || "Senior Expert"
              } - استشاري و الفاحص المختبر الموقع المعتمد<br/>
              ${data.employee?.name || ""}
            </div>
            ${
              data.employee?.signature
                ? `
              <div style="margin:20px 0">
                <img src="${data.employee.signature}" style="height:60px; max-width:150px" />
              </div>
            `
                : `<div style="margin:30px 0">_______________________</div>`
            }
            <div style="font-size:13px; margin-top:10px">
              رقم الفحص: ${data.refNumber || data.reportNumber || ""}<br/>
              التاريخ: ${formatDate(data.date)}
            </div>
          </td>
          <td style="border:1px solid #000; padding:15px; width:50%; text-align:center">
            <div style="font-weight:bold; font-size:16px; margin-bottom:10px">التقدم بالعرض</div>
            <div style="margin:10px 0; font-size:14px">
              خبير مساعد الفاحص الموقع المعتمد
            </div>
            <div style="margin:30px 0">_______________________</div>
            <div style="font-size:13px; margin-top:10px">
              التاريخ: ${formatDate(data.date)}
            </div>
          </td>
        </tr>
      </table>
      
      <div style="text-align:center; margin-top:15px; font-size:12px">
        مركز الفحص المركزي للأغذية<br/>
        صفحة 1 من 1
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= 297) {
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
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

export const generateReportPDFBlob = async (
  data: ReportData
): Promise<Blob> => {
  const pdf = new jsPDF("p", "mm", "a4");

  const container = document.createElement("div");
  container.style.width = "210mm";
  container.style.padding = "20mm";
  container.style.backgroundColor = "#fff";
  container.style.fontFamily = "Arial, sans-serif";
  container.style.direction = "rtl";
  container.style.position = "absolute";
  container.style.left = "-99999px";

  const externalContainers = data.externalContainers || [];
  const unexaminedContent = data.unexaminedItems
    ? `
    <div style="margin-top:20px; text-align:right; line-height:1.6">
      <div style="font-weight:bold; margin-bottom:6px">بالإضافة إلى وجود مواد لا يمكن فحصها مثل شريط لاصق.</div>
      <div>${data.unexaminedItems}</div>
    </div>
  `
    : "";

  container.innerHTML = `
    <style>
      * { box-sizing: border-box; margin:0; padding:0; }
      body { font-family: 'Arial', sans-serif; }
    </style>
    
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:30px; font-size:16px">
      <div style="text-align:left; font-weight:bold">${formatDate(
        data.date
      )}</div>
      <div style="text-align:center; font-weight:bold; font-size:18px">${
        data.employee?.name || "هدى سالم"
      }</div>
      <div style="text-align:right; font-weight:bold">القضية رقم:${
        data.refNumber || "000000"
      }</div>
    </div>
    
    <div style="text-align:right; font-size:14px; line-height:1.8">
      <div style="margin-bottom:25px">
        الطرد عبارة عن عدد (${
          externalContainers.filter((c) => c.type).length || 2
        }) ${
    externalContainers[0]?.type || "كيس بلاستيكي"
  } ابيض اللون من النوع المستخدم في سوق الخضار، بهما:
      </div>
      
      ${buildSampleContent(data)}
      ${unexaminedContent}
    </div>
    
    <div style="margin-top:60px; page-break-inside:avoid">
      <table style="width:100%; border-collapse:collapse; border:1px solid #000">
        <tr>
          <td style="border:1px solid #000; padding:15px; width:50%; text-align:center">
            <div style="font-weight:bold; font-size:16px; margin-bottom:10px">التقدم بالفحص</div>
            <div style="margin:10px 0; font-size:14px">
              ${
                data.employee?.roles?.name || "Senior Expert"
              } - استشاري و الفاحص المختبر الموقع المعتمد<br/>
              ${data.employee?.name || ""}
            </div>
            ${
              data.employee?.signature
                ? `
              <div style="margin:20px 0">
                <img src="${data.employee.signature}" style="height:60px; max-width:150px" />
              </div>
            `
                : `<div style="margin:30px 0">_______________________</div>`
            }
            <div style="font-size:13px; margin-top:10px">
              رقم الفحص: ${data.refNumber || data.reportNumber || ""}<br/>
              التاريخ: ${formatDate(data.date)}
            </div>
          </td>
          <td style="border:1px solid #000; padding:15px; width:50%; text-align:center">
            <div style="font-weight:bold; font-size:16px; margin-bottom:10px">التقدم بالعرض</div>
            <div style="margin:10px 0; font-size:14px">
              خبير مساعد الفاحص الموقع المعتمد
            </div>
            <div style="margin:30px 0">_______________________</div>
            <div style="font-size:13px; margin-top:10px">
              التاريخ: ${formatDate(data.date)}
            </div>
          </td>
        </tr>
      </table>
      
      <div style="text-align:center; margin-top:15px; font-size:12px">
        مركز الفحص المركزي للأغذية<br/>
        صفحة 1 من 1
      </div>
    </div>
  `;

  document.body.appendChild(container);

  const canvas = await html2canvas(container, {
    scale: 2.5,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
    allowTaint: true,
  });

  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");
  const imgWidth = 210;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  if (imgHeight <= 297) {
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
  } else {
    const pageHeight = 297;
    pdf.addImage(imgData, "PNG", 0, 0, imgWidth, pageHeight);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, -pageHeight, imgWidth, imgHeight);
  }

  return pdf.output("blob");
};
