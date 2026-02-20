export const template = (contact: { name: string; email: string; message: string }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .padding-mobile {
        padding: 20px !important;
      }
      .header-title {
        font-size: 20px !important;
      }
      .body-text {
        font-size: 14px !important;
      }
      .message-box {
        padding: 16px !important;
      }
    }
  </style>
</head>

<body style="margin:0;padding:0;background:#eef2ff;font-family:Arial,Helvetica,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="padding:32px 12px;background:linear-gradient(180deg,#eef2ff 0%,#f8fafc 100%);">
    <tr>
      <td align="center">

        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0"
          class="container"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td class="padding-mobile"
              style="background:linear-gradient(135deg,#6366f1,#8b5cf6,#ec4899);padding:32px 24px;color:#ffffff;text-align:left;">
              
              <div style="font-size:13px;opacity:0.9;margin-bottom:6px;">
                Portfolio Notification
              </div>

              <h1 class="header-title"
                style="margin:0;font-size:24px;font-weight:700;letter-spacing:0.3px;">
                ✨ New Contact Message
              </h1>

              <div style="margin-top:8px;font-size:14px;opacity:0.9;">
                Someone just reached out from your portfolio
              </div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td class="padding-mobile body-text"
              style="padding:28px 26px;color:#4b5563;font-size:15px;line-height:1.7;">

              <p style="margin-top:0;margin-bottom:18px;">
                You’ve received a new inquiry. Details are below:
              </p>

              <!-- Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                style="background:linear-gradient(180deg,#eef2ff 0%,#ffffff 100%);
                       border:1px solid #e0e7ff;
                       border-radius:18px;
                       padding:24px;
                       margin:24px 0;">

                <!-- NAME -->
                <tr>
                  <td style="padding:12px 0;">
                    <div style="font-size:12px;color:#6366f1;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">
                      👤 Name
                    </div>
                    <div style="font-size:17px;color:#4338ca;font-weight:700;margin-top:6px;">
                      ${contact.name}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff);"></td>
                </tr>

                <!-- EMAIL -->
                <tr>
                  <td style="padding:16px 0;">
                    <div style="font-size:12px;color:#6366f1;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">
                      📧 Email
                    </div>
                    <div style="font-size:16px;color:#4f46e5;font-weight:700;margin-top:6px;">
                      ${contact.email}
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="height:1px;background:linear-gradient(90deg,#e0e7ff,#c7d2fe,#e0e7ff);"></td>
                </tr>

                <!-- MESSAGE -->
                <tr>
                  <td style="padding:18px 0 6px 0;">
                    <div style="font-size:12px;color:#6366f1;font-weight:700;letter-spacing:0.7px;text-transform:uppercase;">
                      💬 Message
                    </div>

                    <div class="message-box"
                      style="margin-top:14px;
                             background:linear-gradient(180deg,#ffffff,#f5f7ff);
                             border:1px solid #e0e7ff;
                             border-left:6px solid #6366f1;
                             border-radius:14px;
                             padding:20px;
                             font-size:15px;
                             line-height:1.75;
                             color:#4b5563;
                             white-space:pre-wrap;
                             box-shadow:0 8px 20px rgba(99,102,241,0.15);">
                      ${contact.message}
                    </div>
                  </td>
                </tr>

              </table>

              <!-- Footer note -->
              <div style="font-size:13px;color:#6b7280;margin-top:6px;">
                🚀 Sent automatically from your Portfolio CMS.
              </div>

            </td>
          </tr>

          <!-- Bottom Footer -->
          <tr>
            <td style="text-align:center;padding:18px;background:#fafafa;border-top:1px solid #eee;font-size:12px;color:#9ca3af;">
              © ${new Date().getFullYear()} Atul Portfolio • Built with care
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};