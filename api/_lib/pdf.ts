import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import qrcode from 'qrcode';
import crypto from 'crypto';
import { prisma } from './prisma';
import { uploadFile } from './supabase';

export async function generateTicketPdf(data: {
  ticketNumber: string;
  holderName: string;
  campName: string;
  eventDate: string;
  ticketIndex: number;
  totalTickets: number;
}): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 420.94]); // Half A4 landscape size

  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  // Deep blue header rectangle
  page.drawRectangle({
    x: 0,
    y: height - 60,
    width: width,
    height: 60,
    color: rgb(26 / 255, 58 / 255, 143 / 255), // #1A3A8F
  });

  page.drawText('MOPCY DYD 2026', {
    x: 20,
    y: height - 40,
    size: 24,
    font: fontBold,
    color: rgb(1, 1, 1),
  });

  // Gold circle placeholder area with text
  page.drawCircle({
    x: width - 60,
    y: height - 30,
    size: 20,
    color: rgb(245 / 255, 166 / 255, 35 / 255), // #F5A623
  });
  // TODO: Replace with actual logo image

  // Event details
  page.drawText('Event: Diocesan Youth Day 2026', {
    x: 20,
    y: height - 100,
    size: 16,
    font: fontBold,
  });
  page.drawText('Theme: Take Courage, Youth in Christ: 40 Years in Mission', {
    x: 20,
    y: height - 125,
    size: 12,
    font,
  });
  page.drawText('Venue: General Headquarters (GHQ), Philippines', {
    x: 20,
    y: height - 145,
    size: 12,
    font,
  });

  // Ticket Holder Details
  page.drawText(`Name: ${data.holderName}`, {
    x: 20,
    y: height - 185,
    size: 14,
    font: fontBold,
  });
  page.drawText(`Camp: ${data.campName}`, {
    x: 20,
    y: height - 205,
    size: 14,
    font,
  });

  // Ticket Info
  page.drawText(`Ticket Number: ${data.ticketNumber}`, {
    x: 20,
    y: height - 245,
    size: 14,
    font: fontBold,
  });
  page.drawText(`Date of Purchase: ${data.eventDate}`, {
    x: 20,
    y: height - 265,
    size: 12,
    font,
  });
  page.drawText(`Ticket ${data.ticketIndex} of ${data.totalTickets}`, {
    x: 20,
    y: height - 285,
    size: 12,
    font,
  });

  // QR Code
  const qrBuffer = await qrcode.toBuffer(data.ticketNumber, { width: 150, margin: 1 });
  const qrImage = await pdfDoc.embedPng(qrBuffer);
  page.drawImage(qrImage, {
    x: width - 180,
    y: height - 260,
    width: 150,
    height: 150,
  });

  // Gold footer rectangle
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 40,
    color: rgb(245 / 255, 166 / 255, 35 / 255), // #F5A623
  });
  page.drawText('This ticket is your entry to the DYD26 Raffle Draw', {
    x: width / 2 - 140,
    y: 15,
    size: 12,
    font: fontBold,
    color: rgb(0, 0, 0),
  });

  return await pdfDoc.save();
}

export async function generateAllTickets(registration: any) {
  const tickets = [];
  const pdfBuffers = [];
  const BUCKET = process.env.SUPABASE_STORAGE_BUCKET || 'dyd26-uploads';
  const eventDate = new Date().toLocaleDateString();

  for (let i = 0; i < registration.ticketCount; i++) {
    const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
    const ticketNumber = `DYD26-${randomHex}`;

    const pdfBytes = await generateTicketPdf({
      ticketNumber,
      holderName: registration.fullName,
      campName: registration.campName,
      eventDate,
      ticketIndex: i + 1,
      totalTickets: registration.ticketCount,
    });

    const pdfBuffer = Buffer.from(pdfBytes);
    const filename = `${ticketNumber}.pdf`;
    const filePath = `tickets/${registration.id}/${filename}`;

    const pdfUrl = await uploadFile(BUCKET, filePath, pdfBuffer, 'application/pdf');

    pdfBuffers.push({ filename, content: pdfBuffer });
    
    // Create ticket record in DB
    const ticket = await prisma.ticket.create({
      data: {
        registrationId: registration.id,
        ticketNumber,
        qrCodeData: ticketNumber, // Decoding QR just returns ticketNumber
        pdfUrl: pdfUrl,
      },
    });

    tickets.push(ticket);
  }

  return { tickets, pdfBuffers };
}
