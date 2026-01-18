import { NextRequest } from "next/server";
import { etaPayload } from "@/lib/shipping";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const county = searchParams.get("county") || "";
    const country = searchParams.get("country") || "";
    try {
        return new Response(JSON.stringify(etaPayload(county, country)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ ok: false, error: e?.message || "eta_error" }), { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => ({}));
        const county = String(body?.county || body?.judet || "");
        const country = String(body?.country || body?.tara || "");
        return new Response(JSON.stringify(etaPayload(county, country)), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (e: any) {
        return new Response(JSON.stringify({ ok: false, error: e?.message || "eta_error" }), { status: 500 });
    }
}
