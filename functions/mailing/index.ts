import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req: Request) => {
  try {
    if (!(await isAdmin(req))) {
      return new Response(JSON.stringify({ error: "User is not an admin" }), {
        headers: { "Content-Type": "application/json" },
        status: 403,
      });
    }

    const body = await req.json();
    const rejectionReason = body.rejectionReason;
    const profileData = body.profileData;

    // TODO: Get the email of the user from the profile data
    // TODO: Create rejection email template
    // TODO: Rename function to sendRejectionEmail

    const html = await getEmailHtml(rejectionReason, profileData);

    await sendEmail(html);

    return new Response(JSON.stringify({ message: "Email sent" }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});

const isAdmin = async (req: Request) => {
  const supabase = getSupabaseClient();
  const user = await getUser(req, supabase);
  return isUserAdmin(user, supabase);
};

const getSupabaseClient = () => {
  return createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );
};

const getUser = async (req: Request, supabase: any) => {
  const authHeader = req.headers.get("Authorization")!;
  const token = authHeader.replace("Bearer ", "");
  const { data } = await supabase.auth.getUser(token);
  if (!data || !data.user) throw new Error("User not found");
  return data.user;
};

const isUserAdmin = async (user: any, supabase: any) => {
  const { data: user_roles, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);
  if (error) {
    throw new Error(error.message);
  }

  return user_roles.some((role) => role.role === "admin");
};

const getEmailHtml = async (rejectionReason: string, profileData: any) => {
  const rawHtml = await fetch(
    "https://sbnginx.l2sh-admissions.ru/confirmation.html"
  ).then((res) => res.text());

  return rawHtml
    .replace("{{ .RejectionReason }}", rejectionReason)
    .replace("{{ .ProfileData }}", JSON.stringify(profileData, null, 2));
};

const sendEmail = async (html: string) => {
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

  if (!response.ok) throw new Error("Failed to send email");
};
