const { jsPDF } = require("jspdf");
require("jspdf-autotable");
const XLSX = require("xlsx");

const toPdfBuffer = async ({ title, rows }) => {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 18);

  if (rows.length) {
    const headers = Object.keys(rows[0]);
    const body = rows.map((row) => headers.map((key) => String(row[key] ?? "")));

    doc.autoTable({
      head: [headers],
      body,
      startY: 24,
      styles: { fontSize: 8 }
    });
  } else {
    doc.setFontSize(11);
    doc.text("No report data available", 14, 30);
  }

  return Buffer.from(doc.output("arraybuffer"));
};

const toExcelBuffer = async ({ sheetName, rows }) => {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{ info: "No data available" }]);
  XLSX.utils.book_append_sheet(workbook, worksheet, (sheetName || "Report").slice(0, 31));
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
};

module.exports = {
  toPdfBuffer,
  toExcelBuffer
};
