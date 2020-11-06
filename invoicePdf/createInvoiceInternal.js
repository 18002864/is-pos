const fs = require("fs");
const PDFDocument = require("pdfkit");
const nodemailer = require('nodemailer');

function createInvoiceInternal(invoice, response) {
  let doc = new PDFDocument({ size: "A4", margin: 50 });

  generateHeader(doc);
  generateCustomerInformation(doc, invoice);
  generateInvoiceTable(doc, invoice);
  generateFooter(doc);
  doc.pipe(response);
  doc.end();
}

function generateHeader(doc) {
  doc
    .image("logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(20)
    .text("POS - UG", 110, 57)
    .fontSize(10)
    .text("POS - UG", 200, 50, { align: "right" })
    .text("Ciudad de Gutemala", 200, 65, { align: "right" })
    .text("Guatemala, Guatemala, 01000", 200, 80, { align: "right" })
    .moveDown();
}

function generateCustomerInformation(doc, invoice) {
  doc
    .fillColor("#444444")
    .fontSize(20)
    .text("Factura", 50, 160);

  generateHr(doc, 185);

  const customerInformationTop = 200;

  doc
    .fontSize(10)
    .text("No:", 50, customerInformationTop)
    .font("Helvetica-Bold")
    .text(invoice.id_sale, 150, customerInformationTop)
    .font("Helvetica")
    .text("Cliente:", 50, customerInformationTop + 15)
    .text(invoice.customer_id, 150, customerInformationTop + 15)
    .text("", 50, customerInformationTop + 30)
    .text("", 150, customerInformationTop + 30)

    .font("Helvetica-Bold")
    .text(invoice.nombres, 300, customerInformationTop)
    .font("Helvetica")
    .text(invoice.direccion, 300, customerInformationTop + 15)
    .text(invoice.email, 300, customerInformationTop + 30
    )
    .moveDown();

  generateHr(doc, 252);
}

function generateInvoiceTable(doc, invoice) {
  let i;
  const invoiceTableTop = 330;

  doc.font("Helvetica-Bold");
  generateTableRow(
    doc,
    invoiceTableTop,
    "Cantidad",
    "Producto",
    "Precio U.",
    "Descuento",
    "Total"
  );
  generateHr(doc, invoiceTableTop + 20);
  doc.font("Helvetica");

  for (i = 0; i < invoice.products.length; i++) {
    const item = invoice.products[i];
    const position = invoiceTableTop + (i + 1) * 30;
    generateTableRow(
      doc,
      position,
      item.quantity,
      item.product_code,
      formatCurrency(item.unit_price),
      item.discount_percentage + '%',
      formatCurrency(item.total)
    );

    generateHr(doc, position + 20);
  }

  const subtotalPosition = invoiceTableTop + (i + 1) * 30;
  generateTableRow(
    doc,
    subtotalPosition,
    "",
    "",
    "Descuento total: ",
    "",
    formatCurrency(invoice.total_discount)
  );

  const paidToDatePosition = subtotalPosition + 20;
  generateTableRow(
    doc,
    paidToDatePosition,
    "",
    "",
    "Total: ",
    "",
    formatCurrency(invoice.total_sale)
  );
  doc.font("Helvetica");
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "¡Gracias por su compra!",
      50,
      780,
      { align: "center", width: 500 }
    );
}

function generateTableRow(
  doc,
  y,
  item,
  description,
  unitCost,
  quantity,
  lineTotal
) {
  doc
    .fontSize(10)
    .text(item, 50, y)
    .text(description, 150, y)
    .text(unitCost, 280, y, { width: 90, align: "right" })
    .text(quantity, 370, y, { width: 90, align: "right" })
    .text(lineTotal, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();
}

function formatCurrency(cents) {
  return "Q" + (cents).toFixed(2)
  .toString()
  .replace(/\B(?=(\d{3})+(?!\d))/g, ',');;
}

function formatDate(date) {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return year + "/" + month + "/" + day;
}

module.exports = {
  createInvoiceInternal
};