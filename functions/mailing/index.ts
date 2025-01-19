import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  // Create a new Supabase client
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  // Get the session or user object
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabase.auth.getUser(token);
  const user = data.user;

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: { "Content-Type": "application/json" },
      status: 404,
    });
  }

  // Check if the user is an admin
  const { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  if (!user_roles.some((role) => role.role === "admin")) {
    return new Response(JSON.stringify({ error: "User is not an admin" }), {
      headers: { "Content-Type": "application/json" },
      status: 403,
    });
  }

  // Get the body of the request
  const body = await req.json();
  const rejectionReason = body.rejectionReason;
  const profileId = body.profileId;

  // Get the profile data
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", profileId)
    .single();
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
  const profile = data;

  // TODO: Get the email of the user from the profile data
  // TODO: Create rejection email template
  // TODO: Rename function to sendRejectionEmail

  // Get the email template
  const rawHtml = await fetch(
    "https://sbnginx.l2sh-admissions.ru/confirmation.html"
  ).then((res) => res.text());

  // Populate the email template
  const html = rawHtml
    .replace("{{ .RejectionReason }}", rejectionReason)
    .replace("{{ .ProfileData }}", JSON.stringify(profile, null, 2));

  // Send the email
  const formdata = new FormData();
  formdata.append("name", 'Лицей "Вторая школа"');
  formdata.append("from", "admin@l2sh-admissions.ru");
  formdata.append("subject", "Заявка отклонена");
  formdata.append("to", "grisha.koganovskiy@gmail.com");
  formdata.append("html", html);

  const SMTP_API_URL = Deno.env.get("SMTP_API_URL") ?? "";

  const response = await fetch(SMTP_API_URL, {
    method: "POST",
    headers: {
      Authorization: `${Deno.env.get("SMTP_API_KEY")}`,
    },
    body: formdata,
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to send email" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ foo, html }), {
    headers: { "Content-Type": "application/json" },
    status: 200,
  });
});
