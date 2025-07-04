import { NextResponse } from "next/server";
import { summarizeText } from "@/lib/gemini";
import { extractTextFromBuffer } from "@/lib/extractTextFromBuffer";
// import { getDataFromPDF } from "@/helpers/getdataformpdf";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken'
import Summary from "@/models/summaryModel";
import { connect } from "@/dbConfig/dbConfig";
connect();

export async function POST(req) {
  try {
    const { fileBuffer, fileName, fileType } = await req.json();

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("Username: ", decodedToken.username);
    console.log("userID: ", decodedToken.id);
    console.log("email: ", decodedToken.email);

    console.log("Incoming Summarize Request:");
    console.log("fileName:", fileName);
    console.log("fileType:", fileType);

    const buffer = Buffer.from(fileBuffer, "base64");

    let text;
      text = await extractTextFromBuffer(buffer, fileType);
    // text = await extractTextFromBuffer(buffer, fileType);

    const summary = await summarizeText(text);
    console.log(summary);

    const summaryOnDB = new Summary({
      userId: decodedToken.id,
      extractedText: text,
      summary: summary,
      title: fileName
    });

    const savedSummary = await summaryOnDB.save();
    console.log(savedSummary)

    return NextResponse.json({ success: true, summary, id: summaryOnDB._id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Summarization failed" },
      { status: 500 }
    );
  }
}
