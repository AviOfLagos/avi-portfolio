/**
 * The confirmation email.
 *
 * Built as a table with inline styles on purpose: email clients strip <style>
 * blocks, ignore flexbox and grid, and Outlook renders through Word. Anything
 * fancier than this degrades badly somewhere. Dark background with an explicit
 * light-text fallback, since a client that drops the background would otherwise
 * show bone text on white.
 */

const INK = '#f2f2ef'
const MUTED = '#8b8b93'
const ACCENT = '#c8ff3e'
const BG = '#0a0a0c'
const PANEL = '#121216'
const LINE = '#26262b'

// Same voice as the site's fortune-not cookies: an observation, not a fortune.
const NOT_FORTUNES = [
  'You will ship it. The date is the negotiable part.',
  'A meeting in your future could have been this sentence.',
  'The bug is in the file you already checked. Twice.',
  'Your best idea this quarter is currently a note titled &ldquo;untitled&rdquo;.',
  'You will estimate two weeks. It is not two weeks.',
  'Scope creeps toward the person least able to say no. Stand up straight.',
  'The feature nobody argued about is the one nobody wanted.',
]

export function confirmationSubject() {
  return 'One click and you are in'
}

export function confirmationText(link: string) {
  const fortune = NOT_FORTUNES[Math.floor(Math.random() * NOT_FORTUNES.length)]
    .replace(/&ldquo;|&rdquo;/g, '"')
  return [
    'Almost. One click and you are on the list.',
    '',
    `Confirm: ${link}`,
    '',
    'What you are signing up for: occasional notes on product ownership, shipping AI features, and building from Lagos. No cadence promises. One unsubscribe link in every send. Your address goes nowhere else.',
    '',
    'The link expires in 24 hours. If this was not you, do nothing and it dies quietly.',
    '',
    `A fortune-not cookie for your trouble — no fortune inside, only an observation: ${fortune}`,
    '',
    '— Avi',
    'avi.nexprove.com',
  ].join('\n')
}

export function confirmationHtml(link: string) {
  const fortune = NOT_FORTUNES[Math.floor(Math.random() * NOT_FORTUNES.length)]

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark light">
<title>Confirm your subscription</title>
</head>
<body style="margin:0;padding:0;background:${BG};color:${INK};">
  <!-- Preheader: the grey line next to the subject in the inbox list. -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    One click and you are on the list. The link expires in 24 hours.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:${BG};padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:560px;background:${PANEL};border:1px solid ${LINE};border-radius:16px;">
          <tr>
            <td style="padding:32px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${ACCENT};color:${BG};width:34px;height:34px;border-radius:9px;
                             text-align:center;font-family:Consolas,Menlo,monospace;font-size:17px;font-weight:700;">
                    {a}
                  </td>
                  <td style="padding-left:12px;font-family:Consolas,Menlo,monospace;font-size:11px;
                             letter-spacing:2px;color:${MUTED};text-transform:uppercase;">
                    Notes from the build
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:16px 32px 0;font-family:Helvetica,Arial,sans-serif;">
              <h1 style="margin:0;font-size:28px;line-height:1.2;letter-spacing:-0.5px;color:${INK};font-weight:700;">
                Almost. One click and you are in<span style="color:${ACCENT};">.</span>
              </h1>
              <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:${MUTED};">
                Nothing is stored until you press this. That is the whole point of the button:
                if you did not ask for this, doing nothing is the correct move and the link
                dies on its own in 24 hours.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 32px 6px;" align="left">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="background:${ACCENT};border-radius:8px;">
                    <a href="${link}"
                       style="display:inline-block;padding:14px 28px;font-family:Helvetica,Arial,sans-serif;
                              font-size:15px;font-weight:700;color:${BG};text-decoration:none;">
                      Yes, add me &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:14px 32px 0;font-family:Helvetica,Arial,sans-serif;">
              <p style="margin:0;font-size:12px;line-height:1.6;color:${MUTED};">
                Button not working? Paste this into your browser:<br>
                <a href="${link}" style="color:${ACCENT};word-break:break-all;">${link}</a>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:26px 32px 0;">
              <div style="border-top:1px solid ${LINE};"></div>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 0;font-family:Helvetica,Arial,sans-serif;">
              <p style="margin:0 0 10px;font-family:Consolas,Menlo,monospace;font-size:10px;
                        letter-spacing:1.6px;color:${MUTED};text-transform:uppercase;">
                What you just signed up for
              </p>
              <p style="margin:0;font-size:14px;line-height:1.65;color:${MUTED};">
                Occasional notes on product ownership, shipping AI features, and building from
                Lagos. No cadence promises, an unsubscribe link in every send, and your address
                goes nowhere except the list it was meant for.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:22px 32px 30px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="border:1px dashed ${LINE};border-radius:10px;">
                <tr>
                  <td style="padding:18px 20px;font-family:Helvetica,Arial,sans-serif;">
                    <p style="margin:0;font-size:16px;line-height:1.45;color:${INK};">${fortune}</p>
                    <p style="margin:10px 0 0;font-family:Consolas,Menlo,monospace;font-size:10px;
                              letter-spacing:1.4px;color:${MUTED};text-transform:uppercase;">
                      Not a fortune. An observation.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          <tr>
            <td style="padding:18px 8px 0;font-family:Consolas,Menlo,monospace;font-size:11px;color:${MUTED};">
              Avi &middot; Lagos, Nigeria &middot;
              <a href="https://avi.nexprove.com" style="color:${MUTED};">avi.nexprove.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
