import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

type Params = { params: { id: string } };

// Fetch one CV by its id
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const { data, error } = await supabaseAdmin
      .from("cvs")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Supabase fetch error:", error);
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    console.error("GET /api/cv/[id] crashed:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}

// Update a CV's data (used for autosave as the user types)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    const body = await req.json().catch(() => ({}));

    const { error } = await supabaseAdmin
      .from("cvs")
      .update({
        title: body.title,
        data: body.data,
      })
      .eq("id", params.id);

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("PATCH /api/cv/[id] crashed:", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown server error" },
      { status: 500 }
    );
  }
}
