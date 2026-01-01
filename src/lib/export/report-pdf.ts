import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportData } from "@/types/report";

export const generateReportPDF = (data: ReportData): void => {
  const doc = new jsPDF();

  const primaryColor: [number, number, number] = [59, 130, 246]; // Blue
  const secondaryColor: [number, number, number] = [107, 114, 128]; // Gray

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, "-");
  };

  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 30, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("FOOD LAB REPORT", 105, 12, { align: "center" });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Number: ${data.reportNumber}`, 105, 20, { align: "center" });

  doc.setFillColor(243, 244, 246);
  doc.rect(10, 35, 190, 12, "F");

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(`Ref: ${data.refNumber || "------"}`, 15, 42);
  doc.text(`Employee: ${data.employee?.name || "N/A"}`, 75, 42);
  doc.text(`Date: ${formatDate(data.date)}`, 155, 42);

  let yPos = 55;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("1. INTRODUCTION", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text(`Production Date: ${formatDate(data.producedDate)}`, 15, yPos);
  yPos += 5;
  doc.text(`Expiry Date: ${formatDate(data.expiredDate)}`, 15, yPos);
  yPos += 5;
  doc.text(`Barcode: ${data.barcodeNumber || "N/A"}`, 15, yPos);
  yPos += 8;

  doc.setTextColor(0, 0, 0);
  doc.text(
    "All samples were received in good condition and properly stored according to",
    15,
    yPos
  );
  yPos += 5;
  doc.text("laboratory standards.", 15, yPos);
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("2. EXTERNAL CONTAINER DETAILS", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const externalSummary = data.externalContainers
    .filter((c) => c.type && c.quantity)
    .map((c) => `(${c.quantity}) ${c.type}`)
    .join(", ");

  doc.text(`Received: ${externalSummary || "N/A"}`, 15, yPos);
  yPos += 5;
  doc.text(`From: ${data.senderShop || "N/A"}`, 15, yPos);
  yPos += 5;
  doc.text(
    `Received by: ${data.employee?.name || "N/A"} on ${formatDate(data.date)}`,
    15,
    yPos
  );
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("3. INTERNAL CONTAINER DETAILS", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  data.internalContainers
    .filter((c) => c.type)
    .forEach((container) => {
      doc.text(`• ${container.quantity} × ${container.type}`, 15, yPos);
      yPos += 5;
    });

  yPos += 5;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("4. STORAGE INFORMATION", 15, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const storageLocations = [
    ...new Set(data.samples.map((s) => s.storageLocation)),
  ];
  doc.text(
    `Storage Location: ${storageLocations.join(" and ").toUpperCase()}`,
    15,
    yPos
  );
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("5. SAMPLE ANALYSIS", 15, yPos);
  yPos += 7;

  const tableData = data.samples.map((sample) => [
    sample.sampleNumber,
    sample.sampleName,
    `${sample.internalContainerCount} × ${sample.internalContainerType}`,
    `${sample.netWeight} ${sample.weightUnit === "kg" ? "kg" : "g"}`,
    sample.pureOrTotal.toUpperCase(),
    `${sample.weightUsed} g`,
    sample.storageLocation.toUpperCase(),
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [
      ["Sample #", "Type", "Container", "Net Weight", "P/T", "Used", "Storage"],
    ],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [0, 0, 0],
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 15, right: 15 },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 15;

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("Authorized Signature:", 15, finalY);

  if (data.employee?.signature) {
    try {
      doc.addImage(data.employee.signature, "PNG", 15, finalY + 3, 50, 20);
    } catch (error) {
      console.error("Error adding signature:", error);
      doc.line(15, finalY + 25, 75, finalY + 25);
    }
  } else {
    doc.line(15, finalY + 25, 75, finalY + 25);
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text(data.employee?.name || "Employee Name", 15, finalY + 28);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...secondaryColor);
  doc.text(data.employee?.role || "Position", 15, finalY + 33);
  doc.text(`Date: ${formatDate(data.date)}`, 15, finalY + 38);

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...secondaryColor);
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.getWidth() - 30,
      doc.internal.pageSize.getHeight() - 10
    );
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      15,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  const fileName = `Report_${data.refNumber}_${formatDate(data.date).replace(
    /\//g,
    "-"
  )}.pdf`;
  doc.save(fileName);
};
