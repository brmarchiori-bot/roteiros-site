type JsonLdProps = {
  /** Objeto único ou array de objetos Schema.org */
  data: object | object[]
  id?: string
}

/**
 * Renderiza Schema.org JSON-LD num <script>.
 * Server component — não vai pro bundle do client.
 */
export function JsonLd({ data, id }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      id={id}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  )
}
