import { handleLead, initializeForm } from "@/lib/lead-handler";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const GET = initializeForm;
export async function POST(request: Request) { return handleLead(request); }
