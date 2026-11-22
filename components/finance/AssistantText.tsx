import { Fragment, type ReactNode } from "react"
import Link from "next/link"

/**
 * Renders the small amount of markdown the assistants actually produce:
 * **bold**, [text](/path) links and paragraph breaks.
 *
 * Not a markdown parser, and deliberately not one. This is model output
 * rendered into the page, so the set of things it can turn into is a
 * security decision rather than a formatting one. Only site-relative
 * links survive — anything starting with a scheme, a protocol-relative
 * slash-slash or anything else stays as plain text, so a prompt that
 * talks the model into emitting a link cannot produce a working one
 * pointing off the site.
 */

const BOLD = /\*\*(.+?)\*\*/g
const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

function isSafeInternal(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//")
}

/** Bold runs within one line. */
function withBold(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(BOLD)) {
    const at = match.index ?? 0
    if (at > last) out.push(text.slice(last, at))
    out.push(<strong key={`${keyPrefix}b${at}`}>{match[1]}</strong>)
    last = at + match[0].length
  }
  if (last < text.length) out.push(text.slice(last))
  return out
}

/** Links first, because their label may itself contain bold. */
function withLinks(text: string, keyPrefix: string): ReactNode[] {
  const out: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const at = match.index ?? 0
    if (at > last) out.push(...withBold(text.slice(last, at), `${keyPrefix}t${at}`))

    const [, label, href] = match
    if (isSafeInternal(href)) {
      out.push(
        <Link key={`${keyPrefix}l${at}`} href={href} className="text-teal-700 underline">
          {label}
        </Link>,
      )
    } else {
      /* Keep the words, drop the link. */
      out.push(...withBold(label, `${keyPrefix}u${at}`))
    }
    last = at + match[0].length
  }
  if (last < text.length) out.push(...withBold(text.slice(last), `${keyPrefix}e`))
  return out
}

export function AssistantText({ children }: { children: string }) {
  const paragraphs = children.split(/\n{2,}/)
  return (
    <>
      {paragraphs.map((para, p) => (
        <p key={p} className={p > 0 ? "mt-3" : undefined}>
          {para.split("\n").map((line, l) => (
            <Fragment key={l}>
              {l > 0 && <br />}
              {withLinks(line, `${p}-${l}-`)}
            </Fragment>
          ))}
        </p>
      ))}
    </>
  )
}
