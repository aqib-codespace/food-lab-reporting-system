import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ReportData } from "@/types/report";

export const generateHTMLReportPDF = (data: ReportData): void => {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Professional color palette
  const colors = {
    primary: [30, 64, 175] as [number, number, number],
    primaryLight: [59, 130, 246] as [number, number, number],
    secondary: [107, 114, 128] as [number, number, number],
    accent: [16, 185, 129] as [number, number, number],
    lightBg: [249, 250, 251] as [number, number, number],
    border: [229, 231, 235] as [number, number, number],
    text: [31, 41, 55] as [number, number, number],
    textLight: [107, 114, 128] as [number, number, number],
  };

  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  let yPos = 15;

  // ===== HEADER SECTION =====
  // Gradient-style header
  doc.setFillColor(...colors.primaryLight);
  doc.rect(0, 0, pageWidth, 35, "F");

  // Header text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.text("FOOD LAB REPORT", pageWidth / 2, 18, { align: "center" });

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text(`Report Number: ${data.reportNumber}`, pageWidth / 2, 27, {
    align: "center",
  });

  yPos = 45;

  // ===== INFO BAR =====
  doc.setFillColor(...colors.lightBg);
  doc.roundedRect(10, yPos, pageWidth - 20, 12, 2, 2, "F");

  doc.setFontSize(9);
  doc.setTextColor(...colors.text);
  doc.setFont("helvetica", "bold");
  doc.text(`Ref: ${data.refNumber || "------"}`, 15, yPos + 7);
  doc.text(
    `Employee: ${data.employee?.name || "N/A"}`,
    pageWidth / 2 - 30,
    yPos + 7
  );
  doc.text(`Date: ${formatDate(data.date)}`, pageWidth - 55, yPos + 7);

  yPos += 20;

  // ===== SECTION 1: INTRODUCTION =====
  drawSectionTitle(doc, "1. INTRODUCTION", yPos, colors);
  yPos += 10;

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ["Production Date:", formatDate(data.producedDate)],
      ["Expiry Date:", formatDate(data.expiredDate)],
      ["Barcode Number:", data.barcodeNumber || "N/A"],
    ],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: colors.text,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 130 },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 5;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.textLight);
  const introText = doc.splitTextToSize(
    "All samples were received in good condition and properly stored according to laboratory standards.",
    pageWidth - 30
  );
  doc.text(introText, 15, yPos);
  yPos += introText.length * 5 + 8;

  // ===== SECTION 2: EXTERNAL CONTAINER DETAILS =====
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  drawSectionTitle(doc, "2. EXTERNAL CONTAINER DETAILS", yPos, colors);
  yPos += 10;

  const externalSummary =
    data.externalContainers
      .filter((c) => c.type && c.quantity)
      .map((c) => `${c.quantity} × ${c.type}`)
      .join(", ") || "N/A";

  autoTable(doc, {
    startY: yPos,
    head: [],
    body: [
      ["Containers Received:", externalSummary],
      ["Sender Shop:", data.senderShop || "N/A"],
      [
        "Received By:",
        `${data.employee?.name || "N/A"} on ${formatDate(data.date)}`,
      ],
    ],
    theme: "plain",
    styles: {
      fontSize: 9,
      cellPadding: 3,
      textColor: colors.text,
    },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 50 },
      1: { cellWidth: 130 },
    },
    margin: { left: 15, right: 15 },
  });

  yPos = (doc as any).lastAutoTable.finalY + 10;

  // ===== SECTION 3: INTERNAL CONTAINER DETAILS =====
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  drawSectionTitle(doc, "3. INTERNAL CONTAINER DETAILS", yPos, colors);
  yPos += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.text);
  data.internalContainers
    .filter((c) => c.type)
    .forEach((container) => {
      doc.text(`• ${container.quantity} × ${container.type}`, 20, yPos);
      yPos += 6;
    });

  yPos += 5;

  // ===== SECTION 4: STORAGE INFORMATION =====
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  drawSectionTitle(doc, "4. STORAGE INFORMATION", yPos, colors);
  yPos += 8;

  const storageLocations = [
    ...new Set(data.samples.map((s) => s.storageLocation)),
  ];
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.text);
  doc.text("Storage Location:", 15, yPos);
  doc.setFont("helvetica", "normal");
  doc.text(storageLocations.join(" and ").toUpperCase(), 65, yPos);

  yPos += 12;

  // ===== SECTION 5: SAMPLE ANALYSIS =====
  if (yPos > pageHeight - 80) {
    doc.addPage();
    yPos = 20;
  }

  drawSectionTitle(doc, "5. SAMPLE ANALYSIS", yPos, colors);
  yPos += 10;

  // Create table data with color indicators
  const tableData = data.samples.map((sample) => {
    return [
      sample.sampleNumber,
      sample.sampleName || "N/A",
      `${sample.internalContainerCount} × ${
        sample.internalContainerType || "N/A"
      }`,
      `${sample.netWeight} ${sample.weightUnit}`,
      sample.pureOrTotal.toUpperCase(),
      `${sample.weightUsed}`,
      sample.colorCode, // Store color code for custom rendering
      sample.storageLocation.toUpperCase(),
    ];
  });

  autoTable(doc, {
    startY: yPos,
    head: [
      [
        "Sample",
        "Name",
        "Container",
        "Weight",
        "Type",
        "Used (g)",
        "Color",
        "Storage",
      ],
    ],
    body: tableData,
    theme: "striped",
    headStyles: {
      fillColor: colors.primary,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9,
      halign: "left",
    },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: colors.text,
    },
    columnStyles: {
      0: { cellWidth: 18, fontStyle: "bold", halign: "center" },
      1: { cellWidth: 35 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
      4: { cellWidth: 20, halign: "center" },
      5: { cellWidth: 22, halign: "center" },
      6: { cellWidth: 18, halign: "center" },
      7: { cellWidth: 22, halign: "center" },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    margin: { left: 10, right: 10 },
    didDrawCell: (data: any) => {
      // Draw color box in the Color column
      if (data.column.index === 6 && data.section === "body") {
        const colorCode = data.cell.raw;
        const cellX = data.cell.x;
        const cellY = data.cell.y;
        const cellWidth = data.cell.width;
        const cellHeight = data.cell.height;

        // Draw color box
        doc.setFillColor(colorCode);
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        const boxSize = 8;
        const boxX = cellX + (cellWidth - boxSize) / 2;
        const boxY = cellY + (cellHeight - boxSize) / 2;
        doc.roundedRect(boxX, boxY, boxSize, boxSize, 1, 1, "FD");

        // Clear the text (we only want the color box)
        data.cell.text = "";
      }
    },
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // ===== SIGNATURE SECTION =====
  if (data.employee?.signature) {
    if (yPos > pageHeight - 80) {
      doc.addPage();
      yPos = 20;
    }

    drawSectionTitle(doc, "AUTHORIZED SIGNATURE", yPos, colors);
    yPos += 10;

    // Signature box
    doc.setDrawColor(...colors.border);
    doc.setLineWidth(0.5);
    doc.roundedRect(15, yPos, pageWidth - 30, 45, 3, 3, "S");

    yPos += 8;

    doc.setFontSize(9);
    doc.setTextColor(...colors.textLight);
    doc.setFont("helvetica", "italic");
    doc.text("Received and processed by:", 20, yPos);

    yPos += 8;

    // Add signature image
    try {
      doc.addImage(
        data.employee.signature,
        "PNG",
        20,
        yPos,
        60,
        20,
        undefined,
        "FAST"
      );
    } catch (error) {
      console.warn("Failed to add signature image:", error);
      doc.setFontSize(8);
      doc.setTextColor(...colors.textLight);
      doc.text("[Signature image]", 20, yPos + 10);
    }

    yPos += 25;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...colors.text);
    doc.text(data.employee.name, 20, yPos);

    yPos += 5;

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...colors.textLight);
    doc.text(`${data.employee.email} • ${data.employee.phone}`, 20, yPos);
  }

  // ===== FOOTER =====
  const footerY = pageHeight - 15;
  doc.setDrawColor(...colors.border);
  doc.setLineWidth(0.3);
  doc.line(15, footerY - 5, pageWidth - 15, footerY - 5);

  doc.setFontSize(8);
  doc.setTextColor(...colors.textLight);
  doc.setFont("helvetica", "normal");
  const currentDate = new Date();
  const footerText1 = `Generated on ${currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })} at ${currentDate.toLocaleTimeString("en-GB")}`;
  doc.text(footerText1, pageWidth / 2, footerY, { align: "center" });
  doc.text(
    "Food Laboratory Reporting System • Confidential Document",
    pageWidth / 2,
    footerY + 4,
    { align: "center" }
  );

  // Save the PDF
  doc.save(`Food_Lab_Report_${data.reportNumber}_${new Date().getTime()}.pdf`);
};

// Helper function to draw section titles
function drawSectionTitle(
  doc: jsPDF,
  title: string,
  yPos: number,
  colors: any
) {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Background
  doc.setFillColor(239, 246, 255);
  doc.roundedRect(10, yPos - 6, pageWidth - 20, 10, 2, 2, "F");

  // Left border accent
  doc.setFillColor(
    colors.primaryLight[0],
    colors.primaryLight[1],
    colors.primaryLight[2]
  );
  doc.rect(10, yPos - 6, 3, 10, "F");

  // Title text
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
  doc.text(title, 18, yPos);
}
