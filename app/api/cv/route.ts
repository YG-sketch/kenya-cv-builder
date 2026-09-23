import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

// Creates a new blank (or pre-filled) CV row and returns its id
export async function POST(req: NextRequest) {
  const supabaseAdmin = getSupabaseAdmin();
  const body = await req.json().catch(() => ({}));

  const { data, error } = await supabaseAdmin
    .from("cvs")
    .insert({
      title: body.title ?? "My CV",
      template: "classic",
      data: body.data ?? {},
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data.id });
}
